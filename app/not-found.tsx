import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Home, Search } from "lucide-react";

export const metadata = { title: "Page introuvable (404)", robots: { index: false, follow: false } };

export default async function NotFound() {
  const t = await getTranslations("errors");
  return (
    <main id="main" className="flex min-h-[72vh] items-center justify-center px-5 py-24">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">{t("nfBadge")}</p>
        <p className="mt-4 bg-[linear-gradient(120deg,#1a73e8,#0c2244)] bg-clip-text text-[clamp(5rem,18vw,9rem)] font-black leading-none tracking-tight text-transparent">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{t("nfTitle")}</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("nfText")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90">
            <Home className="size-4" /> {t("nfHome")}
          </Link>
          <Link href="/fiches-google" className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold transition hover:bg-secondary">
            <Search className="size-4" /> {t("nfCatalogue")}
          </Link>
        </div>
      </div>
    </main>
  );
}
