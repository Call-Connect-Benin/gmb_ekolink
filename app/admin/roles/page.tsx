import { ShieldCheck, Users, ShieldHalf, KeyRound, Lock, Plus, Crown, Briefcase, Headphones, Megaphone, Calculator, Eye, Check, Minus, X, ChevronDown, Copy, UserCog, ListChecks, MoreHorizontal } from "lucide-react";
import { Donut, Legend } from "../../components/dashboard/Charts";
import { StatCard, Panel, PanelHeader, Pill, QuickAction, Table, Th, Td, Row } from "../../components/dashboard/ui";
import { PageHead, ExportBtn, HeadBtn, StatRow, FilterBar, EmptyRow, EmptyMini } from "../../components/dashboard/list";
import { table, s, n } from "@/lib/dash";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Rôles & Permissions — Admin" };

const ROLE_META: Record<string, { icon: typeof Crown; box: string; typet: "gray" | "blue" | "purple" | "green" | "red" | "orange"; tag?: string }> = {
  "Super administrateur": { icon: Crown, box: "bg-accent/15 text-[#d97706]", typet: "gray", tag: "Par défaut" },
  "Administrateur": { icon: ShieldCheck, box: "bg-primary/10 text-primary", typet: "blue" },
  "Gestionnaire": { icon: Briefcase, box: "bg-[#7c3aed]/10 text-[#7c3aed]", typet: "purple" },
  "Support client": { icon: Headphones, box: "bg-success/12 text-success", typet: "green" },
  "Marketing": { icon: Megaphone, box: "bg-[#ec4899]/10 text-[#ec4899]", typet: "red" },
  "Comptable": { icon: Calculator, box: "bg-accent/15 text-[#d97706]", typet: "orange" },
  "Invité / Lecture seule": { icon: Eye, box: "bg-secondary text-muted-foreground", typet: "gray", tag: "Lecture seule" },
};
type L = "f" | "p" | "n" | "r";
const MATRIX: Record<string, L[]> = {
  "Super administrateur": ["f", "f", "f", "f", "f", "f", "f", "f"], "Administrateur": ["f", "f", "f", "f", "f", "f", "f", "f"],
  "Gestionnaire": ["p", "f", "f", "p", "f", "p", "n", "f"], "Support client": ["n", "p", "p", "n", "f", "n", "n", "p"],
  "Marketing": ["n", "n", "n", "f", "p", "n", "n", "p"], "Comptable": ["p", "p", "p", "n", "n", "f", "n", "f"], "Invité / Lecture seule": ["r", "r", "r", "r", "r", "r", "r", "r"],
};
const CELL: Record<L, { icon: typeof Check; cls: string }> = { f: { icon: Check, cls: "bg-success/12 text-success" }, p: { icon: Minus, cls: "bg-accent/15 text-[#d97706]" }, n: { icon: X, cls: "bg-destructive/10 text-destructive" }, r: { icon: Eye, cls: "bg-secondary text-muted-foreground" } };

type Rl = { name: string; tag?: string; icon: typeof Crown; box: string; desc: string; users: number; kind: string; type: string; typet: "gray" | "blue" | "purple" | "green" | "red" | "orange"; perms: number };

