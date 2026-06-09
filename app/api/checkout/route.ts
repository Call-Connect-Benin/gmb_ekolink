import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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

  // Crée la commande en attente (RLS : buyer_id = utilisateur courant)
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
    return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
  }

  const stripe = getStripe();
  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
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
}
