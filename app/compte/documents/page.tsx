import Link from "next/link";
import { FileText, Download, Files } from "lucide-react";
import { Panel } from "../../components/dashboard/ui";
import { EmptyMini } from "../../components/dashboard/list";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes factures", robots: { index: false, follow: false } };

type Row = { id: string; amount: number; status: string; created_at: string; listing: { title: string | null } | { title: string | null }[] | null };

const one = (x: Row["listing"]) => (Array.isArray(x) ? x[0] : x);

export default async function MesDocuments() {
  const t = await getTranslations("dash.documents");
  const locale = await getLocale();
  const en = locale === "en";
  const eur = (v: number) => v.toLocaleString(en ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €";

  let rows: Row[] = [];
  if (isSupabaseConfigured()) {
    const sb = await createClient();
    const { data } = await sb
      .from("orders")
      .select("id,amount,status,created_at,listing:listings(title)")
      .order("created_at", { ascending: false });
    rows = (data as Row[]) ?? [];
  }
  // Une facture est émise dès que la commande est payée.
  const invoices = rows.filter((r) => ["paid", "in_progress", "delivered", "validated"].includes(r.status));

  const T = {
    title: en ? "My invoices" : "Mes factures",
    subtitle: en ? "Download the invoices for your paid orders." : "Téléchargez les factures de vos commandes payées.",
    total: en ? "Available invoices" : "Factures disponibles",
    invoice: en ? "Invoice" : "Facture",
    thFiche: en ? "Listing" : "Fiche",
    thDate: en ? "Date" : "Date",
    thAmount: en ? "Amount" : "Montant",
    view: en ? "Invoice" : "Facture",
    empty: en ? "No invoice yet — your paid orders will appear here." : "Aucune facture pour le moment — vos commandes payées apparaîtront ici.",
  };

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{T.title}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{T.subtitle}</p>
      </div>

      <Panel className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10"><Files className="size-7 text-primary" /></span>
        <div className="flex-1"><p className="text-sm text-muted-foreground">{T.total}</p><p className="text-3xl font-extrabold leading-tight">{invoices.length}</p></div>
      </Panel>

      <Panel className="p-0">
        {invoices.length === 0 ? (
          <div className="p-6"><EmptyMini label={T.empty} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-5 py-3">{T.invoice}</th><th className="px-3 py-3">{T.thFiche}</th><th className="px-3 py-3">{T.thDate}</th><th className="px-3 py-3">{T.thAmount}</th><th className="px-5 py-3"></th></tr></thead>
              <tbody>
                {invoices.map((o) => (
                  <tr key={o.id} className="border-b border-border/70 last:border-0">
                    <td className="px-5 py-4 font-bold text-primary">FACT-{o.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-3 py-4 text-foreground/80">{one(o.listing)?.title ?? "—"}</td>
                    <td className="px-3 py-4 text-muted-foreground">{o.created_at.slice(0, 10)}</td>
                    <td className="px-3 py-4 font-bold">{eur(o.amount)}</td>
                    <td className="px-5 py-4">
                      <Link href={`/facture/${o.id}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-secondary">
                        <Download className="size-4" /> {T.view}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[linear-gradient(120deg,#eff5ff,#ffffff)] p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10"><FileText className="size-5 text-primary" /></span>
        <p className="flex-1 text-sm text-muted-foreground">{en ? "An invoice is generated automatically for each paid order." : "Une facture est générée automatiquement pour chaque commande payée."}</p>
      </div>
    </div>
  );
}