export default async function AdminRoles() {
  const t = await getTranslations("dash.rolesAdmin");
  const PERM_SEG = [
    { label: t("segUsers"), value: 28, color: "#1a73e8" }, { label: t("segSales"), value: 25, color: "#22c55e" },
    { label: t("segMarketing"), value: 22, color: "#8b5cf6" }, { label: t("segSupport"), value: 18, color: "#f59e0b" },
    { label: t("segFinance"), value: 15, color: "#ec4899" }, { label: t("segOthers"), value: 20, color: "#94a3b8" },
  ];
  const MODULES = t.raw("modules") as string[];
  const ROLES = await table<Rl>("roles", (r) => {
    const name = s(r.name); const m = ROLE_META[name] ?? { icon: ShieldCheck, box: "bg-primary/10 text-primary", typet: "blue" as const };
    const kind = s(r.kind);
    return { name, tag: m.tag, icon: m.icon, box: m.box, desc: s(r.description), users: n(r.users_count), kind, type: kind === "system" ? t("typeSystem") : t("typeCustom"), typet: m.typet, perms: n(r.permissions_count) };
  }, []);

  const maxPerms = ROLES.length ? Math.max(...ROLES.map((r) => r.perms)) : 128;
  const STATS = [
    { icon: ShieldCheck, tone: "blue" as const, label: t("stTotal"), value: String(ROLES.length) },
    { icon: Users, tone: "green" as const, label: t("stUsersWithRole"), value: String(ROLES.reduce((a, r) => a + r.users, 0)) },
    { icon: ShieldHalf, tone: "purple" as const, label: t("stCustom"), value: String(ROLES.filter((r) => r.kind !== "system").length) },
    { icon: KeyRound, tone: "orange" as const, label: t("stMaxPerms"), value: String(maxPerms) },
    { icon: Lock, tone: "red" as const, label: t("stRestricted"), value: String(ROLES.filter((r) => r.perms < maxPerms).length) },
  ];
  const sel = ROLES.find((r) => r.name === "Administrateur") ?? ROLES[0];
  const cols = ROLES.map((r) => r.name);

  return (
    <div className="space-y-6">
      <PageHead title={t("title")} subtitle={t("subtitle")} actions={<><ExportBtn /><HeadBtn icon={Plus} variant="primary">{t("newRole")}</HeadBtn></>} />
      <StatRow cols={5}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="space-y-4">
          <FilterBar placeholder={t("search")} selects={[t("filterStatus"), t("filterType")]} />
          <Panel className="p-0">
            <Table head={<><Th className="pl-5">{t("thRole")}</Th><Th>{t("thDesc")}</Th><Th>{t("thUsers")}</Th><Th>{t("thType")}</Th><Th>{t("thStatus")}</Th><Th>{t("thPerms")}</Th><Th></Th></>}>
              {ROLES.length === 0 ? <EmptyRow cols={7} /> : ROLES.map((r) => (
                <Row key={r.name}>
                  <Td className="pl-5"><div className="flex items-center gap-2.5"><span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${r.box}`}><r.icon className="size-4" /></span><div><p className="text-sm font-semibold leading-tight">{r.name}</p>{r.tag && <span className="text-[10px] font-semibold text-muted-foreground">{r.tag}</span>}</div></div></Td>
                  <Td className="max-w-[200px] text-sm text-muted-foreground">{r.desc}</Td>
                  <Td><span className="inline-flex items-center gap-1.5 text-sm"><Users className="size-3.5 text-muted-foreground" /> {r.users}</span></Td>
                  <Td><Pill tone={r.typet}>{r.type}</Pill></Td>
                  <Td><Pill tone="green" dot>{t("active")}</Pill></Td>
                  <Td className="min-w-[120px]"><p className="mb-1 text-xs font-medium">{r.perms}/{maxPerms}</p><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(r.perms / maxPerms) * 100}%` }} /></div></Td>
                  <Td><button type="button" className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"><MoreHorizontal className="size-4" /></button></Td>
                </Row>
              ))}
            </Table>
          </Panel>
        </div>

        <aside className="space-y-5">
          <Panel>
            <PanelHeader title={t("permBreakdown")} />
            {ROLES.length ? <div className="flex flex-col items-center gap-4"><Donut segments={PERM_SEG} centerTop="128" size={160} /><Legend segments={PERM_SEG} /></div> : <EmptyMini />}
          </Panel>
          <Panel>
            <PanelHeader title={t("selectedDetails")} />
            {sel ? (
              <>
                <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"><span className="flex items-center gap-2 text-sm font-bold"><sel.icon className="size-4 text-primary" /> {sel.name}</span><ChevronDown className="size-4 text-muted-foreground" /></div>
                <ul className="mt-4 space-y-3 text-sm">
                  <li className="flex justify-between"><span className="text-muted-foreground">{t("usersAssigned")}</span><span className="font-bold">{sel.users}</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">{t("permsGranted")}</span><span className="font-bold">{sel.perms}/{maxPerms}</span></li>
                  <li className="flex justify-between"><span className="text-muted-foreground">{t("typeLabel")}</span><span className="font-bold">{sel.type}</span></li>
                </ul>
              </>
            ) : <EmptyMini />}
          </Panel>
          <Panel>
            <PanelHeader title={t("quickActions")} />
            <div className="flex flex-col gap-1">
              <QuickAction icon={Plus} tone="blue" label={t("qaCreate")} />
              <QuickAction icon={Copy} tone="purple" label={t("qaDuplicate")} />
              <QuickAction icon={UserCog} tone="teal" label={t("qaManageUsers")} href="/admin/utilisateurs" />
              <QuickAction icon={ListChecks} tone="green" label={t("qaAllPerms")} />
            </div>
          </Panel>
        </aside>
      </div>

      {ROLES.length > 0 && (
        <Panel>
          <PanelHeader title={t("permOverview")} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead><tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground"><th className="py-2.5 pr-3 font-semibold">{t("moduleCol")}</th>{cols.map((c) => <th key={c} className="px-2 py-2.5 text-center font-semibold">{c.split(" ")[0]}</th>)}</tr></thead>
              <tbody>
                {MODULES.map((m, ri) => (
                  <tr key={m} className="border-b border-border/70 last:border-0">
                    <td className="py-2.5 pr-3 font-medium">{m}</td>
                    {cols.map((c, ci) => { const lv = (MATRIX[c]?.[ri] ?? "n"); const cell = CELL[lv]; return <td key={ci} className="px-2 py-2.5 text-center"><span className={`inline-flex size-6 items-center justify-center rounded-full ${cell.cls}`}><cell.icon className="size-3.5" /></span></td>; })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-5 text-xs">
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-success" /> {t("legendFull")}</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-accent" /> {t("legendPartial")}</span>
            <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-destructive" /> {t("legendNone")}</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="size-3.5 text-muted-foreground" /> {t("legendRead")}</span>
          </div>
        </Panel>
      )}
    </div>
  );
}
