"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Home, ShoppingBag, Folder, User,
  LogOut, Menu, X, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "../LocaleSwitcher";

type Item = { href: string; label: string; icon: typeof Home; badge?: string };

function NavLink({ it, on, onNav }: { it: Item; on: boolean; onNav?: () => void }) {
  return (
    <Link
      href={it.href}
      onClick={onNav}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        on ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-secondary hover:text-foreground"
      )}
    >
      <it.icon className="size-[18px] shrink-0" strokeWidth={1.9} />
      <span className="flex-1">{it.label}</span>
      {it.badge && <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">{it.badge}</span>}
    </Link>
  );
}

function SidebarInner({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  const t = useTranslations("dashboard");
  const PRIMARY: Item[] = [
    { href: "/compte", label: t("clientDashboard"), icon: Home },
    { href: "/compte/commandes", label: t("myOrders"), icon: ShoppingBag },
    { href: "/compte/documents", label: t("myDocuments"), icon: Folder },
    { href: "/compte/profil", label: t("myProfile"), icon: User },
  ];
  const active = (href: string) => (href === "/compte" ? pathname === "/compte" : pathname.startsWith(href));
  return (
    <>
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href="/" aria-label="EkoLink" onClick={onNav}><img src="/assets/icons/logo-tight.png" alt="EkoLink" className="h-7 w-auto" /></Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="flex flex-col gap-0.5">{PRIMARY.map((it) => <NavLink key={it.href} it={it} on={active(it.href)} onNav={onNav} />)}</div>
        <div className="my-3 border-t border-border" />
        <form action="/auth/signout" method="post" className="mt-0.5">
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive">
            <LogOut className="size-[18px]" /> {t("logout")}
          </button>
        </form>
      </nav>
      {/* Carte promo */}
      <div className="shrink-0 p-3">
        <div className="rounded-2xl bg-[linear-gradient(160deg,#0b1119,#0a1a33)] p-4 text-white">
          <div className="mb-2 flex size-9 items-center justify-center rounded-xl bg-white/10"><ShoppingBag className="size-5 text-accent" /></div>
          <p className="text-sm font-bold text-accent">{t("promoTitle")}</p>
          <p className="mt-1 text-xs text-white/70">{t("promoText")}</p>
          <Link href="/fiches-google" onClick={onNav} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-bold text-[#0b1119] hover:bg-white/90">
            {t("promoCta")} <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default function ClientShell({
  children,
  userName = "Mon compte",
  userInitial = "C",
  userAvatar = "",
}: {
  children: React.ReactNode;
  userName?: string;
  userInitial?: string;
  userAvatar?: string;
}) {
  const t = useTranslations("dashboard");
  const pathname = usePathname() || "/compte";
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-white lg:flex">
        <SidebarInner pathname={pathname} />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-white">
            <button className="absolute right-3 top-4 text-muted-foreground" onClick={() => setOpen(false)} aria-label={t("close")}><X className="size-5" /></button>
            <SidebarInner pathname={pathname} onNav={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6">
          <button className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-secondary lg:hidden" onClick={() => setOpen(true)} aria-label={t("menu")}><Menu className="size-5" /></button>
          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <LocaleSwitcher />
            <Link href="/compte/profil" className="flex items-center gap-2.5 rounded-xl p-1 pr-2 hover:bg-secondary">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="size-9 rounded-full object-cover" />
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{userInitial}</span>
              )}
              <span className="hidden max-w-[160px] truncate text-sm font-bold sm:block">{userName}</span>
            </Link>
          </div>
        </header>

        <main id="main" className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
