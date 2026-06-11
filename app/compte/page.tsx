import Link from "next/link";
import { ShoppingBag, ClipboardCheck, Clock, Folder, Search, MessageCircle, ShieldCheck, Wallet, CheckCircle2, TrendingUp, CalendarDays, ChevronRight, MailCheck } from "lucide-react";
import { Panel, PanelHeader } from "../components/dashboard/ui";
import { EmptyMini } from "../components/dashboard/list";
import { table, s, n } from "@/lib/dash";
import { getCurrentProfile } from "@/lib/queries";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };

export default async function ClientDashboard({ searchParams }: { searchParams: Promise<{ verify?: string }> }) {
  const t = await getTranslations("dash");
  const locale = await getLocale();
  const { verify } = await searchParams;
  const to = await getTranslations("dash.orders");
  const eur = (v: number) => v.toLocaleString(locale === "en" ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €";
  const orders = await table<{ id: string; amount: number; raw: string; date: string }>("orders", (r) => ({ id: `#CMD-${s(r.id).slice(0, 8)}`, amount: n(r.amount), raw: s(r.status, "pending"), date: s(r.created_at).slice(0, 10) }), [], { order: "created_at" });
  const ORDER_ST: Record<string, { label: string; cls: string }> = {
    delivered: { label: to("stDelivered"), cls: "text-success" }, validated: { label: to("stDelivered"), cls: "text-success" },
    in_progress: { label: to("stInProgress"), cls: "text-[#d97706]" }, paid: { label: to("stInProgress"), cls: "text-[#d97706]" },
    pending: { label: to("stPending"), cls: "text-[#d97706]" }, cancelled: { label: to("stCancelled"), cls: "text-destructive" },
  };
  const delivered = orders.filter((o) => ["delivered", "validated"].includes(o.raw)).length;
  const inProgress = orders.filter((o) => ["paid", "in_progress"].includes(o.raw)).length;
  const invoices = orders.filter((o) => ["paid", "in_progress", "delivered", "validated"].includes(o.raw)).length;
  const spent = orders.reduce((a, o) => a + o.amount, 0);
  // MD10 — ancienneté réelle du compte (au lieu d'un « Actif » statique).
  const profile = await getCurrentProfile();
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", { month: "long", year: "numeric" })
    : "—";

  const CARDS = [
    { icon: ShoppingBag, bg: "bg-primary", label: t("client.cardOrders"), value: String(orders.length), sub: t("client.cardOrdersSub"), href: "/compte/commandes" },
    { icon: ClipboardCheck, bg: "bg-success", label: t("client.cardDelivered"), value: String(delivered), sub: t("client.cardDeliveredSub"), href: "/compte/commandes" },
    { icon: Clock, bg: "bg-accent", label: t("client.cardInProgress"), value: String(inProgress), sub: t("client.cardInProgressSub"), href: "/compte/commandes" },
    { icon: Folder, bg: "bg-[#7c3aed]", label: t("client.cardDocuments"), value: String(invoices), sub: t("client.cardDocumentsSub"), href: "/compte/documents" },
  ];
  const STATS = [
    { icon: Wallet, bg: "bg-primary/10 text-primary", label: t("client.statSpent"), value: spent.toLocaleString(locale === "en" ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €", sub: t("client.statSpentSub") },
    { icon: CheckCircle2, bg: "bg-success/12 text-success", label: t("client.statDelivered"), value: String(delivered), sub: t("client.statDeliveredSub") },
    { icon: TrendingUp, bg: "bg-accent/15 text-[#d97706]", label: t("client.statInProgress"), value: String(inProgress), sub: t("client.statInProgressSub") },
    { icon: CalendarDays, bg: "bg-[#7c3aed]/10 text-[#7c3aed]", label: t("client.statAccount"), value: memberSince, sub: t("client.statAccountSub") },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("client.greeting")}</h1>
        <p className="mt-1 text-muted-foreground">{t("client.greetingSub")}</p>
      </div>

      {verify === "1" && (
        <div className="flex items-start gap-3 rounded-xl border border-accent/40 bg-accent/10 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/20"><MailCheck className="size-5 text-[#b25e00]" /></span>
          <div>
            <p className="font-bold text-[#b25e00]">{t("client.verifyTitle")}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{t("client.verifyText")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => (
          <Panel key={c.label} className="flex flex-col">
            <span className={`mb-3 flex size-12 items-center justify-center rounded-2xl ${c.bg} text-white`}><c.icon className="size-6" /></span>
            <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
            <p className="text-2xl font-extrabold">{c.value}</p>
            <p className="text-xs text-muted-foreground">{c.sub}</p>
            <Link href={c.href} className="mt-2 text-sm font-semibold text-primary hover:underline">{t("view")}</Link>
          </Panel>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Panel>
          <PanelHeader title={t("client.recentOrders")} action={<Link href="/compte/commandes" className="text-sm font-semibold text-primary hover:underline">{t("client.viewAllOrders")}</Link>} />
          {orders.length ? (
            <ul className="divide-y divide-border/70">
              {orders.slice(0, 5).map((o) => {
                const st = ORDER_ST[o.raw] ?? ORDER_ST.pending;
                return (
                  <li key={o.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2.5 text-sm">
                    <span className="font-semibold text-primary">{o.id}</span>
                    <span className="text-muted-foreground">{o.date}</span>
                    <span className={`font-semibold ${st.cls}`}>{st.label}</span>
                    <span className="font-bold">{eur(o.amount)}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyMini label={t("client.noOrders")} />
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-secondary/60 p-3.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10"><ShieldCheck className="size-5 text-primary" /></span>
            <p className="flex-1 text-xs text-muted-foreground">{t("client.afterPurchase")}</p>
            <Link href="/comment-ca-marche" className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold hover:bg-secondary">{t("client.learnMore")}</Link>
          </div>
        </Panel>

        <aside className="space-y-5">
          <Panel>
            <PanelHeader title={t("client.quickActions")} />
            <div className="flex flex-col gap-1">
              <Link href="/fiches-google" className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary"><span className="flex size-9 items-center justify-center rounded-lg bg-primary/10"><Search className="size-4 text-primary" /></span><span className="flex-1"><span className="block text-sm font-semibold">{t("client.searchListing")}</span><span className="block text-xs text-muted-foreground">{t("client.searchListingSub")}</span></span><ChevronRight className="size-4 text-muted-foreground" /></Link>
              <Link href="/compte/documents" className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary"><span className="flex size-9 items-center justify-center rounded-lg bg-[#7c3aed]/10"><Folder className="size-4 text-[#7c3aed]" /></span><span className="flex-1"><span className="block text-sm font-semibold">{t("client.documents")}</span><span className="block text-xs text-muted-foreground">{t("client.documentsSub")}</span></span><ChevronRight className="size-4 text-muted-foreground" /></Link>
              <a href="https://wa.me/33644678642" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-secondary"><span className="flex size-9 items-center justify-center rounded-lg bg-success/12"><MessageCircle className="size-4 text-success" /></span><span className="flex-1"><span className="block text-sm font-semibold">{t("client.contactSupport")}</span><span className="block text-xs text-muted-foreground">{t("client.contactSupportSub")}</span></span><ChevronRight className="size-4 text-muted-foreground" /></a>
            </div>
          </Panel>
          <Panel className="bg-[linear-gradient(160deg,#eff5ff,#ffffff)]">
            <h3 className="font-bold">{t("client.needHelp")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("client.needHelpText")}</p>
            <a href="https://wa.me/33644678642" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"><MessageCircle className="size-4" /> {t("client.chatWhatsApp")}</a>
          </Panel>
        </aside>
      </div>

      <Panel>
        <PanelHeader title={t("client.statistics")} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((st) => (
            <div key={st.label} className="flex items-center gap-3"><span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${st.bg}`}><st.icon className="size-5" /></span><div><p className="text-xs text-muted-foreground">{st.label}</p><p className="text-lg font-extrabold leading-tight">{st.value}</p><p className="text-xs text-muted-foreground">{st.sub}</p></div></div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
