import Link from "next/link";
import { Users, CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import { StatCard, Panel, PanelHeader, Avatar, Pill, Table, Th, Td, Row, Pagination } from "../../components/dashboard/ui";
import { PageHead, StatRow, EmptyRow, EmptyMini } from "../../components/dashboard/list";
import { tableAdmin, s } from "@/lib/dash";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getTranslations } from "next-intl/server";
import UsersFilter from "./UsersFilter";
import AddUserButton from "./AddUserButton";
import UserRowActions from "./UserRowActions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Utilisateurs — Admin", robots: { index: false, follow: false } };

type U = { id: string; name: string; email: string; roleRaw: string; role: string; roleTone: "blue" | "purple" | "teal"; date: string; anon: boolean };

export default async function AdminUtilisateurs({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; page?: string }> }) {
  const t = await getTranslations("dash.usersAdmin");
  const { q, role, page: pageParam } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();
  const ROLE_MAP: Record<string, { label: string; tone: "blue" | "purple" | "teal"; color: string }> = {
    super_admin: { label: t("rSuper"), tone: "purple", color: "#8b5cf6" },
    admin: { label: t("rAdmin"), tone: "blue", color: "#1a73e8" },
    buyer: { label: t("rBuyer"), tone: "teal", color: "#0ea5e9" },
  };
  const TABS = t.raw("tabs") as string[];
  const U = await tableAdmin<U>("profiles", (r) => {
    const raw = s(r.role, "buyer"); const m = ROLE_MAP[raw] ?? ROLE_MAP.buyer;
    return { id: s(r.id), name: s(r.full_name, s(r.email)), email: s(r.email), roleRaw: raw, role: m.label, roleTone: m.tone, date: s(r.created_at).slice(0, 10), anon: Boolean(r.anonymized) };
  }, { order: "created_at" });

  // MD4 — Statut réel dérivé d'auth.users (suspension / dernière connexion).
  const authStatus = new Map<string, "active" | "suspended" | "pending">();
  if (isSupabaseConfigured()) {
    try {
      const adminCli = createAdminClient();
      const now = Date.now();
      const perPage = 1000;
      // Pagination en boucle : statuts corrects même au-delà de 1000 comptes.
      for (let page = 1; page <= 50; page++) {
        const { data: authData } = await adminCli.auth.admin.listUsers({ perPage, page });
        const users = authData?.users ?? [];
        for (const au of users) {
          const banned = au.banned_until ? new Date(au.banned_until).getTime() > now : false;
          authStatus.set(au.id, banned ? "suspended" : au.last_sign_in_at ? "active" : "pending");
        }
        if (users.length < perPage) break;
      }
    } catch {
      /* repli : statut indéterminé (carte/colonne montrent l'état connu) */
    }
  }
  const hasAuth = authStatus.size > 0;
  type UStatus = "active" | "suspended" | "pending" | "anonyme";
  const STATUS_META: Record<UStatus, { label: string; tone: "green" | "red" | "orange" | "gray" }> = {
    active: { label: t("stsActive"), tone: "green" },
    suspended: { label: t("stsSuspended"), tone: "red" },
    pending: { label: t("stsPending"), tone: "orange" },
    anonyme: { label: t("stsAnonymous"), tone: "gray" },
  };

  // Filtrage dynamique (recherche nom/email + rôle) via les paramètres d'URL.
  const filtered = U
    .filter((u) => (!role || u.roleRaw === role) && (!query || `${u.name} ${u.email}`.toLowerCase().includes(query)))
    .map((u) => ({ ...u, status: (u.anon ? "anonyme" : authStatus.get(u.id) ?? "active") as UStatus }));

  // MD6 — pagination réelle (navigation par URL ?page=, filtres conservés).
  const PER_PAGE = 10;
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), pages);
  const shown = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const pgParams: Record<string, string> = {};
  if (q) pgParams.q = q;
  if (role) pgParams.role = role;
  // La base n'autorise que buyer/admin (cf. contrainte SQL).
  const editRoleOptions = [
    { value: "buyer", label: t("rBuyer") },
    { value: "admin", label: t("rAdmin") },
  ];
  const addUserLabels = { add: t("addUser"), modalTitle: t("modalTitle"), fullName: t("fullName"), email: t("thEmail"), password: t("password"), role: t("role"), create: t("create"), cancel: t("cancel") };

  const activeCount = hasAuth ? U.filter((u) => authStatus.get(u.id) === "active").length : U.length;
  const STATS = [
    { icon: Users, tone: "blue" as const, label: t("stTotal"), value: String(U.length) },
    { icon: CheckCircle2, tone: "green" as const, label: t("stActive"), value: String(activeCount) },
    { icon: ShieldCheck, tone: "purple" as const, label: t("stAdmins"), value: String(U.filter((u) => u.roleRaw === "admin").length) },
    { icon: UserPlus, tone: "orange" as const, label: t("stBuyers"), value: String(U.filter((u) => u.roleRaw === "buyer").length) },
  ];
  const roles = Array.from(new Set(U.map((u) => u.role)));
  const SEG = roles.map((rl) => ({ label: rl, value: U.filter((u) => u.role === rl).length, color: Object.values(ROLE_MAP).find((m) => m.label === rl)?.color ?? "#94a3b8" }));

  return (
    <div className="space-y-6">
      <PageHead title={t("title")} subtitle={t("subtitle")} actions={<AddUserButton variant="button" labels={addUserLabels} roleOptions={editRoleOptions} />} />
      <StatRow cols={4}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      <div className="space-y-4">
        <UsersFilter
          q0={q ?? ""}
          role0={role ?? ""}
          placeholder={t("searchPlaceholder")}
          roleLabel={t("role")}
          roleOptions={editRoleOptions}
          exportLabel={t("export")}
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
          <div className="flex gap-6 border-b border-border px-5">
            {TABS.map((tab, i) => {
              // MD7 — onglets fonctionnels : filtrent par rôle via l'URL (en conservant la recherche).
              const r = ["", "admin", "buyer"][i] ?? "";
              const active = (role ?? "") === r;
              const params = new URLSearchParams();
              if (r) params.set("role", r);
              if (q) params.set("q", q);
              const href = `/admin/utilisateurs${params.toString() ? `?${params}` : ""}`;
              return (
                <Link key={tab} href={href} className={`relative -mb-px border-b-2 py-3.5 text-sm font-semibold ${active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</Link>
              );
            })}
          </div>
          <Table head={<><Th className="pl-5">{t("thUser")}</Th><Th>{t("thEmail")}</Th><Th>{t("thRole")}</Th><Th>{t("thStatus")}</Th><Th>{t("thDate")}</Th><Th></Th></>}>
            {shown.length === 0 ? <EmptyRow cols={6} /> : shown.map((u) => (
              <Row key={u.email}>
                <Td className="pl-5"><div className="flex items-center gap-2.5"><Avatar name={u.name} size={32} /><span className="text-sm font-semibold">{u.name}</span></div></Td>
                <Td className="text-muted-foreground">{u.email}</Td>
                <Td><Pill tone={u.roleTone}>{u.role}</Pill></Td>
                <Td><Pill tone={STATUS_META[u.status].tone} dot>{STATUS_META[u.status].label}</Pill></Td>
                <Td className="text-muted-foreground">{u.date}</Td>
                <Td><UserRowActions id={u.id} role={u.roleRaw} labels={{ actions: t("actions"), changeRole: t("changeRole"), delete: t("delete"), confirmDelete: t("confirmDelete") }} roleOptions={editRoleOptions} /></Td>
              </Row>
            ))}
          </Table>
          <div className="border-t border-border p-3"><Pagination page={page} pages={pages} basePath="/admin/utilisateurs" params={pgParams} label={t("count", { count: filtered.length })} /></div>
        </Panel>
      </div>
    </div>
  );
}
