import Link from "next/link";
import { FileText, CheckCircle2, Clock, ShieldAlert, Plus } from "lucide-react";
import { StatCard, Panel, PanelHeader, Pill, Table, Th, Td, Row, Pagination } from "../../components/dashboard/ui";
import { PageHead, StatRow, EmptyRow } from "../../components/dashboard/list";
import { tableAdmin, s } from "@/lib/dash";
import { getCategories } from "@/lib/queries";
import { getTranslations, getLocale } from "next-intl/server";
import FichesFilter from "./FichesFilter";
import FicheRowActions from "./FicheRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Fiches — Admin" };

const cap = (x: string) => (x ? x.charAt(0).toUpperCase() + x.slice(1) : "—");
const CAT_COLORS = ["#1a73e8", "#8b5cf6", "#0ea5e9", "#f59e0b", "#22c55e", "#ef4444"];

type Fi = { title: string; id: string; realId: string; slug: string; cat: string; catSlug: string; raw: string; st: string; stt: "green" | "orange" | "red" | "gray"; city: string; date: string; price: number };

export default async function AdminFiches({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; cat?: string; page?: string }> }) {
  const t = await getTranslations("dash.fichesAdmin");
  const en = (await getLocale()) === "en";
  const { q, status, cat, page: pageParam } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const categories = await getCategories();
  const catName = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    return c ? (en ? c.name_en : c.name_fr) : cap(slug);
  };

  const ST: Record<string, { label: string; tone: "green" | "orange" | "red" | "gray"; color: string }> = {
    available: { label: t("sPublished"), tone: "green", color: "#22c55e" },
    reserved: { label: t("sReserved"), tone: "orange", color: "#f59e0b" },
    sold: { label: t("sSold"), tone: "gray", color: "#94a3b8" },
  };
  const FICHES = await tableAdmin<Fi>("listings", (r) => {
    const raw = s(r.status, "available"); const st = ST[raw] ?? ST.available;
    const catSlug = s(r.category_slug);
    return { title: s(r.title), id: `#FIC-${s(r.slug, s(r.id)).slice(0, 14)}`, realId: s(r.id), slug: s(r.slug), cat: catName(catSlug), catSlug, raw, st: st.label, stt: st.tone, city: s(r.city), date: s(r.created_at).slice(0, 10), price: Number(r.price) || 0 };
  }, { order: "created_at" });

  const filtered = FICHES.filter(
    (f) =>
      (!status || f.raw === status) &&
      (!cat || f.catSlug === cat) &&
      (!query || `${f.title} ${f.city} ${f.cat} ${f.id}`.toLowerCase().includes(query))
  );

  // MD6 — pagination réelle (navigation par URL ?page=, filtres conservés).
  const PER_PAGE = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), pages);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pgParams: Record<string, string> = {};
  if (q) pgParams.q = q;
  if (status) pgParams.status = status;
  if (cat) pgParams.cat = cat;

  const by = (k: string) => FICHES.filter((f) => f.raw === k).length;
  const STATS = [
    { icon: FileText, tone: "blue" as const, label: t("stTotal"), value: String(FICHES.length) },
    { icon: CheckCircle2, tone: "green" as const, label: t("stPublished"), value: String(by("available")) },
    { icon: Clock, tone: "orange" as const, label: t("stReserved"), value: String(by("reserved")) },
    { icon: ShieldAlert, tone: "purple" as const, label: t("stSold"), value: String(by("sold")) },
  ];
  const cats = Array.from(new Set(FICHES.map((f) => f.cat)));
  const topCats = cats.map((c, i) => ({ label: c, n: FICHES.filter((f) => f.cat === c).length, color: CAT_COLORS[i % CAT_COLORS.length] })).sort((a, b) => b.n - a.n).slice(0, 5);

  const statusOptions = [
    { value: "available", label: t("sPublished") },
    { value: "reserved", label: t("sReserved") },
    { value: "sold", label: t("sSold") },
  ];
  const catOptions = categories.map((c) => ({ value: c.slug, label: en ? c.name_en : c.name_fr }));

  return (
    <div className="space-y-6">
      <PageHead title={t("title")} subtitle={t("subtitle")} actions={<Link href="/admin/fiches/nouvelle" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90"><Plus className="size-4" /> {t("newListing")}</Link>} />
      <StatRow cols={4}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      {topCats.length > 0 && (
        <Panel>
          <PanelHeader title={t("topCats")} />
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {topCats.map((c) => (
              <div key={c.label} className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full" style={{ background: c.color }} />
                <span className="text-sm font-medium">{c.label}</span>
                <span className="text-sm text-muted-foreground">{t("listingsCount", { count: c.n })}</span>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div className="space-y-4">
          <FichesFilter
            q0={q ?? ""}
            status0={status ?? ""}
            cat0={cat ?? ""}
            placeholder={t("search")}
            statusLabel={t("filterStatus")}
            catLabel={t("filterCat")}
            statusOptions={statusOptions}
            catOptions={catOptions}
            exportLabel={t("export")}
            manageCatsLabel={t("qaCategories")}
            viewCatalogLabel={t("qaCatalog")}
          />
          <Panel className="p-0">
            <Table head={<><Th className="pl-5">{t("thListing")}</Th><Th>{t("thCategory")}</Th><Th>{t("thCity")}</Th><Th>{t("thStatus")}</Th><Th>{t("thPrice")}</Th><Th>{t("thDate")}</Th><Th>{t("actions")}</Th></>}>
              {shown.length === 0 ? <EmptyRow cols={7} /> : shown.map((f) => (
                <Row key={f.realId}>
                  <Td className="pl-5"><div className="flex items-center gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary"><FileText className="size-5 text-muted-foreground" /></span><div><p className="text-sm font-semibold leading-tight">{f.title}</p><p className="text-xs text-muted-foreground">{f.id}</p></div></div></Td>
                  <Td><Pill tone="blue">{f.cat}</Pill></Td>
                  <Td className="text-foreground/80">{f.city}</Td>
                  <Td><Pill tone={f.stt} dot>{f.st}</Pill></Td>
                  <Td className="font-semibold">{f.price ? `${f.price} €` : "—"}</Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{f.date}</Td>
                  <Td><FicheRowActions id={f.realId} slug={f.slug} labels={{ actions: t("actions"), view: t("view"), edit: t("edit"), delete: t("delete"), confirmDelete: t("confirmDelete") }} /></Td>
                </Row>
              ))}
            </Table>
            <div className="border-t border-border p-3"><Pagination page={page} pages={pages} basePath="/admin/fiches" params={pgParams} label={t("count", { count: filtered.length })} /></div>
          </Panel>
      </div>
    </div>
  );
}
