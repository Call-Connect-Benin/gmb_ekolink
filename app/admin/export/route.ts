import { NextResponse } from "next/server";
import { getAllOrders, isCurrentUserAdmin } from "@/lib/queries";
import { toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isCurrentUserAdmin())) {
    return new NextResponse("Accès refusé", { status: 403 });
  }
  const orders = await getAllOrders();
  const csv = toCsv(
    ["id", "date", "fiche", "ville", "montant_eur", "statut", "acheteur_id"],
    orders.map((o) => [o.id, o.created_at, o.listing?.title ?? "", o.listing?.city ?? "", o.amount, o.status, o.buyer_id])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="commandes.csv"',
    },
  });
}
