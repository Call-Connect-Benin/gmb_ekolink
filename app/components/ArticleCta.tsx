import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShieldCheck, ArrowRight } from "lucide-react";

/** Bannière CTA insérée au milieu du contenu d'un article. */
export default function ArticleCta({
  title,
  text,
}: {
  title?: string;
  text?: string;
}) {
  const t = useTranslations("article");
  return (
    <aside className="not-prose my-8 flex flex-col items-start gap-4 rounded-2xl bg-[linear-gradient(120deg,#0b1119,#102a52)] p-6 text-white sm:flex-row sm:items-center">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10"><ShieldCheck className="size-6 text-accent" /></span>
      <div className="flex-1">
        <p className="text-base font-bold">{title ?? t("ctaTitle")}</p>
        <p className="mt-1 text-sm text-white/70">{text ?? t("ctaText")}</p>
      </div>
      <Link href="/fiches-google" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground hover:bg-accent/90">{t("ctaButton")} <ArrowRight className="size-4" /></Link>
    </aside>
  );
}
