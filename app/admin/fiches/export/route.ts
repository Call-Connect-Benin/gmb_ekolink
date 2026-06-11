import { NextResponse } from "next/server";
import { isCurrentUserAdmin } from "@/lib/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

type ListingRow = { title: string | null; slug: string | null; category_slug: string | null; city: string | null; price: number | null; status: string | null; created_at: string | null };

export async function GET() {
  if (!(await isCurrentUserAdmin())) {
    return new NextResponse("Accès refusé", { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return new NextResponse("Supabase non configuré", { status: 503 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("listings")
    .select("title,slug,category_slug,city,price,status,created_at")
    .order("created_at", { ascending: false });

  const rows = (data as ListingRow[] | null) ?? [];
  const csv = toCsv(
    ["titre", "slug", "categorie", "ville", "prix_eur", "statut", "cree_le"],
    rows.map((r) => [r.title ?? "", r.slug ?? "", r.category_slug ?? "", r.city ?? "", r.price ?? "", r.status ?? "", r.created_at ?? ""])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="fiches.csv"',
    },
  });
}
