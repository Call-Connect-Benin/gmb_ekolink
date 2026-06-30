import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyN8n } from "@/lib/notify";

export const runtime = "nodejs";

/** Webhook Stripe : confirme le paiement → commande "paid" + fiche "sold". */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 400 });
  }

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  const admin = createAdminClient();

  // E2 — Idempotence robuste : on n'écrit l'event comme « traité » qu'APRÈS succès
  // (pas de delete-on-fail, qui crée une course). La vraie idempotence vient des
  // updates gardés par `status='pending'` (ré-exécuter ne double rien). Un event
  // déjà enregistré = retry d'un event abouti → on acquitte sans rejouer.
  const { data: already } = await admin
    .from("processed_stripe_events").select("event_id").eq("event_id", event.id).maybeSingle();
  if (already) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // M2 — ne traiter que les paiements réellement encaissés (rejette les async "unpaid").
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, ignored: "unpaid" });
    }

    const orderId = session.metadata?.order_id;
    const listingId = session.metadata?.listing_id;
    let changed = false;

    if (orderId) {
      // Commande + jointures (montant attendu + données de facturation de confiance).
      const { data: order } = await admin
        .from("orders")
        .select("amount,buyer_id,listing:listings(title,city)")
        .eq("id", orderId)
        .maybeSingle();
      if (order) {
        const expected = Math.round(Number(order.amount) * 100);
        // M2 — montant ET devise doivent correspondre.
        const amountOk = session.amount_total == null || session.amount_total === expected;
        const currencyOk = !session.currency || session.currency.toLowerCase() === "eur";
        if (!amountOk || !currencyOk) {
          await notifyN8n("order.amount_mismatch", { orderId, listingId, expected, paid: session.amount_total, currency: session.currency });
          return NextResponse.json({ received: true, ignored: "amount_or_currency_mismatch" });
        }
      }

      // C2 (durci) — snapshot de facturation posé ici depuis des données de CONFIANCE
      // (admin client, jamais l'entrée utilisateur) au moment du paiement.
      const lst = Array.isArray(order?.listing) ? order?.listing[0] : order?.listing;
      let billing: Record<string, unknown> = {};
      if (order?.buyer_id) {
        const { data: prof } = await admin.from("profiles").select("full_name,email").eq("id", order.buyer_id).maybeSingle();
        billing = {
          billing_name: prof?.full_name ?? null,
          billing_email: prof?.email ?? session.customer_details?.email ?? null,
          listing_title: lst?.title ?? null,
          listing_city: lst?.city ?? null,
        };
      }

      // E1 — Mise à jour conditionnée au statut 'pending' : empêche d'écraser une
      // commande annulée et permet de ne notifier que si une ligne a réellement changé.
      const { data: updated, error: oErr } = await admin
        .from("orders").update({ status: "paid", ...billing }).eq("id", orderId).eq("status", "pending").select("id");
      // Erreur DB → 500 sans marquer l'event traité : Stripe rejouera (opérations idempotentes).
      if (oErr) return NextResponse.json({ error: oErr.message }, { status: 500 });
      changed = (updated?.length ?? 0) > 0;
    }

    if (changed && listingId) {
      const { error: lErr } = await admin.from("listings").update({ status: "sold" }).eq("id", listingId);
      if (lErr) return NextResponse.json({ error: lErr.message }, { status: 500 });
    }

    // Email de confirmation + notification équipe (n8n) — uniquement si la commande
    // vient effectivement de passer à 'paid' (jamais en double).
    if (changed) {
      await notifyN8n("order.paid", {
        orderId,
        listingId,
        buyerId: session.metadata?.buyer_id,
        email: session.customer_details?.email ?? session.customer_email,
        amount: session.amount_total,
        currency: session.currency,
      });
    }
  }

  // M1 — Session expirée/abandonnée : on libère la fiche réservée et on annule la commande.
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const listingId = session.metadata?.listing_id;

    // Erreurs DB remontées (500 sans marquer l'event traité → Stripe rejoue).
    if (listingId) {
      const { error } = await admin.from("listings").update({ status: "available" }).eq("id", listingId).eq("status", "reserved");
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (orderId) {
      const { error } = await admin.from("orders").update({ status: "cancelled" }).eq("id", orderId).eq("status", "pending");
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Marque l'event traité APRÈS succès. Un conflit éventuel (course bénigne entre
  // deux livraisons quasi simultanées) est ignoré : les opérations sont idempotentes.
  await admin.from("processed_stripe_events").insert({ event_id: event.id });

  return NextResponse.json({ received: true });
}
