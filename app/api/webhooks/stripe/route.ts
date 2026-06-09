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
    const orderId = session.metadata?.order_id;
    const listingId = session.metadata?.listing_id;
    const admin = createAdminClient();

    if (orderId) {
      await admin.from("orders").update({ status: "paid" }).eq("id", orderId);
    }
    if (listingId) {
      await admin.from("listings").update({ status: "sold" }).eq("id", listingId);
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

  return NextResponse.json({ received: true });
}
