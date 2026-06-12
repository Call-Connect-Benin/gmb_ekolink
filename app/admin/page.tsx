import Link from "next/link";
import { Users, ShoppingBag, BarChart3, FileText, Store, Boxes, Plus, Download, ChevronRight } from "lucide-react";
import { Donut, Legend } from "../components/dashboard/Charts";
import { StatCard, Panel, PanelHeader, Pill, QuickAction } from "../components/dashboard/ui";
import { EmptyMini } from "../components/dashboard/list";
import { tableAdmin, countAdmin, s, n } from "@/lib/dash";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Tableau de bord admin" };

const eur = (v: number) => v.toLocaleString("fr-FR", { minimumFractionDigits: 0 }) + " €";

export default async function AdminDashboard() {
  const t = await getTranslations("dash");
  const O_LABEL: Record<string, { label: string; tone: "green" | "blue" | "orange" | "red"; color: string }> = {
    delivered: { label: t("admin.oDelivered"), tone: "green", color: "#22c55e" }, validated: { label: t("admin.oValidated"), tone: "green", color: "#22c55e" },
    in_progress: { label: t("admin.oInProgress"), tone: "blue", color: "#1a73e8" }, paid: { label: t("admin.oPaid"), tone: "blue", color: "#1a73e8" },
    pending: { label: t("admin.oPending"), tone: "orange", color: "#f59e0b" }, cancelled: { label: t("admin.oCancelled"), tone: "red", color: "#ef4444" },
  };
  // Agrégats admin via service_role (corrects même pour un admin ADMIN_EMAILS).
  const usersCount = await countAdmin("profiles");
  const orders = await tableAdmin<{ id: string; amount: number; raw: string; label: string; tone: "green" | "blue" | "orange" | "red"; date: string }>("orders", (r) => {
    const m = O_LABEL[s(r.status, "pending")] ?? O_LABEL.pending;
    return { id: `#CMD-${s(r.id).slice(0, 8)}`, amount: n(r.amount), raw: s(r.status, "pending"), label: m.label, tone: m.tone, date: s(r.created_at).slice(0, 10) };
  }, { order: "created_at" });
  const listings = await tableAdmin<{ title: string; slug: string; city: string; raw: string }>("listings", (r) => ({ title: s(r.title), slug: s(r.slug), city: s(r.city), raw: s(r.status, "available") }), { order: "created_at" });

  const paid = orders.filter((o) => ["paid", "in_progress", "delivered", "validated"].includes(o.raw));
  const ca = paid.reduce((a, o) => a + o.amount, 0);
  const vendues = listings.filter((l) => l.raw === "sold").length;
  const stock = listings.filter((l) => l.raw === "available").length;

  const STATS = [
    { icon: Users, tone: "blue" as const, label: t("admin.statUsers"), value: String(usersCount) },
    { icon: ShoppingBag, tone: "green" as const, label: t("admin.statOrders"), value: String(orders.length) },
    { icon: BarChart3, tone: "teal" as const, label: t("admin.statRevenue"), value: eur(ca) },
    { icon: Store, tone: "orange" as const, label: t("admin.statSold"), value: String(vendues) },
    { icon: Boxes, tone: "purple" as const, label: t("admin.statStock"), value: String(stock) },
    { icon: FileText, tone: "blue" as const, label: t("admin.statTotal"), value: String(listings.length) },
  ];
  const labels: { k: string; l: string; c: string }[] = [
    { k: "delivered", l: t("admin.segDelivered"), c: "#22c55e" }, { k: "paid", l: t("admin.segPaid"), c: "#1a73e8" },
    { k: "pending", l: t("admin.segPending"), c: "#f59e0b" }, { k: "cancelled", l: t("admin.segCancelled"), c: "#ef4444" },
  ];
  const SEG = labels.map((x) => ({ label: x.l, value: orders.filter((o) => o.raw === x.k || (x.k === "delivered" && o.raw === "validated") || (x.k === "paid" && o.raw === "in_progress")).length, color: x.c })).filter((x) => x.value > 0);
  const stockSeg = [
    { label: t("admin.stInStock"), value: stock, color: "#1a73e8" },
    { label: t("admin.stSold"), value: vendues, color: "#22c55e" },
    { label: t("admin.stReserved"), value: listings.filter((l) => l.raw === "reserved").length, color: "#f59e0b" },
  ].filter((x) => x.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="text-2xl font-extrabold tracking-tight">{t("admin.title")}</h1><p className="mt-1 text-sm text-muted-foreground">{t("admin.subtitle")}</p></div>
        <a href="/admin/export" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-secondary"><Download className="size-4" /> {t("admin.exportSales")}</a>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">{STATS.map((st) => <StatCard key={st.label} {...st} />)}</div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title={t("admin.ordersBreakdown")} />
          {SEG.length ? <div className="flex items-center gap-5"><Donut segments={SEG} centerTop={String(orders.length)} /><Legend segments={SEG} /></div> : <EmptyMini label={t("admin.noOrders")} />}
        </Panel>
        <Panel>
          <PanelHeader title={t("admin.stockState")} />
          {stockSeg.length ? <div className="flex items-center gap-5"><Donut segments={stockSeg} centerTop={String(listings.length)} centerBottom={t("admin.fichesWord")} /><Legend segments={stockSeg} /></div> : <EmptyMini label={t("admin.noFiches")} />}
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHeader title={t("admin.recentOrders")} action={<Link href="/admin/commandes" className="text-sm font-semibold text-primary hover:underline">{t("viewAll")}</Link>} />
          {orders.length ? (
            <ul className="divide-y divide-border/70">{orders.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2 py-2.5 text-sm"><span className="font-semibold text-primary">{o.id}</span><span className="text-muted-foreground">{o.date}</span><span className="font-bold">{eur(o.amount)}</span><Pill tone={o.tone}>{o.label}</Pill></li>
            ))}</ul>
          ) : <EmptyMini />}
        </Panel>
        <Panel>
          <PanelHeader title={t("admin.recentListings")} action={<Link href="/admin/fiches" className="text-sm font-semibold text-primary hover:underline">{t("viewAll")}</Link>} />
          {listings.length ? (
            <ul className="divide-y divide-border/70">{listings.slice(0, 6).map((l) => (
              <li key={l.slug} className="flex items-center gap-3 py-2.5"><span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary"><FileText className="size-4 text-muted-foreground" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold leading-tight">{l.title}</p><p className="truncate text-xs text-muted-foreground">{l.city}</p></div><Pill tone={l.raw === "available" ? "blue" : l.raw === "sold" ? "green" : "orange"}>{l.raw === "available" ? t("admin.liInStock") : l.raw === "sold" ? t("admin.liSold") : t("admin.liReserved")}</Pill></li>
            ))}</ul>
          ) : <EmptyMini />}
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Actions rapides" />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <QuickAction icon={Plus} tone="blue" label={t("admin.qaAddListing")} href="/admin/fiches/nouvelle" />
          <QuickAction icon={ShoppingBag} tone="green" label={t("admin.qaViewOrders")} href="/admin/commandes" />
          <QuickAction icon={Users} tone="purple" label={t("admin.qaManageUsers")} href="/admin/utilisateurs" />
          <QuickAction icon={Download} tone="teal" label={t("admin.qaExport")} href="/admin/export" />
        </div>
      </Panel>
    </div>
  );
}
