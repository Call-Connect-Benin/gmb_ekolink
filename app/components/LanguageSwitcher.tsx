"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const router = useRouter();
  const locale = useLocale();

  const set = (l: "fr" | "en") => {
    document.cookie = `locale=${l};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  };

  const active = tone === "light" ? "text-foreground" : "text-white";
  const idle =
    tone === "light"
      ? "text-muted-foreground hover:text-foreground"
      : "text-white/50 hover:text-white/80";

  return (
    <div className={cn("flex items-center gap-0.5 text-xs font-semibold", className)}>
      {(["fr", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center">
          {i === 1 && <span className="mx-0.5 text-current opacity-30">·</span>}
          <button
            type="button"
            onClick={() => set(l)}
            aria-pressed={locale === l}
            className={cn("rounded px-1 py-0.5 uppercase transition-colors", locale === l ? active : idle)}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
