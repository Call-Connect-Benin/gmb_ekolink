"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutGrid, Users, ShoppingCart, FileText, ShieldCheck, Tags,
  LogOut, Menu, X, Search, User, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "../LocaleSwitcher";

type Item = { href: string; label: string; icon: typeof Users };

function Nav({ pathname, onNav, isSuperAdmin }: { pathname: string; onNav?: () => void; isSuperAdmin?: boolean }) {
  const t = useTranslations("dashboard");
  const SECTIONS: { title?: string; items: Item[] }[] = [
    { items: [{ href: "/admin", label: t("clientDashboard"), icon: LayoutGrid }] },
    {
      title: t("sectionManagement"),
      items: [
        { href: "/admin/utilisateurs", label: t("users"), icon: Users },
        { href: "/admin/commandes", label: t("orders"), icon: ShoppingCart },
        { href: "/admin/fiches", label: t("listings"), icon: FileText },
        { href: "/admin/categories", label: t("categories"), icon: Tags },
      ],
    },
    {
      title: t("sectionSettings"),
      items: [
        // Rôles & Permissions réservé au super administrateur.
        ...(isSuperAdmin ? [{ href: "/admin/roles", label: t("roles"), icon: ShieldCheck }] : []),
        { href: "/admin/profil", label: t("myProfile"), icon: User },
      ],
    },
  ];
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <nav className="px-3 py-2">
      {SECTIONS.map((sec) => (
        <div key={sec.title ?? sec.items[0]?.href} className="mb-3">
          {sec.title && <p className="px-3 pb-1 pt-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">{sec.title}</p>}
          <div className="flex flex-col gap-0.5">
            {sec.items.map((it) => {
              const on = isActive(it.href);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={onNav}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    on ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <it.icon className="size-[18px] shrink-0" strokeWidth={1.9} />
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarInner({ pathname, onNav, isSuperAdmin }: { pathname: string; onNav?: () => void; isSuperAdmin?: boolean }) {
  const t = useTranslations("dashboard");
  return (
    <>
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href="/" aria-label="EkoLink" onClick={onNav}>
          <img src="/assets/icons/logo-tight.png" alt="EkoLink" className="h-7 w-auto" />
        </Link>
      </div>
      {/* Menu : seule zone qui défile si l'écran est court (barre masquée). Le flex-1 le fait remplir la hauteur sur grand écran et colle l'encart en bas. */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Nav pathname={pathname} onNav={onNav} isSuperAdmin={isSuperAdmin} />
      </div>

      {/* Encart compact épinglé : shrink-0 => toujours entièrement visible, sans défilement */}
      <div className="shrink-0 p-3">
        <div className="rounded-xl bg-[linear-gradient(160deg,#0b1119,#0a1a33)] p-3 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/10"><ExternalLink className="size-4 text-accent" /></span>
            <p className="text-sm font-bold leading-tight text-accent">{t("sideViewTitle")}</p>
          </div>
          <p className="mt-2 line-clamp-1 text-xs text-white/70">{t("sideViewText")}</p>
          <a href="/" target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0b1119] hover:bg-white/90">
            {t("sideViewCta")} <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      <div className="shrink-0 border-t border-border p-3">
        <form action="/auth/signout" method="post">
          <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="size-[18px]" /> {t("logout")}
          </button>
        </form>
      </div>
    </>
  );
}

export default function AdminShell({
  children,
  userName = "Admin",
  userInitial = "A",
  userAvatar = "",
  isSuperAdmin = false,
}: {
  children: React.ReactNode;
  userName?: string;
  userInitial?: string;
  userAvatar?: string;
  isSuperAdmin?: boolean;
}) {
  const t = useTranslations("dashboard");
  const pathname = usePathname() || "/admin";
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* Sidebar fixe (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-white lg:flex">
        <SidebarInner pathname={pathname} isSuperAdmin={isSuperAdmin} />
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-white">
            <button className="absolute right-3 top-4 text-muted-foreground" onClick={() => setOpen(false)} aria-label={t("close")}><X className="size-5" /></button>
            <SidebarInner pathname={pathname} onNav={() => setOpen(false)} isSuperAdmin={isSuperAdmin} />
          </aside>
        </div>
      )}

      {/* Colonne principale */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary lg:hidden" onClick={() => setOpen(true)} aria-label={t("menu")}><Menu className="size-5" /></button>
          <form action="/admin/recherche" method="get" className="relative hidden w-full max-w-md sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input name="q" placeholder={t("searchAdmin")} className="h-10 w-full rounded-xl border border-border bg-secondary/50 pl-9 pr-12 text-sm outline-none focus:border-primary focus:bg-white" />
            <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-white px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground md:block">⌘ K</kbd>
          </form>
          <div className="ml-auto flex items-center gap-3">
            <LocaleSwitcher />
            <Link href="/admin/profil" className="flex items-center gap-2.5 rounded-xl p-1 pr-2 hover:bg-secondary">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="size-9 rounded-full object-cover" />
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{userInitial}</span>
              )}
              <span className="hidden text-left sm:block">
                <span className="block max-w-[160px] truncate text-sm font-bold leading-tight">{userName}</span>
                <span className="block text-xs text-muted-foreground">{isSuperAdmin ? t("superAdmin") : t("admin")}</span>
              </span>
            </Link>
          </div>
        </header>

        <main id="main" className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
