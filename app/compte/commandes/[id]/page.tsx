import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, MapPin, CalendarDays, Receipt, ExternalLink, MessageCircle } from "lucide-react";
import { Panel, PanelHeader } from "../../../components/dashboard/ui";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { WHATSAPP_URL } from "@/lib/contact";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Détail de la commande", robots: { index: false, follow: false } };

type Listing = { title: string | null; city: string | null; slug: string | null };
type OrderRow = { id: string; amount: number; status: string; created_at: string; listing: Listing | Listing[] | null };
const one = (x: OrderRow["listing"]) => (Array.isArray(x) ? x[0] : x);

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations("dash.orders");
  const locale = await getLocale();
  const en = locale === "en";

  if (!isSupabaseConfigured()) notFound();
  const sb = await createClient();
  // E4 — défense en profondeur : on filtre explicitement par buyer_id (en plus de
  // la RLS orders_self_read) pour ne pas dépendre uniquement de la RLS.
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) notFound();
  const { data } = await sb
    .from("orders")
    .select("id,amount,status,created_at,listing:listings(title,city,slug)")
    .eq("id", id)
    .eq("buyer_id", user.id)
    .maybeSingle();
  if (!data) notFound();

  const order = data as OrderRow;
  const listing = one(order.listing);
  const eur = (v: number) => v.toLocaleString(en ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €";
  const date = new Date(order.created_at).toLocaleDateString(en ? "en-US" : "fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const ST: Record<string, { label: string; tone: string; dot: string }> = {
    delivered: { label: t("stDelivered"), tone: "text-success", dot: "bg-success" }, validated: { label: t("stDelivered"), tone: "text-success", dot: "bg-success" },
    in_progress: { label: t("stInProgress"), tone: "text-[#d97706]", dot: "bg-accent" }, paid: { label: t("stInProgress"), tone: "text-[#d97706]", dot: "bg-accent" },
    pending: { label: t("stPending"), tone: "text-[#d97706]", dot: "bg-accent" }, cancelled: { label: t("stCancelled"), tone: "text-destructive", dot: "bg-destructive" },
  };
  const st = ST[order.status] ?? ST.pending;
  const hasInvoice = ["paid", "in_progress", "delivered", "validated"].includes(order.status);

  const T = {
    back: en ? "Back to my orders" : "Retour à mes commandes",
    order: en ? "Order" : "Commande",
    summary: en ? "Order summary" : "Récapitulatif",
    status: en ? "Status" : "Statut",
    date: en ? "Order date" : "Date de commande",
    listing: en ? "Listing" : "Fiche",
    amount: en ? "Amount paid" : "Montant payé",
    viewListing: en ? "View listing" : "Voir la fiche",
    invoice: en ? "Download invoice" : "Télécharger la facture",
    nextTitle: en ? "What happens next?" : "Et ensuite ?",
    nextText: en ? "After payment, you receive everything to claim the listing. We guide you until the transfer succeeds." : "Après paiement, vous recevez tout pour revendiquer la fiche. Nous vous accompagnons jusqu'à la réussite du transfert.",
    guide: en ? "View the guide" : "Voir le guide",
    refund: en ? "Request a refund" : "Demander un remboursement",
  };
  // C3 — pas de système d'avoir automatisé : les demandes de remboursement passent
  // par le support WhatsApp (message pré-rempli avec la référence de commande).
  const refundUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(
    `${en ? "Hello, I'd like a refund for my order" : "Bonjour, je souhaite un remboursement pour ma commande"} #CMD-${order.id.slice(0, 8).toUpperCase()}.`
  )}`;

  return (
    <div className="mx-auto max-w-[900px] space-y-6">
      <Link href="/compte/commandes" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" /> {T.back}</Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">{T.order} #CMD-{order.id.slice(0, 8).toUpperCase()}</h1>
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${st.tone}`}><span className={`size-2 rounded-full ${st.dot}`} /> {st.label}</span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel>
          <PanelHeader title={T.summary} />
          <ul className="divide-y divide-border/70 text-sm">
            <li className="flex items-center gap-2.5 py-3"><CalendarDays className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{T.date}</span><span className="ml-auto font-semibold">{date}</span></li>
            <li className="flex items-center gap-2.5 py-3"><FileText className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{T.listing}</span><span className="ml-auto font-semibold">{listing?.title ?? "—"}</span></li>
            <li className="flex items-center gap-2.5 py-3"><MapPin className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{en ? "City" : "Ville"}</span><span className="ml-auto font-semibold">{listing?.city ?? "—"}</span></li>
            <li className="flex items-center gap-2.5 py-3"><Receipt className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{T.amount}</span><span className="ml-auto text-base font-extrabold text-primary">{eur(order.amount)}</span></li>
          </ul>

          <div className="mt-4 flex flex-wrap gap-3">
            {listing?.slug && <Link href={`/fiches-google/${listing.slug}`} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-bold hover:bg-secondary"><ExternalLink className="size-4" /> {T.viewListing}</Link>}
            {hasInvoice && <Link href={`/facture/${order.id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90"><Receipt className="size-4" /> {T.invoice}</Link>}
          </div>
        </Panel>

        <Panel className="bg-[linear-gradient(160deg,#eff5ff,#ffffff)]">
          <h3 className="font-bold">{T.nextTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{T.nextText}</p>
          <Link href="/comment-ca-marche" className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-primary hover:bg-secondary">{T.guide} <ExternalLink className="size-4" /></Link>
          <a href={refundUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-success hover:bg-secondary"><MessageCircle className="size-4" /> {T.refund}</a>
        </Panel>
      </div>
    </div>
  );
}
