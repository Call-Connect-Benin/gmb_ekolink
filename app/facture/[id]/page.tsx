import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getLocale } from "next-intl/server";
import PrintButton from "../PrintButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Facture", robots: { index: false, follow: false } };

type Listing = { title: string | null; city: string | null };
type OrderRow = { id: string; amount: number; status: string; created_at: string; buyer_id: string; listing: Listing | Listing[] | null };
const one = (x: OrderRow["listing"]) => (Array.isArray(x) ? x[0] : x);

export default async function Facture({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const en = (await getLocale()) === "en";

  if (!isSupabaseConfigured()) notFound();
  const sb = await createClient();
  // RLS : seule une commande appartenant à l'utilisateur courant est renvoyée.
  const { data } = await sb
    .from("orders")
    .select("id,amount,status,created_at,buyer_id,listing:listings(title,city)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const order = data as OrderRow;
  const listing = one(order.listing);
  // « Facturé à » = l'acheteur de la commande (pas le viewer). RLS : self_read ou is_admin.
  const { data: buyer } = await sb.from("profiles").select("full_name,email,phone").eq("id", order.buyer_id).maybeSingle();
  const profile = buyer as { full_name: string | null; email: string | null; phone: string | null } | null;
  const isPaid = ["paid", "in_progress", "delivered", "validated"].includes(order.status);

  const ttc = order.amount;
  const ht = +(ttc / 1.2).toFixed(2);
  const tva = +(ttc - ht).toFixed(2);
  const eur = (v: number) => v.toLocaleString(en ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €";
  const date = new Date(order.created_at).toLocaleDateString(en ? "en-US" : "fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const T = {
    back: en ? "Back to my invoices" : "Retour à mes factures",
    print: en ? "Print / Download (PDF)" : "Imprimer / Télécharger (PDF)",
    invoice: en ? "INVOICE" : "FACTURE",
    no: en ? "Invoice no." : "Facture n°",
    date: en ? "Date" : "Date",
    billedTo: en ? "Billed to" : "Facturé à",
    desc: en ? "Description" : "Désignation",
    qty: en ? "Qty" : "Qté",
    unit: en ? "Unit (incl. tax)" : "PU TTC",
    total: en ? "Total" : "Total",
    subtotal: en ? "Subtotal (excl. tax)" : "Sous-total HT",
    vat: en ? "VAT (20%)" : "TVA (20%)",
    grand: en ? "Total (incl. tax)" : "Total TTC",
    item: en ? "Google Business listing" : "Fiche Google Business",
    paid: en ? "Paid" : "Payée",
    pending: en ? "Pending" : "En attente",
    thanks: en ? "Thank you for your purchase." : "Merci pour votre achat.",
  };

  return (
    <main id="main" className="min-h-screen bg-[#eef2f7] px-4 py-10 print:bg-white print:p-0">
      <div className="mx-auto max-w-[820px]">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link href="/compte/documents" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" /> {T.back}</Link>
          <PrintButton label={T.print} />
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm print:border-0 print:shadow-none sm:p-12">
          {/* En-tête */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-6">
            <div>
              <p className="text-2xl font-extrabold tracking-tight"><span className="text-primary">Eko</span>Link</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                EkoLink S.A.S.<br />
                7 Rue Vulpian, 75013 Paris<br />
                SIRET 1179695284<br />
                contact@ekolink.fr
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold tracking-wide text-foreground/80">{T.invoice}</p>
              <p className="mt-2 text-sm text-muted-foreground">{T.no} <span className="font-semibold text-foreground">FACT-{order.id.slice(0, 8).toUpperCase()}</span></p>
              <p className="text-sm text-muted-foreground">{T.date} : <span className="font-semibold text-foreground">{date}</span></p>
              <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${isPaid ? "bg-success/12 text-success" : "bg-accent/15 text-[#b25e00]"}`}>{isPaid ? T.paid : T.pending}</span>
            </div>
          </div>

          {/* Client */}
          <div className="py-6">
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{T.billedTo}</p>
            <p className="mt-1 font-semibold">{profile?.full_name || "—"}</p>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            {profile?.phone && <p className="text-sm text-muted-foreground">{profile.phone}</p>}
          </div>

          {/* Lignes */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="py-2.5">{T.desc}</th>
                <th className="py-2.5 text-center">{T.qty}</th>
                <th className="py-2.5 text-right">{T.unit}</th>
                <th className="py-2.5 text-right">{T.total}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-4">
                  <p className="font-semibold">{T.item}</p>
                  <p className="text-muted-foreground">{listing?.title || "—"}{listing?.city ? ` — ${listing.city}` : ""}</p>
                </td>
                <td className="py-4 text-center">1</td>
                <td className="py-4 text-right">{eur(ttc)}</td>
                <td className="py-4 text-right font-semibold">{eur(ttc)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totaux */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-[280px] space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{T.subtotal}</span><span>{eur(ht)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{T.vat}</span><span>{eur(tva)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold"><span>{T.grand}</span><span className="text-primary">{eur(ttc)}</span></div>
            </div>
          </div>

          <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">{T.thanks}</p>
        </div>
      </div>
    </main>
  );
}
