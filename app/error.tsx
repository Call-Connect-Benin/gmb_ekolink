"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { RotateCcw, Home, TriangleAlert } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    // Journalisation (remplaçable par un service de reporting).
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="flex min-h-[72vh] items-center justify-center px-5 py-24">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
          <TriangleAlert className="size-7 text-destructive" />
        </span>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t("errBadge")}</p>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">{t("errTitle")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("errText")}</p>
        {error?.digest && (
          <p className="mt-2 text-xs text-muted-foreground/70">{t("errRef")} : {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90"
          >
            <RotateCcw className="size-4" /> {t("errRetry")}
          </button>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold transition hover:bg-secondary">
            <Home className="size-4" /> {t("errHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
