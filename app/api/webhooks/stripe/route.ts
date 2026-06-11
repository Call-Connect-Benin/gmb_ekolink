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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // M2 — ne traiter que les paiements réellement encaissés (rejette les async "unpaid").
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, ignored: "unpaid" });
    }

    const orderId = session.metadata?.order_id;
    const listingId = session.metadata?.listing_id;
    const admin = createAdminClient();

    if (orderId) {
      // M2 — vérifie que le montant payé correspond au montant attendu de la commande.
      const { data: order } = await admin.from("orders").select("amount").eq("id", orderId).maybeSingle();
      if (order) {
        const expected = Math.round(Number(order.amount) * 100);
        if (session.amount_total != null && session.amount_total !== expected) {
          await notifyN8n("order.amount_mismatch", { orderId, listingId, expected, paid: session.amount_total });
          // Anomalie : on ne livre pas, mais on acquitte pour éviter une boucle de retry.
          return NextResponse.json({ received: true, ignored: "amount_mismatch" });
        }
      }

      const { error: oErr } = await admin.from("orders").update({ status: "paid" }).eq("id", orderId);
      if (oErr) return NextResponse.json({ error: oErr.message }, { status: 500 });
    }
    if (listingId) {
      const { error: lErr } = await admin.from("listings").update({ status: "sold" }).eq("id", listingId);
      if (lErr) return NextResponse.json({ error: lErr.message }, { status: 500 });
    }

    // Email de confirmation + notification équipe (n8n) — CDC §2.4
    await notifyN8n("order.paid", {
      orderId,
      listingId,
      buyerId: session.metadata?.buyer_id,
      email: session.customer_details?.email ?? session.customer_email,
      amount: session.amount_total,
      currency: session.currency,
    });
  }

  // M1 — Session expirée/abandonnée : on libère la fiche réservée et on annule la commande.
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    const listingId = session.metadata?.listing_id;
    const admin = createAdminClient();

    if (listingId) {
      await admin.from("listings").update({ status: "available" }).eq("id", listingId).eq("status", "reserved");
    }
    if (orderId) {
      await admin.from("orders").update({ status: "cancelled" }).eq("id", orderId).eq("status", "pending");
    }
  }

  return NextResponse.json({ received: true });
}
