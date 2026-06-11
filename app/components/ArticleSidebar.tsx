/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { ShieldCheck, ArrowRight, MapPin, Star, Headset, Lock, Truck } from "lucide-react";
import { getListings, getCategories } from "@/lib/queries";
import { listingImage } from "@/lib/listingImage";

/** Sidebar sticky des articles de blog : CTA fixe + suggestions de fiches réelles. */
export default async function ArticleSidebar() {
  const t = await getTranslations("article");
  const en = (await getLocale()) === "en";
  const [listings, categories] = await Promise.all([getListings({ status: "available" }), getCategories()]);
  const catName = (s: string) => {
    const c = categories.find((x) => x.slug === s);
    return c ? (en ? c.name_en : c.name_fr) : s;
  };
  // 3 fiches réellement disponibles (liens valides, prix/note réels).
  const suggestions = listings.slice(0, 3).map((l) => ({
    slug: l.slug,
    name: l.title,
    metier: catName(l.category_slug),
    city: l.city,
    price: l.price,
    rating: l.rating ?? 0,
    img: listingImage(l.category_slug, l.city, l.images?.[0]),
  }));

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-5">
        <div className="overflow-hidden rounded-2xl bg-[linear-gradient(160deg,#0b1119,#0a1a33)] p-5 text-white shadow-[0_18px_50px_rgba(11,18,28,0.18)]">
          <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-white/10"><ShieldCheck className="size-6 text-accent" /></span>
          <p className="text-lg font-extrabold leading-tight">{t("sidebarTitle")}</p>
          <p className="mt-2 text-sm text-white/70">{t("sidebarText")}</p>
          <ul className="my-4 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Lock className="size-4 text-accent" /> {t("feat1")}</li>
            <li className="flex items-center gap-2"><Truck className="size-4 text-accent" /> {t("feat2")}</li>
            <li className="flex items-center gap-2"><Headset className="size-4 text-accent" /> {t("feat3")}</li>
          </ul>
          <Link href="/fiches-google" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-accent-foreground hover:bg-accent/90">{t("browseCatalogue")} <ArrowRight className="size-4" /></Link>
        </div>

        {suggestions.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold">{t("recommended")}</h3>
            <ul className="space-y-3">
              {suggestions.map((s) => (
                <li key={s.slug}>
                  <Link href={`/fiches-google/${s.slug}`} className="group flex items-center gap-3">
                    <img src={s.img} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground group-hover:text-primary">{s.name}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {s.city} · {s.metier}</span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs"><span className="font-bold text-primary">{s.price} €</span><span className="inline-flex text-[#fbbc04]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-3 ${i < Math.round(s.rating) ? "fill-current" : "fill-transparent text-border"}`} />)}</span></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/fiches-google" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">{t("viewAll")} <ArrowRight className="size-3.5" /></Link>
          </div>
        )}
      </div>
    </aside>
  );
}
