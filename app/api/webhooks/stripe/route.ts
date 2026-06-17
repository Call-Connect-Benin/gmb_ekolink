import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ============================================================
// WEBHOOK STRIPE DÉSACTIVÉ.
// Le paiement n'est plus interne : l'achat se fait via WhatsApp et l'admin
// valide manuellement le statut de la commande dans /admin/commandes
// (payé → fiche vendue, annulé → fiche disponible).
// L'ancien handler (idempotence, vérif montant/devise, snapshot facturation,
// libération sur expiration) reste dans l'historique git.
// ============================================================
export async function POST() {
  return NextResponse.json({ received: true, disabled: true });
}
