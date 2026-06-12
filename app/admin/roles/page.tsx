import { redirect } from "next/navigation";
import { Crown, ShieldCheck, UserRound, Users, Check } from "lucide-react";
import { StatCard, Panel } from "../../components/dashboard/ui";
import { PageHead, StatRow } from "../../components/dashboard/list";
import { tableAdmin, s } from "@/lib/dash";
import { isCurrentUserSuperAdmin } from "@/lib/queries";
import { getTranslations, getLocale } from "next-intl/server";
import AddAdminButton from "./AddAdminButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Rôles — Admin", robots: { index: false, follow: false } };

export default async function AdminRoles() {
  // Réservé au super administrateur.
  if (!(await isCurrentUserSuperAdmin())) {
    redirect("/admin");
  }

  const t = await getTranslations("dash.rolesAdmin");
  const en = (await getLocale()) === "en";

  const profiles = await tableAdmin<{ role: string }>("profiles", (r) => ({ role: s(r.role, "buyer") }));
  const supers = profiles.filter((p) => p.role === "super_admin").length;
  const admins = profiles.filter((p) => p.role === "admin").length;
  const buyers = profiles.filter((p) => p.role === "buyer").length;

  const ROLES = [
    {
      key: "super_admin",
      icon: Crown,
      box: "bg-accent/15 text-[#d97706]",
      name: en ? "Super administrator" : "Super administrateur",
      count: supers,
      desc: en ? "Full access, including roles & permissions and adding admins." : "Accès total, y compris la page Rôles & permissions et l'ajout d'administrateurs.",
      perms: en
        ? ["Everything an administrator can do", "Access the Roles & permissions page", "Add / promote administrators"]
        : ["Tout ce que fait un administrateur", "Accès à la page Rôles & permissions", "Ajouter / promouvoir des administrateurs"],
    },
    {
      key: "admin",
      icon: ShieldCheck,
      box: "bg-primary/10 text-primary",
      name: en ? "Administrator" : "Administrateur",
      count: admins,
      desc: en ? "Full back office, except the Roles & permissions page." : "Tout le back-office, sauf la page Rôles & permissions.",
      perms: en
        ? ["Manage listings & categories", "Manage orders & statuses", "Manage users", "Export data (CSV)", "No access to Roles & permissions"]
        : ["Gérer les fiches & catégories", "Gérer les commandes & statuts", "Gérer les utilisateurs", "Exporter les données (CSV)", "Pas d'accès à Rôles & permissions"],
    },
    {
      key: "buyer",
      icon: UserRound,
      box: "bg-success/12 text-success",
      name: en ? "Buyer" : "Acheteur",
      count: buyers,
      desc: en ? "Customer space: catalog, purchase and order tracking." : "Espace client : catalogue, achat et suivi des commandes.",
      perms: en
        ? ["Browse the catalog", "Buy a listing", "Track own orders", "Manage own profile"]
        : ["Parcourir le catalogue", "Acheter une fiche", "Suivre ses commandes", "Gérer son profil"],
    },
  ];

  const STATS = [
    { icon: Crown, tone: "orange" as const, label: en ? "Super admins" : "Super admins", value: String(supers) },
    { icon: ShieldCheck, tone: "blue" as const, label: en ? "Administrators" : "Administrateurs", value: String(admins) },
    { icon: UserRound, tone: "green" as const, label: en ? "Buyers" : "Acheteurs", value: String(buyers) },
    { icon: Users, tone: "purple" as const, label: en ? "Total users" : "Total utilisateurs", value: String(profiles.length) },
  ];

  const addLabels = {
    add: en ? "Add an admin" : "Ajouter un admin",
    title: en ? "New administrator" : "Nouvel administrateur",
    fullName: en ? "Full name" : "Nom complet",
    email: "Email",
    password: en ? "Password" : "Mot de passe",
    role: en ? "Role" : "Rôle",
    roleAdmin: en ? "Administrator" : "Administrateur",
    roleSuper: en ? "Super administrator" : "Super administrateur",
    create: en ? "Create" : "Créer",
    cancel: en ? "Cancel" : "Annuler",
  };

  return (
    <div className="space-y-6">
      <PageHead
        title={t("title")}
        subtitle={en ? "Three roles: super admin, administrator and buyer." : "Trois rôles : super admin, administrateur et acheteur."}
        actions={<AddAdminButton labels={addLabels} />}
      />
      <StatRow cols={4}>{STATS.map((st) => <StatCard key={st.label} {...st} />)}</StatRow>

      <div className="grid gap-5 lg:grid-cols-3">
        {ROLES.map((r) => (
          <Panel key={r.key}>
            <div className="flex items-start gap-3">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${r.box}`}><r.icon className="size-6" /></span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-extrabold">{r.name}</h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-foreground/70"><Users className="size-3.5" /> {r.count}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 border-t border-border pt-4">
              {r.perms.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-success" /> {p}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>

      <Panel className="bg-[linear-gradient(120deg,#eff5ff,#ffffff)]">
        <p className="text-sm text-muted-foreground">
          {en
            ? "Only a super admin can access this page and add administrators. The admin role is also granted automatically to emails listed in ADMIN_EMAILS (treated as super admin)."
            : "Seul un super admin accède à cette page et peut ajouter des administrateurs. Le rôle admin est aussi attribué automatiquement aux emails listés dans ADMIN_EMAILS (traités comme super admin)."}
        </p>
      </Panel>
    </div>
  );
}
