import { Search, ListFilter, Files } from "lucide-react";
import { Panel } from "../../components/dashboard/ui";
import { EmptyMini } from "../../components/dashboard/list";
import { table, s } from "@/lib/dash";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mes documents", robots: { index: false, follow: false } };

export default async function MesDocuments() {
  const t = await getTranslations("dash.documents");
  const td = await getTranslations("dashboard");
  const TABS = t.raw("tabs") as string[];
  const DOCS = await table<{ name: string }>("documents", (r) => ({ name: s(r.name) }), []);

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-6 border-b border-border">{TABS.map((tab, i) => <button key={tab} className={`border-b-2 pb-2.5 text-sm font-semibold ${i === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>)}</div>
        <div className="flex items-center gap-2.5">
          <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input placeholder={t("searchPlaceholder")} className="h-10 w-56 rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
          <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-secondary"><ListFilter className="size-4" /> {td("filters")}</button>
        </div>
      </div>

      <Panel className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10"><Files className="size-7 text-primary" /></span>
        <div className="flex-1"><p className="text-sm text-muted-foreground">{t("total")}</p><p className="text-3xl font-extrabold leading-tight">{DOCS.length}</p><p className="text-xs text-muted-foreground">{t("saved")}</p></div>
      </Panel>

      <Panel><div className="p-6"><EmptyMini label={t("empty")} /></div></Panel>
    </div>
  );
}
