import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ============================================================
// PAIEMENT STRIPE INTERNE DÉSACTIVÉ.
// Le parcours d'achat passe désormais par WhatsApp + validation admin
// (voir app/fiches-google/purchase.ts → requestPurchaseAction, et BuyButton).
// L'ancien code Stripe (session checkout, réservation, métadonnées) reste
// disponible dans l'historique git si une réactivation est nécessaire.
// ============================================================
export async function POST() {
  return NextResponse.json(
    { error: "Le paiement en ligne est désactivé. Finalisez votre demande via WhatsApp." },
    { status: 410 }
  );
}
