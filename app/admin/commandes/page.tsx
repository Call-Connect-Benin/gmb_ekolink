import { ShoppingBag, CheckCircle2, Clock, Timer, XCircle, CreditCard } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { StatCard, Panel, PanelHeader, Pill, Table, Th, Td, Row, Pagination } from "../../components/dashboard/ui";
import { PageHead, StatRow, EmptyRow, EmptyMini } from "../../components/dashboard/list";
import { s, n } from "@/lib/dash";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import OrdersFilter from "./OrdersFilter";
import OrderRowActions from "./OrderRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Commandes — Admin" };

type Ord = { id: string; orderId: string; client: string; fiche: string; amount: string; raw: string; pay: string; payt: "green" | "orange" | "gray" | "red"; date: string };

const one = (x: unknown) => (Array.isArray(x) ? x[0] : x) as Record<string, unknown> | null;

export default async function AdminCommandes({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const t = await getTranslations("dash.ordersAdmin");
  const locale = await getLocale();
  const { q, status, page: pageParam } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
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

  const statusOptions = [
    { value: "pending", label: t("oPending") },
    { value: "paid", label: t("oPaid") },
    { value: "in_progress", label: t("oInProgress") },
    { value: "delivered", label: t("oDelivered") },
    { value: "validated", label: t("oValidated") },
    { value: "cancelled", label: t("oCancelled") },
  ];

  // Données réelles (jointures client + fiche) via le client admin.
  let rows: Record<string, unknown>[] = [];
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("id,buyer_id,amount,status,created_at,listing:listings(title,city),buyer:profiles(full_name,email)")
      .order("created_at", { ascending: false });
    rows = (data as Record<string, unknown>[]) ?? [];
  }

  const ALL: Ord[] = rows.map((r) => {
    const raw = s(r.status, "pending");
    const pay = PAY[raw] ?? PAY.pending;
    const buyer = one(r.buyer);
    const listing = one(r.listing);
    const client = s(buyer?.full_name) || s(buyer?.email) || s(r.buyer_id).slice(0, 8) || t("noClient");
    const fiche = s(listing?.title) || t("noFiche");
    return { id: s(r.id), orderId: `#CMD-${s(r.id).slice(0, 8)}`, client, fiche, amount: eur(n(r.amount)), raw, pay: pay.label, payt: pay.tone, date: s(r.created_at).slice(0, 16).replace("T", ", ") };
  });

  const filtered = ALL.filter(
    (o) => (!status || o.raw === status) && (!query || `${o.orderId} ${o.client} ${o.fiche}`.toLowerCase().includes(query))
  );

  // MD6 — pagination réelle (navigation par URL ?page=, filtres conservés).
  const PER_PAGE = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), pages);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pgParams: Record<string, string> = {};
  if (q) pgParams.q = q;
  if (status) pgParams.status = status;

  // M4 — somme des montants bruts (numériques), pas des chaînes formatées.
  const totalCA = rows.reduce((a, r) => a + n(r.amount), 0);
  const done = ALL.filter((o) => ["delivered", "validated"].includes(o.raw)).length;
  const inProgress = ALL.filter((o) => ["in_progress", "paid"].includes(o.raw)).length;
  const pend = ALL.filter((o) => o.raw === "pending").length;
  const canc = ALL.filter((o) => o.raw === "cancelled").length;

  const STATS = [
    { icon: ShoppingBag, tone: "blue" as const, label: t("stTotal"), value: String(ALL.length) },
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
      <PageHead title={t("title")} subtitle={t("subtitle")} />
      <StatRow cols={6}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      <div className="space-y-4">
          <OrdersFilter
            q0={q ?? ""}
            status0={status ?? ""}
            placeholder={t("searchPlaceholder")}
            statusLabel={t("filterStatus")}
            statusOptions={statusOptions}
            exportLabel={t("exportCsv")}
          />

          <Panel>
            <PanelHeader title={t("breakdown")} />
            {SEG.length ? (
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {SEG.map((sgmt) => (
                  <div key={sgmt.label} className="flex items-center gap-2.5">
                    <span className="size-2.5 rounded-full" style={{ background: sgmt.color }} />
                    <span className="text-sm font-medium">{sgmt.label}</span>
                    <span className="text-sm text-muted-foreground">{sgmt.value}</span>
                  </div>
                ))}
              </div>
            ) : <EmptyMini />}
          </Panel>

          <Panel className="p-0">
            <Table head={<><Th className="pl-5">{t("thOrder")}</Th><Th>{t("thClient")}</Th><Th>{t("thFiche")}</Th><Th>{t("thAmount")}</Th><Th>{t("thStatus")}</Th><Th>{t("thPayment")}</Th><Th>{t("thDate")}</Th><Th>{t("thActions")}</Th></>}>
              {shown.length === 0 ? <EmptyRow cols={8} /> : shown.map((o) => (
                <Row key={o.id}>
                  <Td className="pl-5 font-semibold text-primary">{o.orderId}</Td>
                  <Td className="text-foreground/80">{o.client}</Td>
                  <Td className="text-foreground/80">{o.fiche}</Td>
                  <Td className="font-bold">{o.amount}</Td>
                  <Td><Pill tone={STATUS_TONE[o.raw] ?? "orange"}>{statusLabel(o.raw)}</Pill></Td>
                  <Td><Pill tone={o.payt}>{o.pay}</Pill></Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{o.date}</Td>
                  <Td><OrderRowActions id={o.id} status={o.raw} labels={{ actions: t("thActions"), changeStatus: t("changeStatus") }} statusOptions={statusOptions} /></Td>
                </Row>
              ))}
            </Table>
            <div className="border-t border-border p-3"><Pagination page={page} pages={pages} basePath="/admin/commandes" params={pgParams} label={t("count", { count: filtered.length })} /></div>
          </Panel>
      </div>
    </div>
  );
}
