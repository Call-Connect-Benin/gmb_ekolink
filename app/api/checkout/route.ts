import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { isStripeConfigured, isSupabaseConfigured } from "@/lib/supabase/config";
import type { Listing } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isSupabaseConfigured() || !isStripeConfigured()) {
    return NextResponse.json(
      { error: "Paiement non configuré (Supabase/Stripe — voir .env.local)." },
      { status: 503 }
    );
  }

  let listingId: string | undefined;
  try {
    ({ listingId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  if (!listingId) {
    return NextResponse.json({ error: "Fiche manquante." }, { status: 400 });
  }

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { data } = await sb
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .maybeSingle();
  const listing = data as Listing | null;
  if (!listing) {
    return NextResponse.json({ error: "Fiche introuvable." }, { status: 404 });
  }
  if (listing.status !== "available") {
    return NextResponse.json({ error: "Cette fiche n'est plus disponible." }, { status: 409 });
  }

  // M1 — Réservation atomique : seul le premier acheteur concurrent passe.
  // Le `where status = 'available'` est appliqué au niveau de la ligne par Postgres,
  // donc deux requêtes simultanées ne peuvent pas réserver la même fiche.
  const admin = createAdminClient();
  const { data: reserved, error: resErr } = await admin
    .from("listings")
    .update({ status: "reserved" })
    .eq("id", listing.id)
    .eq("status", "available")
    .select("id");
  if (resErr) {
    return NextResponse.json({ error: "Impossible de réserver la fiche." }, { status: 500 });
  }
  if (!reserved || reserved.length === 0) {
    return NextResponse.json({ error: "Cette fiche vient d'être réservée." }, { status: 409 });
  }

  // Libère la réservation si la suite échoue (création commande / session Stripe).
  const release = () => admin.from("listings").update({ status: "available" }).eq("id", listing.id).eq("status", "reserved");

  // Crée la commande en attente (RLS : buyer_id = utilisateur courant).
  // Le snapshot de facturation (billing_*) est posé par le webhook au paiement,
  // depuis des données de confiance (jamais l'entrée utilisateur).
  const { data: order, error: orderErr } = await sb
    .from("orders")
    .insert({
      listing_id: listing.id,
      buyer_id: user.id,
      amount: listing.price,
      status: "pending",
    })
    .select()
    .single();
  if (orderErr || !order) {
    await release();
    return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
  }

  const stripe = getStripe();
  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      // Expiration courte : libère automatiquement la fiche si le paiement n'aboutit pas.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: listing.price * 100,
            product_data: {
              name: listing.title,
              description: `Fiche Google Business — ${listing.city}`,
            },
          },
        },
      ],
      metadata: {
        order_id: order.id,
        listing_id: listing.id,
        buyer_id: user.id,
      },
      success_url: `${site}/compte?success=1`,
      cancel_url: `${site}/fiches-google/${listing.slug}?canceled=1`,
    });

    await sb.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch {
    // Échec Stripe : on libère la fiche et on annule la commande créée.
    await release();
    await admin.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return NextResponse.json({ error: "Échec de création du paiement." }, { status: 502 });
  }
}
