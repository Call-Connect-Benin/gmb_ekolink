import { ShoppingBag, CheckCircle2, Clock, Timer, XCircle, CreditCard, Plus, Upload, Download, MoreHorizontal } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Donut, Legend } from "../../components/dashboard/Charts";
import { StatCard, Panel, PanelHeader, Pill, QuickAction, Table, Th, Td, Row, Pagination } from "../../components/dashboard/ui";
import { PageHead, HeadBtn, StatRow, FilterBar, EmptyRow, EmptyMini } from "../../components/dashboard/list";
import { table, s, n } from "@/lib/dash";

export const dynamic = "force-dynamic";
export const metadata = { title: "Commandes — Admin" };

type Ord = { id: string; client: string; amount: string; raw: string; pay: string; payt: "green" | "orange" | "gray" | "red"; date: string };

export default async function AdminCommandes() {
  const t = await getTranslations("dash.ordersAdmin");
  const locale = await getLocale();
  const eur = (v: number) => v.toLocaleString(locale === "en" ? "en-US" : "fr-FR", { minimumFractionDigits: 2 }) + " €";

  const PAY: Record<string, { label: string; tone: "green" | "orange" | "gray" | "red" }> = {
    paid: { label: t("payPaid"), tone: "green" }, in_progress: { label: t("payPaid"), tone: "green" }, delivered: { label: t("payPaid"), tone: "green" }, validated: { label: t("payPaid"), tone: "green" },
    pending: { label: t("payPending"), tone: "orange" }, cancelled: { label: t("payRefunded"), tone: "gray" },
  };
  const STATUS_TONE: Record<string, "green" | "blue" | "orange" | "red"> = {
    delivered: "green", validated: "green", in_progress: "blue", paid: "blue", pending: "orange", cancelled: "red",
  };
  const statusLabel = (raw: string) =>
    ["delivered", "validated"].includes(raw) ? t("sDone") : ["in_progress", "paid"].includes(raw) ? t("sInProgress") : raw === "cancelled" ? t("sCancelled") : t("sPending");

  const ORDERS = await table<Ord>("orders", (r) => {
    const raw = s(r.status, "pending"); const pay = PAY[raw] ?? PAY.pending;
    return { id: `#CMD-${s(r.id).slice(0, 8)}`, client: s(r.buyer_id).slice(0, 8) || "—", amount: eur(n(r.amount)), raw, pay: pay.label, payt: pay.tone, date: s(r.created_at).slice(0, 16).replace("T", ", ") };
  }, [], { order: "created_at" });

  const totalCA = ORDERS.reduce((a, o) => a + (parseFloat(o.amount.replace(/[^\d.,]/g, "").replace(",", ".")) || 0), 0);
  const done = ORDERS.filter((o) => ["delivered", "validated"].includes(o.raw)).length;
  const inProgress = ORDERS.filter((o) => ["in_progress", "paid"].includes(o.raw)).length;
  const pend = ORDERS.filter((o) => o.raw === "pending").length;
  const canc = ORDERS.filter((o) => o.raw === "cancelled").length;

  const STATS = [
    { icon: ShoppingBag, tone: "blue" as const, label: t("stTotal"), value: String(ORDERS.length) },
    { icon: CheckCircle2, tone: "green" as const, label: t("stDone"), value: String(done) },
    { icon: Clock, tone: "orange" as const, label: t("stInProgress"), value: String(inProgress) },
    { icon: Timer, tone: "purple" as const, label: t("stPending"), value: String(pend) },
    { icon: XCircle, tone: "red" as const, label: t("stCancelled"), value: String(canc) },
    { icon: CreditCard, tone: "teal" as const, label: t("stRevenue"), value: eur(totalCA) },
  ];
  const SEG = [
    { label: t("sDone"), value: done, color: "#22c55e" },
    { label: t("sInProgress"), value: inProgress, color: "#1a73e8" },
    { label: t("sPending"), value: pend, color: "#f59e0b" },
    { label: t("sCancelled"), value: canc, color: "#ef4444" },
  ].filter((x) => x.value > 0);

  return (
    <div className="space-y-6">
      <PageHead title={t("title")} subtitle={t("subtitle")} actions={<><a href="/admin/export" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-secondary"><Download className="size-4" /> {t("exportCsv")}</a><HeadBtn icon={Plus} variant="primary">{t("newOrder")}</HeadBtn></>} />
      <StatRow cols={6}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <FilterBar placeholder={t("searchPlaceholder")} selects={[t("filterStatus"), t("filterPayment")]} />
          <Panel className="p-0">
            <Table head={<><Th className="pl-5">{t("thOrder")}</Th><Th>{t("thClient")}</Th><Th>{t("thAmount")}</Th><Th>{t("thStatus")}</Th><Th>{t("thPayment")}</Th><Th>{t("thDate")}</Th><Th>{t("thActions")}</Th></>}>
              {ORDERS.length === 0 ? <EmptyRow cols={7} /> : ORDERS.map((o) => (
                <Row key={o.id}>
                  <Td className="pl-5 font-semibold text-primary">{o.id}</Td>
                  <Td className="text-foreground/80">{o.client}</Td>
                  <Td className="font-bold">{o.amount}</Td>
                  <Td><Pill tone={STATUS_TONE[o.raw] ?? "orange"}>{statusLabel(o.raw)}</Pill></Td>
                  <Td><Pill tone={o.payt}>{o.pay}</Pill></Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{o.date}</Td>
                  <Td><button type="button" className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"><MoreHorizontal className="size-4" /></button></Td>
                </Row>
              ))}
            </Table>
            <div className="border-t border-border p-3"><Pagination page={1} pages={1} label={t("count", { count: ORDERS.length })} /></div>
          </Panel>
        </div>

        <aside className="space-y-5">
          <Panel>
            <PanelHeader title={t("breakdown")} />
            {SEG.length ? <div className="flex flex-col items-center gap-4"><Donut segments={SEG} centerTop={String(ORDERS.length)} size={160} /><Legend segments={SEG} /></div> : <EmptyMini />}
          </Panel>
          <Panel>
            <PanelHeader title={t("quickActions")} />
            <div className="flex flex-col gap-1">
              <QuickAction icon={Plus} tone="blue" label={t("qaCreate")} />
              <QuickAction icon={Upload} tone="purple" label={t("qaImport")} />
              <QuickAction icon={Download} tone="green" label={t("qaExportList")} />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
