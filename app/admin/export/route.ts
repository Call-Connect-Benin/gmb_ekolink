import { NextResponse } from "next/server";
import { getAllOrders, isCurrentUserAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isCurrentUserAdmin())) {
    return new NextResponse("Accès refusé", { status: 403 });
  }
  const orders = await getAllOrders();
  const header = ["id", "date", "fiche", "ville", "montant_eur", "statut", "acheteur_id"].join(";");
  const rows = orders.map((o) =>
    [
      o.id,
      o.created_at,
      (o.listing?.title ?? "").replace(/;/g, ","),
      o.listing?.city ?? "",
      o.amount,
      o.status,
      o.buyer_id,
    ].join(";")
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="commandes.csv"',
    },
  });
}
