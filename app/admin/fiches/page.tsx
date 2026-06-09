import Link from "next/link";
import { FileText, CheckCircle2, Clock, ShieldAlert, XCircle, Plus, FolderCog, Eye, MoreHorizontal } from "lucide-react";
import { Donut, Legend } from "../../components/dashboard/Charts";
import { StatCard, Panel, PanelHeader, Pill, QuickAction, Table, Th, Td, Row, Pagination } from "../../components/dashboard/ui";
import { PageHead, ExportBtn, HeadBtn, StatRow, FilterBar, EmptyRow, EmptyMini } from "../../components/dashboard/list";
import { table, s } from "@/lib/dash";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fiches — Admin" };

const cap = (x: string) => (x ? x.charAt(0).toUpperCase() + x.slice(1) : "—");
const CAT_COLORS = ["#1a73e8", "#8b5cf6", "#0ea5e9", "#f59e0b", "#22c55e", "#ef4444"];

type Fi = { title: string; id: string; cat: string; raw: string; st: string; stt: "green" | "orange" | "red" | "gray"; city: string; date: string; price: number };

export default async function AdminFiches() {
  const t = await getTranslations("dash.fichesAdmin");
  const ST: Record<string, { label: string; tone: "green" | "orange" | "red" | "gray"; color: string }> = {
    available: { label: t("sPublished"), tone: "green", color: "#22c55e" },
    reserved: { label: t("sReserved"), tone: "orange", color: "#f59e0b" },
    sold: { label: t("sSold"), tone: "gray", color: "#94a3b8" },
  };
  const FICHES = await table<Fi>("listings", (r) => {
    const raw = s(r.status, "available"); const st = ST[raw] ?? ST.available;
    return { title: s(r.title), id: `#FIC-${s(r.slug, s(r.id)).slice(0, 14)}`, cat: cap(s(r.category_slug)), raw, st: st.label, stt: st.tone, city: s(r.city), date: s(r.created_at).slice(0, 10), price: Number(r.price) || 0 };
  }, [], { order: "created_at" });

  const by = (k: string) => FICHES.filter((f) => f.raw === k).length;
  const STATS = [
    { icon: FileText, tone: "blue" as const, label: t("stTotal"), value: String(FICHES.length) },
    { icon: CheckCircle2, tone: "green" as const, label: t("stPublished"), value: String(by("available")) },
    { icon: Clock, tone: "orange" as const, label: t("stReserved"), value: String(by("reserved")) },
    { icon: ShieldAlert, tone: "purple" as const, label: t("stSold"), value: String(by("sold")) },
    { icon: XCircle, tone: "red" as const, label: t("stRefused"), value: "0" },
  ];
  const SEG = [
    { label: t("stPublished"), value: by("available"), color: "#22c55e" },
    { label: t("stReserved"), value: by("reserved"), color: "#f59e0b" },
    { label: t("stSold"), value: by("sold"), color: "#94a3b8" },
  ].filter((x) => x.value > 0);
  const cats = Array.from(new Set(FICHES.map((f) => f.cat)));
  const topCats = cats.map((c, i) => ({ label: c, n: FICHES.filter((f) => f.cat === c).length, color: CAT_COLORS[i % CAT_COLORS.length] })).sort((a, b) => b.n - a.n).slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHead title={t("title")} subtitle={t("subtitle")} actions={<><ExportBtn /><HeadBtn icon={Plus} variant="primary">{t("newListing")}</HeadBtn></>} />
      <StatRow cols={5}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <FilterBar placeholder={t("search")} selects={[t("filterStatus"), t("filterCat"), t("filterDate")]} />
          <Panel className="p-0">
            <Table head={<><Th className="pl-5">{t("thListing")}</Th><Th>{t("thCategory")}</Th><Th>{t("thCity")}</Th><Th>{t("thStatus")}</Th><Th>{t("thPrice")}</Th><Th>{t("thDate")}</Th><Th></Th></>}>
              {FICHES.length === 0 ? <EmptyRow cols={7} /> : FICHES.map((f) => (
                <Row key={f.id}>
                  <Td className="pl-5"><div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary"><FileText className="size-5 text-muted-foreground" /></span><div><p className="text-sm font-semibold leading-tight">{f.title}</p><p className="text-xs text-muted-foreground">{f.id}</p></div></div></Td>
                  <Td><Pill tone="blue">{f.cat}</Pill></Td>
                  <Td className="text-foreground/80">{f.city}</Td>
                  <Td><Pill tone={f.stt} dot>{f.st}</Pill></Td>
                  <Td className="font-semibold">{f.price ? `${f.price} €` : "—"}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{f.date}</Td>
                  <Td><button className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"><MoreHorizontal className="size-4" /></button></Td>
                </Row>
              ))}
            </Table>
            <div className="border-t border-border p-3"><Pagination page={1} pages={1} label={t("count", { count: FICHES.length })} /></div>
          </Panel>
        </div>

        <aside className="space-y-5">
          <Panel>
            <PanelHeader title={t("breakdown")} />
            {SEG.length ? <div className="flex flex-col items-center gap-4"><Donut segments={SEG} centerTop={String(FICHES.length)} size={160} /><Legend segments={SEG} /></div> : <EmptyMini />}
          </Panel>
          <Panel>
            <PanelHeader title={t("topCats")} />
            {topCats.length ? (
              <ul className="space-y-3">{topCats.map((c) => (
                <li key={c.label} className="flex items-center gap-3"><span className="size-2.5 rounded-full" style={{ background: c.color }} /><span className="flex-1 text-sm font-medium">{c.label}</span><span className="text-sm text-muted-foreground">{t("listingsCount", { count: c.n })}</span></li>
              ))}</ul>
            ) : <EmptyMini />}
          </Panel>
          <Panel>
            <PanelHeader title={t("quickActions")} />
            <div className="flex flex-col gap-1">
              <QuickAction icon={Plus} tone="blue" label={t("qaCreate")} href="/admin/fiches/nouvelle" />
              <QuickAction icon={FolderCog} tone="purple" label={t("qaCategories")} href="/admin/categories" />
              <QuickAction icon={Eye} tone="teal" label={t("qaCatalog")} href="/fiches-google" />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
