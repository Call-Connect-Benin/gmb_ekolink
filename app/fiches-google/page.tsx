/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight, ClipboardList, MapPin, Truck, Headset,
  ShieldCheck, Lock, Plus, Star,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import CatalogueBrowser, { type CatItem } from "./CatalogueBrowser";
import { getCategories, getListings } from "@/lib/queries";
import { listingImage } from "@/lib/listingImage";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catalogue de fiches Google Business par métier",
  description:
    "Achetez une fiche Google Business Profile déjà créée et optimisée, classée par métier et par ville. Disponible immédiatement, prête à revendiquer.",
  alternates: { canonical: "/fiches-google" },
};

const cap = (x: string) => (x ? x.charAt(0).toUpperCase() + x.slice(1) : "—");

/** Mappe une fiche Supabase vers le format attendu par le navigateur de catalogue. */
function toCatItem(l: Listing, catName: Map<string, string>): CatItem {
  return {
    slug: l.slug,
    title: l.title,
    metier: catName.get(l.category_slug) ?? cap(l.category_slug),
    metierSlug: l.category_slug,
    city: l.city,
    rating: l.rating ?? 0,
    avis: l.reviews_count,
    services: (l.description ?? "").replace(/\s+/g, " ").trim().slice(0, 70),
    price: l.price,
    status: l.status,
    delivery: 24,
    image: listingImage(l.category_slug, l.city, l.images?.[0]),
  };
}

const CTA_TRUST_ICONS = [ShieldCheck, Lock, Truck, Headset];

export default async function Catalogue() {
  const t = await getTranslations("catalogue");
  const locale = await getLocale();
  const [listings, categories] = await Promise.all([getListings(), getCategories()]);
  const name = (c: { name_fr: string; name_en: string }) => (locale === "en" ? c.name_en : c.name_fr);
  const catName = new Map(categories.map((c) => [c.slug, name(c)]));
  const items = listings.map((l) => toCatItem(l, catName));
  const cats = categories.map((c) => ({ slug: c.slug, name: name(c), icon: c.icon }));

  // Stats réelles calculées depuis le catalogue Supabase.
  const availableCount = listings.filter((l) => l.status === "available").length;
  const cityCount = new Set(listings.map((l) => l.city)).size;
  const seoScores = listings.map((l) => l.seo_score).filter((n): n is number => n != null);
  const avgSeo = seoScores.length ? Math.round(seoScores.reduce((a, b) => a + b, 0) / seoScores.length) : 0;
  const ratings = listings.map((l) => l.rating).filter((n): n is number => n != null);
  const avgRating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const STATS = [
    { icon: ClipboardList, v: t("stats.fichesValue", { count: availableCount }), l: t("stats.available") },
    { icon: MapPin, v: t("stats.citiesValue", { count: cityCount }), l: t("stats.cities") },
    { icon: ShieldCheck, v: avgSeo ? `${avgSeo}/100` : "—", l: t("stats.seo") },
    { icon: Star, v: avgRating ? `${avgRating.toFixed(1)}/5` : "—", l: t("stats.rating") },
  ];

  const faq = t.raw("faq") as { q: string; a: string }[];
  const trust = (t.raw("trust") as string[]).map((label, i) => ({ icon: CTA_TRUST_ICONS[i], label }));

  return (
    <main id="main">
      {/* ===== EN-TÊTE ===== */}
      <section className="border-b border-border bg-[linear-gradient(180deg,#f7f9ff_0%,#ffffff_100%)] pb-10 pt-[104px]">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h1 className="text-[clamp(1.8rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight">
                {t("title1")}<br /><span className="text-primary">{t("title2")}</span>
              </h1>
              <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">{t("intro")}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-7 gap-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_18px_50px_rgba(11,18,28,0.08)] sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.l} className="flex items-center gap-2.5">
                  <s.icon className="size-7 shrink-0 text-primary" strokeWidth={1.75} />
                  <div>
                    <div className="text-sm font-bold leading-tight">{s.v}</div>
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== NAVIGATEUR (chips + filtres + résultats) ===== */}
      <section className="py-9">
        <div className="mx-auto max-w-[1240px] px-5">
          <CatalogueBrowser items={items} categories={cats} />
        </div>
      </section>

      {/* ===== BANDEAU AIDE ===== */}
      <section className="pb-12">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-accent/30 bg-[linear-gradient(120deg,#fff7ec_0%,#fef2f0_100%)] px-7 py-5 text-center sm:flex-row sm:text-left">
            <img src="/assets/support.png" alt="" className="support-illustration shrink-0 object-contain" />
            <div className="flex-1">
              <h2 className="text-lg font-extrabold">{t("helpTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("helpText")}</p>
            </div>
            <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-sm transition hover:bg-accent/90">
              <Headset className="size-4" /> {t("helpCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-t border-border bg-secondary/40 py-12">
        <div className="mx-auto max-w-[1240px] px-5">
          <h2 className="mb-6 text-xl font-extrabold tracking-tight">{t("faqTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {faq.map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold leading-snug">{f.q}</h3>
                  <Plus className="size-4 shrink-0 text-primary" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-[#0b1f3a] py-12 text-white">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-extrabold leading-tight">{t("ctaTitle")}</h2>
              <p className="mt-2 text-sm text-white/70">{t("ctaText")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/fiches-google" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-primary/90">
                {t("ctaSee")} <ChevronRight className="size-4" />
              </Link>
              <Link href="/fiches-google" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-sm transition hover:bg-accent/90">
                {t("ctaBrowse")}
              </Link>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6">
            {trust.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-2 text-sm text-white/80">
                <c.icon className="size-4 text-accent" strokeWidth={1.9} /> {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
