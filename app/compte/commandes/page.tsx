/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Search, ListFilter, FileText, ExternalLink, MapPin, ArrowRight } from "lucide-react";
import { Panel } from "../../components/dashboard/ui";
import { EmptyMini } from "../../components/dashboard/list";
import { table, s, n } from "@/lib/dash";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes commandes", robots: { index: false, follow: false } };

export default async function MesCommandes() {
  const t = await getTranslations("dash.orders");
  const td = await getTranslations("dashboard");
  const locale = await getLocale();
  const eur = (v: number) => v.toLocaleString(locale === "en" ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €";
  const TABS = t.raw("tabs") as string[];
  const ST: Record<string, { label: string; tone: string; dot: string }> = {
    delivered: { label: t("stDelivered"), tone: "text-success", dot: "bg-success" }, validated: { label: t("stDelivered"), tone: "text-success", dot: "bg-success" },
    in_progress: { label: t("stInProgress"), tone: "text-[#d97706]", dot: "bg-accent" }, paid: { label: t("stInProgress"), tone: "text-[#d97706]", dot: "bg-accent" },
    pending: { label: t("stPending"), tone: "text-[#d97706]", dot: "bg-accent" }, cancelled: { label: t("stCancelled"), tone: "text-destructive", dot: "bg-destructive" },
  };
  const ORDERS = await table<{ id: string; amount: string; raw: string; date: string }>("orders", (r) => ({ id: `#CMD-${s(r.id).slice(0, 8)}`, amount: eur(n(r.amount)), raw: s(r.status, "pending"), date: s(r.created_at).slice(0, 10) }), [], { order: "created_at" });

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-6 border-b border-border">{TABS.map((tab, i) => <button key={tab} className={`border-b-2 pb-2.5 text-sm font-semibold ${i === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>)}</div>
        <div className="flex items-center gap-2.5">
          <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input placeholder={t("searchPlaceholder")} className="h-10 w-56 rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-secondary"><ListFilter className="size-4" /> {td("filters")}</button>
        </div>
      </div>

      <Panel className="p-0">
        {ORDERS.length === 0 ? <div className="p-6"><EmptyMini label={t("empty")} /></div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="border-b border-border bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"><th className="px-5 py-3">{t("thOrder")}</th><th className="px-3 py-3">{t("thStatus")}</th><th className="px-3 py-3">{t("thDate")}</th><th className="px-3 py-3">{t("thPrice")}</th><th className="px-5 py-3">{t("thActions")}</th></tr></thead>
              <tbody>
                {ORDERS.map((o) => { const st = ST[o.raw] ?? ST.pending; return (
                  <tr key={o.id} className="border-b border-border/70 last:border-0">
                    <td className="px-5 py-4 font-bold text-primary">{o.id}</td>
                    <td className="px-3 py-4"><span className={`inline-flex items-center gap-1.5 font-semibold ${st.tone}`}><span className={`size-2 rounded-full ${st.dot}`} /> {st.label}</span></td>
                    <td className="px-3 py-4 text-muted-foreground">{o.date}</td>
                    <td className="px-3 py-4 font-bold">{o.amount}</td>
                    <td className="px-5 py-4"><Link href="#" className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-secondary">{t("viewDetail")} <ArrowRight className="size-4" /></Link></td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[linear-gradient(120deg,#eff5ff,#ffffff)] p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10"><FileText className="size-5 text-primary" /></span>
        <div className="flex-1"><p className="font-bold">{t("transferTitle")}</p><p className="text-sm text-muted-foreground">{t("transferText")}</p></div>
        <Link href="/comment-ca-marche" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-bold text-primary hover:bg-secondary">{t("viewGuide")} <ExternalLink className="size-4" /></Link>
      </div>
    </div>
  );
}
