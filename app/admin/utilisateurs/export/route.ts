import { NextResponse } from "next/server";
import { isCurrentUserAdmin } from "@/lib/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

type ProfileRow = { full_name: string | null; email: string | null; role: string | null; phone: string | null; created_at: string | null };

export async function GET() {
  if (!(await isCurrentUserAdmin())) {
    return new NextResponse("Accès refusé", { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return new NextResponse("Supabase non configuré", { status: 503 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("full_name,email,role,phone,created_at")
    .order("created_at");

  const rows = (data as ProfileRow[] | null) ?? [];
  const csv = toCsv(
    ["nom", "email", "role", "telephone", "cree_le"],
    rows.map((p) => [p.full_name ?? "", p.email ?? "", p.role ?? "", p.phone ?? "", p.created_at ?? ""])
  );

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="utilisateurs.csv"',
    },
  });
}
