"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
] as const;

/** Bascule de langue FR/EN (cookie `locale` + refresh des composants serveur). */
export default function LocaleSwitcher({ onDark = false }: { onDark?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const setLocale = (code: string) => {
    if (code === locale || pending) return;
    const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; secure" : "";
    document.cookie = `locale=${code}; path=/; max-age=31536000; samesite=lax${secure}`;
    startTransition(() => router.refresh());
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border py-0.5 pl-2 pr-0.5",
        onDark ? "border-white/30" : "border-border bg-card"
      )}
      role="group"
      aria-label="Changer de langue"
    >
      <Globe className={cn("mr-0.5 size-4", onDark ? "text-white/80" : "text-muted-foreground")} aria-hidden="true" />
      {LOCALES.map((l) => {
        const active = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            disabled={pending}
            aria-pressed={active}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-bold transition-colors disabled:opacity-60",
              active
                ? onDark
                  ? "bg-white text-foreground"
                  : "bg-primary text-primary-foreground"
                : onDark
                  ? "text-white/70 hover:text-white"
                  : "text-foreground/60 hover:text-foreground"
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
