import Link from "next/link";
import { Search, Users, CheckCircle2, ShieldCheck, UserPlus, Ban, Download, Plus, ChevronDown, MoreHorizontal, UserCog } from "lucide-react";
import { Donut, Legend } from "../../components/dashboard/Charts";
import { StatCard, Panel, PanelHeader, Avatar, Pill, QuickAction, Table, Th, Td, Row, Pagination } from "../../components/dashboard/ui";
import { PageHead, StatRow, EmptyRow, EmptyMini } from "../../components/dashboard/list";
import { table, s } from "@/lib/dash";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Utilisateurs — Admin", robots: { index: false, follow: false } };

type U = { name: string; email: string; roleRaw: string; role: string; roleTone: "blue" | "purple" | "teal"; date: string };

export default async function AdminUtilisateurs() {
  const t = await getTranslations("dash.usersAdmin");
  const ROLE_MAP: Record<string, { label: string; tone: "blue" | "purple" | "teal"; color: string }> = {
    admin: { label: t("rAdmin"), tone: "blue", color: "#1a73e8" },
    pro: { label: t("rPro"), tone: "purple", color: "#8b5cf6" },
    buyer: { label: t("rBuyer"), tone: "teal", color: "#0ea5e9" },
  };
  const TABS = t.raw("tabs") as string[];
  const U = await table<U>("profiles", (r) => {
    const raw = s(r.role, "buyer"); const m = ROLE_MAP[raw] ?? ROLE_MAP.buyer;
    return { name: s(r.full_name, s(r.email)), email: s(r.email), roleRaw: raw, role: m.label, roleTone: m.tone, date: s(r.created_at).slice(0, 10) };
  }, [], { order: "created_at" });

  const STATS = [
    { icon: Users, tone: "blue" as const, label: t("stTotal"), value: String(U.length) },
    { icon: CheckCircle2, tone: "green" as const, label: t("stActive"), value: String(U.length) },
    { icon: ShieldCheck, tone: "purple" as const, label: t("stAdmins"), value: String(U.filter((u) => u.roleRaw === "admin").length) },
    { icon: UserPlus, tone: "orange" as const, label: t("stBuyers"), value: String(U.filter((u) => u.roleRaw === "buyer").length) },
    { icon: Ban, tone: "teal" as const, label: t("stPros"), value: String(U.filter((u) => u.roleRaw === "pro").length) },
  ];
  const roles = Array.from(new Set(U.map((u) => u.role)));
  const SEG = roles.map((rl) => ({ label: rl, value: U.filter((u) => u.role === rl).length, color: Object.values(ROLE_MAP).find((m) => m.label === rl)?.color ?? "#94a3b8" }));
  const latest = U.slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHead title={t("title")} subtitle={t("subtitle")} />
      <StatRow cols={5}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel className="p-0">
          <div className="flex gap-6 border-b border-border px-5">
            {TABS.map((tab, i) => <button key={tab} className={`relative -mb-px border-b-2 py-3.5 text-sm font-semibold ${i === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>)}
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4">
            <div className="relative min-w-[200px] flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input placeholder={t("searchPlaceholder")} className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
            <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground/80">{t("role")} <ChevronDown className="size-4 text-muted-foreground" /></span>
            <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground/80">{t("status")} <ChevronDown className="size-4 text-muted-foreground" /></span>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary"><Download className="size-4" /> {t("export")}</button>
            <button className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"><Plus className="size-4" /> {t("addUser")}</button>
          </div>
          <Table head={<><Th className="pl-5">{t("thUser")}</Th><Th>{t("thEmail")}</Th><Th>{t("thRole")}</Th><Th>{t("thStatus")}</Th><Th>{t("thDate")}</Th><Th></Th></>}>
            {U.length === 0 ? <EmptyRow cols={6} /> : U.map((u) => (
              <Row key={u.email}>
                <Td className="pl-5"><div className="flex items-center gap-2.5"><Avatar name={u.name} size={32} /><span className="text-sm font-semibold">{u.name}</span></div></Td>
                <Td className="text-muted-foreground">{u.email}</Td>
                <Td><Pill tone={u.roleTone}>{u.role}</Pill></Td>
                <Td><Pill tone="green" dot>{t("active")}</Pill></Td>
                <Td className="text-muted-foreground">{u.date}</Td>
                <Td><button type="button" className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"><MoreHorizontal className="size-4" /></button></Td>
              </Row>
            ))}
          </Table>
          <div className="border-t border-border p-3"><Pagination page={1} pages={1} label={t("count", { count: U.length })} /></div>
        </Panel>

        <aside className="space-y-5">
          <Panel>
            <PanelHeader title={t("breakdown")} />
            {SEG.length ? <div className="flex flex-col items-center gap-4"><Donut segments={SEG} centerTop={String(U.length)} size={160} /><Legend segments={SEG} /></div> : <EmptyMini />}
          </Panel>
          <Panel>
            <PanelHeader title={t("latest")} />
            {latest.length ? (
              <ul className="space-y-3">{latest.map((l) => (
                <li key={l.email} className="flex items-center gap-3"><Avatar name={l.name} size={36} /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold leading-tight">{l.name}</p><p className="truncate text-xs text-muted-foreground">{l.email}</p></div><span className="whitespace-nowrap text-xs text-muted-foreground">{l.date}</span></li>
              ))}</ul>
            ) : <EmptyMini />}
          </Panel>
          <Panel>
            <PanelHeader title={t("quickActions")} />
            <div className="flex flex-col gap-1">
              <QuickAction icon={UserPlus} tone="blue" label={t("qaAddUser")} />
              <QuickAction icon={UserCog} tone="purple" label={t("qaManageRoles")} href="/admin/roles" />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
