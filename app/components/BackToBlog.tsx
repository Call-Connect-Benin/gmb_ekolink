import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "next-intl/server";

/** Bouton « Voir d'autres articles » placé en bas de chaque article, retour au blog. */
export default async function BackToBlog() {
  const en = (await getLocale()) === "en";
  return (
    <div className="not-prose mt-10 flex justify-center border-t border-border pt-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-[0_10px_26px_rgba(248,159,27,0.25)] transition hover:-translate-y-0.5 hover:bg-accent/90"
      >
        <ArrowLeft className="size-4" /> {en ? "See more articles" : "Voir d'autres articles"}
      </Link>
    </div>
  );
}
