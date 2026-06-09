"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "./LocaleSwitcher";

const CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const LINKS = [
  { href: "/", key: "home" },
  { href: "/fiches-google", key: "catalogue" },
  { href: "/comment-ca-marche", key: "howItWorks" },
  { href: "/faq", key: "faq" },
  { href: "/a-propos", key: "about" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!CONFIGURED) return;
    const sb = createClient();
    sb.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) =>
      setSignedIn(Boolean(session?.user))
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Pages à hero sombre : header transparent + texte blanc tant qu'on n'a pas scrollé.
  const onDark = !scrolled && (pathname === "/a-propos" || pathname === "/faq");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[1000] border-b transition-all",
        scrolled
          ? "border-border bg-white/90 shadow-[0_8px_30px_rgba(11,18,28,0.06)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between gap-4 px-5">
        <Link href="/" className="flex shrink-0 items-center" aria-label="EkoLink">
          <img src="/assets/icons/logo.png" alt="EkoLink" width={200} height={60} className="site-logo object-contain" />
        </Link>

        <nav className="hidden items-center gap-9 min-[1024px]:flex" aria-label="Navigation principale">
          {LINKS.map((l) => {
            const on = isActive(l.href);
            const cls = cn(
              "relative py-1 text-[15px] font-medium transition-colors",
              onDark
                ? on ? "text-white" : "text-white/80 hover:text-white"
                : on ? "text-primary" : "text-foreground/75 hover:text-foreground"
            );
            const underline = on && <span className={cn("absolute -bottom-[22px] left-0 h-0.5 w-full", onDark ? "bg-white" : "bg-primary")} />;
            return l.href.startsWith("/#") ? (
              <a key={l.href} href={l.href} className={cls}>{t(l.key)}{underline}</a>
            ) : (
              <Link key={l.href} href={l.href} className={cls}>{t(l.key)}{underline}</Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 min-[1024px]:flex">
          <LocaleSwitcher onDark={onDark} />
          <Button asChild variant="outline" className={onDark ? "border-white/40 bg-transparent text-white hover:bg-white/10" : "border-primary/30 text-primary hover:bg-primary/5"}>
            <Link href={signedIn ? "/compte" : "/connexion"}>{signedIn ? t("account") : t("login")}</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className={cn("flex size-10 items-center justify-center rounded-lg min-[1024px]:hidden", onDark ? "text-white hover:bg-white/10" : "text-foreground hover:bg-secondary")}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-5 pb-6 pt-3 min-[1024px]:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) =>
              l.href.startsWith("/#") ? (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">{t(l.key)}</a>
              ) : (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-secondary">{t(l.key)}</Link>
              )
            )}
            <Button asChild variant="outline" className="mt-3"><Link href={signedIn ? "/compte" : "/connexion"} onClick={() => setOpen(false)}>{signedIn ? t("account") : t("login")}</Link></Button>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground/70">Langue</span>
              <LocaleSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
