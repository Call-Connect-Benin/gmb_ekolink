import Link from "next/link";
import { ShoppingBag, ClipboardCheck, Clock, Folder, Search, MessageCircle, ShieldCheck, Wallet, CheckCircle2, TrendingUp, CalendarDays, ChevronRight } from "lucide-react";
import { Panel, PanelHeader } from "../components/dashboard/ui";
import { EmptyMini } from "../components/dashboard/list";
import { table, s, n } from "@/lib/dash";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };

export default async function ClientDashboard() {
  const t = await getTranslations("dash");
  const locale = await getLocale();
  const orders = await table<{ amount: number; raw: string }>("orders", (r) => ({ amount: n(r.amount), raw: s(r.status, "pending") }), [], { order: "created_at" });
  const delivered = orders.filter((o) => ["delivered", "validated"].includes(o.raw)).length;
  const inProgress = orders.filter((o) => ["paid", "in_progress"].includes(o.raw)).length;
  const spent = orders.reduce((a, o) => a + o.amount, 0);

  const CARDS = [
    { icon: ShoppingBag, bg: "bg-primary", label: t("client.cardOrders"), value: String(orders.length), sub: t("client.cardOrdersSub"), href: "/compte/commandes" },
    { icon: ClipboardCheck, bg: "bg-success", label: t("client.cardDelivered"), value: String(delivered), sub: t("client.cardDeliveredSub"), href: "/compte/commandes" },
    { icon: Clock, bg: "bg-accent", label: t("client.cardInProgress"), value: String(inProgress), sub: t("client.cardInProgressSub"), href: "/compte/commandes" },
    { icon: Folder, bg: "bg-[#7c3aed]", label: t("client.cardDocuments"), value: "0", sub: t("client.cardDocumentsSub"), href: "/compte/documents" },
  ];
  const STATS = [
    { icon: Wallet, bg: "bg-primary/10 text-primary", label: t("client.statSpent"), value: spent.toLocaleString(locale === "en" ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €", sub: t("client.statSpentSub") },
    { icon: CheckCircle2, bg: "bg-success/12 text-success", label: t("client.statDelivered"), value: String(delivered), sub: t("client.statDeliveredSub") },
    { icon: TrendingUp, bg: "bg-accent/15 text-[#d97706]", label: t("client.statInProgress"), value: String(inProgress), sub: t("client.statInProgressSub") },
    { icon: CalendarDays, bg: "bg-[#7c3aed]/10 text-[#7c3aed]", label: t("client.statAccount"), value: t("client.statAccountValue"), sub: t("client.statAccountSub") },
  ];

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("client.greeting")}</h1>
        <p className="mt-1 text-muted-foreground">{t("client.greetingSub")}</p>
      </div>

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
          <EmptyMini label={t("client.noOrders")} />
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
            <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"><MessageCircle className="size-4" /> {t("client.chatWhatsApp")}</button>
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
