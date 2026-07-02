import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, UserRound, Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isCurrentUserAdmin } from "@/lib/queries";
import { getLocale } from "next-intl/server";
import PrintButton from "../PrintButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Facture", robots: { index: false, follow: false } };

type Listing = { title: string | null; city: string | null };
type OrderRow = { id: string; amount: number; status: string; created_at: string; buyer_id: string; invoice_number: number | null; billing_name: string | null; billing_email: string | null; listing_title: string | null; listing_city: string | null; listing: Listing | Listing[] | null };
const one = (x: OrderRow["listing"]) => (Array.isArray(x) ? x[0] : x);

export default async function Facture({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const en = (await getLocale()) === "en";

  if (!isSupabaseConfigured()) notFound();
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) notFound();

  // L'acheteur lit sa propre facture via la RLS ; un admin peut consulter n'importe
  // quelle facture via le client privilégié (service_role).
  const isAdmin = await isCurrentUserAdmin();
  const db = isAdmin ? createAdminClient() : sb;
  const { data } = await db
    .from("orders")
    .select("id,amount,status,created_at,buyer_id,invoice_number,billing_name,billing_email,listing_title,listing_city,listing:listings(title,city)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();

  const order = data as OrderRow;
  // E4 — défense en profondeur : seul l'acheteur (ou un admin) accède à la facture.
  if (order.buyer_id !== user.id && !isAdmin) notFound();

  const listing = one(order.listing);
  // C2 — « Facturé à » et désignation depuis le snapshot figé à l'achat (résiste à
  // l'anonymisation RGPD) ; repli sur les données live pour les anciennes commandes.
  const { data: buyer } = await db.from("profiles").select("full_name,email,phone").eq("id", order.buyer_id).maybeSingle();
  const liveBuyer = buyer as { full_name: string | null; email: string | null; phone: string | null } | null;
  const billName = order.billing_name ?? liveBuyer?.full_name ?? "—";
  const billEmail = order.billing_email ?? liveBuyer?.email ?? "";
  const billPhone = liveBuyer?.phone ?? null;
  const itemTitle = order.listing_title ?? listing?.title ?? "—";
  const itemCity = order.listing_city ?? listing?.city ?? "";
  // Évite « Titre — Ville — Ville » si le titre contient déjà la ville.
  const itemDetail = itemCity && !itemTitle.toLowerCase().includes(itemCity.toLowerCase())
    ? `${itemTitle} — ${itemCity}`
    : itemTitle;
  const isPaid = ["paid", "in_progress", "delivered", "validated"].includes(order.status);
  // Numéro séquentiel légal (attribué au paiement) ; repli sur l'id si absent.
  const invoiceNo = order.invoice_number != null
    ? `FACT-${String(order.invoice_number).padStart(6, "0")}`
    : `FACT-${order.id.slice(0, 8).toUpperCase()}`;

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
    status: en ? "Status" : "Statut",
    billedTo: en ? "Billed to" : "Facturé à",
    nameL: en ? "Name" : "Nom",
    emailL: "Email",
    phoneL: en ? "Phone" : "Téléphone",
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
    <main id="main" className="relative min-h-screen overflow-hidden bg-[#eef2f7] px-4 py-10 print:bg-white print:p-0">
      {/* Décor orange (masqué à l'impression) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden print:hidden">
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,#f89f1b55,transparent_65%)]" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-[radial-gradient(circle,#f89f1b40,transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-[820px]">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link href="/compte/documents" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" /> {T.back}</Link>
          <PrintButton label={T.print} />
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-[0_20px_60px_-25px_rgba(26,115,232,0.35)] print:rounded-none print:border-0 print:shadow-none">
          <div className="p-8 sm:p-12">
            {/* En-tête */}
            <div className="flex flex-wrap items-start justify-between gap-6 border-b border-border pb-7">
              <div className="min-w-[240px] max-w-[52%] sm:border-r sm:border-border sm:pr-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/icons/logo.png" alt="EkoLink" width={200} height={56} className="h-12 w-auto object-contain" />
                <p className="mt-4 text-base font-extrabold text-primary">EkoLink S.A.S.</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  7 Rue Vulpian, 75013 Paris<br />
                  SIRET : 1179695284
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-4 text-primary" /> contact@ekolink.fr
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black tracking-tight">{T.invoice}</p>
                <div className="mt-4 space-y-1.5 text-sm">
                  <p className="text-muted-foreground">{T.no} : <span className="ml-1 font-bold text-primary">{invoiceNo}</span></p>
                  <p className="text-muted-foreground">{T.date} : <span className="ml-1 font-semibold text-foreground">{date}</span></p>
                  <p className="text-muted-foreground">{T.status} : <span className={`ml-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${isPaid ? "bg-success/12 text-success" : "bg-accent/15 text-[#b25e00]"}`}>{isPaid ? "✓ " : ""}{isPaid ? T.paid : T.pending}</span></p>
                </div>
              </div>
            </div>

            {/* Facturé à */}
            <div className="mt-8 rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-white"><UserRound className="size-5" /></span>
                <p className="text-lg font-extrabold">{T.billedTo}</p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex gap-3"><span className="w-24 shrink-0 text-muted-foreground">{T.nameL} :</span><span className="font-bold">{billName}</span></div>
                {billEmail && <div className="flex gap-3"><span className="w-24 shrink-0 text-muted-foreground">{T.emailL} :</span><span className="font-semibold text-primary">{billEmail}</span></div>}
                {billPhone && <div className="flex gap-3"><span className="w-24 shrink-0 text-muted-foreground">{T.phoneL} :</span><span className="font-medium">{billPhone}</span></div>}
              </div>
            </div>

            {/* Lignes */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[linear-gradient(90deg,#1a73e8,#f89f1b)] text-left text-xs font-bold uppercase tracking-wide text-white">
                    <th className="px-5 py-3">{T.desc}</th>
                    <th className="px-3 py-3 text-center">{T.qty}</th>
                    <th className="px-3 py-3 text-right">{T.unit}</th>
                    <th className="px-5 py-3 text-right">{T.total}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-5 py-4">
                      <p className="font-bold">{T.item}</p>
                      <p className="text-muted-foreground">{itemDetail}</p>
                    </td>
                    <td className="px-3 py-4 text-center">1</td>
                    <td className="px-3 py-4 text-right">{eur(ttc)}</td>
                    <td className="px-5 py-4 text-right font-semibold">{eur(ttc)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totaux */}
            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-[320px] rounded-2xl bg-secondary/60 p-5 text-sm">
                <div className="flex justify-between py-1"><span className="text-muted-foreground">{T.subtotal} :</span><span>{eur(ht)}</span></div>
                <div className="flex justify-between py-1"><span className="text-muted-foreground">{T.vat} :</span><span>{eur(tva)}</span></div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-3"><span className="text-base font-extrabold">{T.grand} :</span><span className="text-2xl font-black text-accent">{eur(ttc)}</span></div>
              </div>
            </div>

            {/* Remerciement */}
            <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-8">
              <span className="inline-flex size-9 items-center justify-center rounded-full border border-accent/40 text-accent"><Heart className="size-4" /></span>
              <p className="text-sm text-muted-foreground">{T.thanks}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
