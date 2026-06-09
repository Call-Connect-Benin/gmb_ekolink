import Link from "next/link";
import {
  ShoppingBag, Store, LayoutDashboard, PlusCircle, Users, Home, LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DashKey = "compte" | "catalogue" | "admin" | "newlisting" | "acheteurs";

type Item = { href: string; label: string; icon: typeof Home; key: DashKey };

const BUYER: Item[] = [
  { href: "/compte", label: "Mes commandes", icon: ShoppingBag, key: "compte" },
  { href: "/fiches-google", label: "Catalogue", icon: Store, key: "catalogue" },
];
const ADMIN: Item[] = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard, key: "admin" },
  { href: "/admin/fiches/nouvelle", label: "Nouvelle fiche", icon: PlusCircle, key: "newlisting" },
  { href: "/admin/utilisateurs", label: "Acheteurs", icon: Users, key: "acheteurs" },
];

function NavList({ items, active }: { items: Item[]; active: DashKey }) {
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((it) => {
        const Icon = it.icon;
        const on = active === it.key;
        return (
          <Link
            key={it.key}
            href={it.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              on ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {it.label}
          </Link>
        );
      })}
    </div>
  );
}

export default function DashboardShell({
  active,
  isAdmin,
  title,
  subtitle,
  actions,
  children,
}: {
  active: DashKey;
  isAdmin: boolean;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-secondary/30 pt-16">
      <div className="mx-auto flex max-w-[1240px] gap-6 px-5 py-8">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-border bg-card p-3 shadow-sm">
            {isAdmin && (
              <div>
                <p className="px-3 pb-1 pt-1 text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">Back-office</p>
                <NavList items={ADMIN} active={active} />
              </div>
            )}
            <div>
              <p className="px-3 pb-1 text-[0.7rem] font-bold uppercase tracking-wider text-muted-foreground">Espace client</p>
              <NavList items={BUYER} active={active} />
            </div>
            <div className="border-t border-border pt-2">
              <Link href="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground">
                <Home className="size-4" /> Retour au site
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                  <LogOut className="size-4" /> Déconnexion
                </button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main id="main" className="min-w-0 flex-1">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
