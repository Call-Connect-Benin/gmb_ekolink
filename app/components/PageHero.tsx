import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

/** En-tête commun des pages internes (fil d'Ariane + titre + accroche). */
export default function PageHero({
  title,
  lead,
  crumb,
}: {
  title: string;
  lead?: string;
  crumb: string;
}) {
  const t = useTranslations("nav");
  return (
    <section className="border-b border-border bg-gradient-to-b from-secondary/60 to-background pb-12 pt-[120px]">
      <div className="mx-auto max-w-[1200px] px-5 text-center">
        <nav className="mb-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground" aria-label="Fil d'Ariane">
          <Link href="/" className="text-primary hover:underline">{t("home")}</Link>
          <ChevronRight className="size-3.5 opacity-60" />
          <span aria-current="page">{crumb}</span>
        </nav>
        <h1 className="text-[clamp(1.85rem,3.6vw,2.75rem)] font-extrabold tracking-tight">{title}</h1>
        {lead && <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">{lead}</p>}
      </div>
    </section>
  );
}
