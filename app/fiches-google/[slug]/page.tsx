/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Check, Star, MapPin, MessageSquare, Lock, Headphones, ShieldCheck,
  CheckCircle2, Wrench, Camera, Link2, TrendingUp, KeyRound, BookOpen, Pencil, PackageCheck,
  Settings, FileText, Target, Truck, ChevronDown, ArrowRight, ShoppingCart,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import BuyButton from "../../components/BuyButton";
import { getListingBySlug, getCategories } from "@/lib/queries";
import { listingImage } from "@/lib/listingImage";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

const cap = (x: string) => (x ? x.charAt(0).toUpperCase() + x.slice(1) : "—");

const STATUS_TONE: Record<Listing["status"], string> = {
  available: "bg-success/12 text-success",
  reserved: "bg-accent/15 text-[#b25e00]",
  sold: "bg-destructive/10 text-destructive",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const real = await getListingBySlug(slug);
  const title = real ? `${real.title} — ${real.price} €` : cap(slug.replace(/-/g, " "));
  return { title };
}

const INCLUDED_ICONS = [KeyRound, BookOpen, Pencil, Headphones, PackageCheck, Settings];
const GUARANTEE_ICONS = [ShieldCheck, CheckCircle2, Headphones, Truck];

export default async function FicheDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTranslations("fiche");
  const locale = await getLocale();
  const [real, categories] = await Promise.all([getListingBySlug(slug), getCategories()]);

  const catName = (s: string) => {
    const c = categories.find((x) => x.slug === s);
    return c ? (locale === "en" ? c.name_en : c.name_fr) : cap(s);
  };

  const f = real
    ? {
        title: real.title,
        metier: catName(real.category_slug),
        city: real.city,
        price: real.price,
        rating: (real.rating ?? 0).toFixed(1),
        ratingNum: real.rating ?? 0,
        avis: real.reviews_count,
        status: real.status,
        img: listingImage(real.category_slug, real.city, real.images?.[0]),
        seo: real.seo_score,
        photos: real.photos_count,
        categoriesCount: real.categories_count ?? 3,
        citations: real.local_citations ?? 0,
        visibility: real.visibility ?? "high",
        description: real.description ?? "",
      }
    : {
        title: cap(slug.replace(/-/g, " ")),
        metier: t("genericTrade"),
        city: "France",
        price: 199,
        rating: "—",
        ratingNum: 0,
        avis: 0,
        status: "available" as Listing["status"],
        img: "/assets/listings/default.png",
        seo: null as number | null,
        photos: 0,
        categoriesCount: 0,
        citations: 0,
        visibility: "high" as Listing["visibility"],
        description: "",
      };

  const metierLower = f.metier.toLowerCase();
  const statusLabel = (s: Listing["status"]) => t(`status.${s}`);
  const clampPct = (n: number) => Math.max(6, Math.min(100, Math.round(n)));
  const visPct = { low: 30, medium: 60, high: 90 }[f.visibility];

  const SEO = [
    { icon: Star, t: t("seo.rating"), v: `${f.rating}/5`, pct: clampPct((f.ratingNum / 5) * 100) },
    { icon: MessageSquare, t: t("seo.reviews"), v: `${f.avis}`, pct: clampPct((f.avis / 50) * 100) },
    { icon: Target, t: t("seo.optimisation"), v: f.seo ? `${f.seo}%` : "—", pct: clampPct(f.seo ?? 0) },
    { icon: MapPin, t: t("seo.coverage"), v: f.city, pct: f.city ? 100 : 6 },
    { icon: CheckCircle2, t: t("seo.categories"), v: `${f.categoriesCount}`, pct: clampPct((f.categoriesCount / 8) * 100) },
    { icon: Camera, t: t("seo.photos"), v: `${f.photos}`, pct: clampPct((f.photos / 30) * 100) },
    { icon: Link2, t: t("seo.citations"), v: `${f.citations}`, pct: clampPct((f.citations / 30) * 100) },
    { icon: TrendingUp, t: t("seo.potential"), v: t(`seo.vis${f.visibility === "low" ? "Low" : f.visibility === "medium" ? "Medium" : "High"}`), pct: visPct },
  ];
  const QUICK = [
    { icon: Wrench, t: t("quick.metier"), v: f.metier },
    { icon: MapPin, t: t("quick.ville"), v: f.city },
    { icon: CheckCircle2, t: t("quick.etat"), v: statusLabel(f.status), ok: f.status === "available" },
    { icon: Truck, t: t("quick.delivery"), v: t("quick.deliveryVal") },
    { icon: Target, t: t("quick.optimisation"), v: t("quick.optimisationVal"), ok: true },
    { icon: KeyRound, t: t("quick.claim"), v: t("quick.claimVal"), ok: true },
  ];

  const galleryImgs = real?.gallery?.length ? real.gallery : [];
  const mainImg = galleryImgs[0]?.url || f.img;
  const thumbList = galleryImgs.length
    ? galleryImgs
    : (t.raw("thumbs") as string[]).map((title) => ({ url: f.img, title }));
  const cardBullets = t.raw("cardBullets") as string[];
  const included = (t.raw("included") as { t: string; d: string }[]).map((x, i) => ({ ...x, icon: INCLUDED_ICONS[i] }));
  const guarantees = (t.raw("guarantees") as { t: string; items: string[] }[]).map((x, i) => ({ ...x, icon: GUARANTEE_ICONS[i] }));
  const faq = t.raw("faq") as { q: string; a: string }[];
  const ctaTrustIcons = [Lock, CheckCircle2, Truck, ShieldCheck];
  const ctaTrust = (t.raw("ctaTrust") as string[]).map((label, i) => ({ icon: ctaTrustIcons[i], label }));

  return (
    <main id="main" className="bg-white">
      <div className="mx-auto max-w-[1180px] px-5 pt-24">
        <nav className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><Link href="/" className="hover:text-primary">{t("breadcrumbHome")}</Link><span className="opacity-50">/</span><Link href="/fiches-google" className="hover:text-primary">{t("breadcrumbCatalogue")}</Link><span className="opacity-50">/</span><span className="font-medium text-foreground">{f.title}</span></nav>

        {/* HERO */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div>
            <h1 className="text-[clamp(1.7rem,3.4vw,2.5rem)] font-extrabold tracking-tight">{t("h1")}<br /><span className="text-primary">{f.title}</span></h1>
            <p className="mt-3 max-w-lg text-muted-foreground">{t("lead", { metier: metierLower, city: f.city })}</p>
            <h2 className="mb-3 mt-7 font-bold">{t("screenshots")}</h2>
            <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
              <img src={mainImg} alt={f.title} className="aspect-[16/10] w-full object-cover" />
            </div>
            {thumbList.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {thumbList.map((g, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-border"><img src={g.url} alt={g.title} className="aspect-[4/3] w-full object-cover" />{g.title && <p className="px-2 py-1.5 text-center text-[10px] text-muted-foreground">{g.title}</p>}</div>
                ))}
              </div>
            )}
          </div>

          {/* Purchase card */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3"><span className="text-3xl font-extrabold text-primary">{f.price} €</span><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_TONE[f.status]}`}>{statusLabel(f.status)}</span></div>
              <div className="mt-2 flex flex-wrap items-center gap-2 border-b border-border pb-3 text-sm"><span className="font-bold">{f.rating}</span><span className="inline-flex text-[#fbbc04]">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}</span><span className="text-muted-foreground">{t("reviews", { count: f.avis })}</span><span className="ml-auto inline-flex items-center gap-1 text-muted-foreground"><MapPin className="size-3.5" /> {f.city}</span><span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{f.metier}</span></div>
              <ul className="my-3 space-y-2 text-sm">{cardBullets.map((i) => <li key={i} className="flex items-center gap-2"><Check className="size-4 text-success" /> {i}</li>)}</ul>
              {real ? (
                <BuyButton listingId={real.id} slug={slug} label={t("buyNow")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-70" />
              ) : (
                <Link href={`/connexion?next=/fiches-google/${slug}`} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90"><ShoppingCart className="size-4" /> {t("buyNow")}</Link>
              )}
              <a href="https://wa.me/33644678642" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-accent-foreground hover:bg-accent/90"><MessageSquare className="size-4" /> {t("contactExpert")}</a>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1"><Lock className="size-3.5" /> {t("securePay")}</span><span className="inline-flex items-center gap-1"><Headphones className="size-3.5" /> {t("dedicatedSupport")}</span><span className="inline-flex items-center gap-1"><ShieldCheck className="size-3.5" /> {t("guaranteedTransfer")}</span></div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 font-bold">{t("quickTitle")}</h3>
              <ul className="space-y-2.5 text-sm">
                {QUICK.map((q) => <li key={q.t} className="flex items-center gap-2.5"><q.icon className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{q.t}</span><span className={`ml-auto font-semibold ${q.ok ? "text-success" : ""}`}>{q.v}</span></li>)}
              </ul>
              <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-sm font-semibold text-primary"><CheckCircle2 className="size-4" /> {t("verified")}</p>
            </div>
          </aside>
        </div>

        {/* SEO */}
        <section className="py-8">
          <h2 className="mb-5 text-xl font-extrabold">{t("seoTitle")}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {SEO.map((s) => (
              <div key={s.t} className="rounded-2xl border border-border bg-card p-4 shadow-sm"><div className="flex items-center gap-2 text-sm text-muted-foreground"><s.icon className="size-4 text-primary" /> {s.t}</div><p className="mt-2 text-xl font-extrabold">{s.v}</p><div className="mt-2 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${s.pct}%` }} /></div></div>
            ))}
          </div>
        </section>

        {/* Inclus */}
        <section className="pb-8">
          <h2 className="mb-5 text-xl font-extrabold">{t("includedTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((i) => (
              <div key={i.t} className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm"><span className="mx-auto mb-2 flex size-11 items-center justify-center rounded-xl bg-primary/10"><i.icon className="size-5 text-primary" /></span><h3 className="text-sm font-bold">{i.t}</h3><p className="mt-1 text-xs text-muted-foreground">{i.d}</p></div>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="pb-8">
          <h2 className="mb-5 text-xl font-extrabold">{t("descTitle")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10"><FileText className="size-5 text-primary" /></span><div><h3 className="font-bold">{t("desc1H")}</h3><p className="mt-1 text-sm text-muted-foreground">{f.description || t("desc1P", { metier: metierLower, city: f.city })}</p></div></div>
            <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/15"><Target className="size-5 text-[#d97706]" /></span><div><h3 className="font-bold">{t("desc2H")}</h3><p className="mt-1 text-sm text-muted-foreground">{t("desc2P")}</p></div></div>
          </div>
        </section>

        {/* Garanties */}
        <section className="pb-8">
          <h2 className="mb-5 text-xl font-extrabold">{t("guaranteesTitle")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g) => (
              <div key={g.t} className="rounded-2xl border border-border bg-card p-5 shadow-sm"><span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-success/12"><g.icon className="size-5 text-success" /></span><h3 className="font-bold">{g.t}</h3><ul className="mt-2 space-y-1.5">{g.items.map((it) => <li key={it} className="flex items-start gap-1.5 text-xs text-muted-foreground"><Check className="mt-0.5 size-3.5 shrink-0 text-success" /> {it}</li>)}</ul></div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-8">
          <h2 className="mb-5 text-xl font-extrabold">{t("faqTitle")}</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {faq.map((q) => (
              <details key={q.q} className="group rounded-2xl border border-border bg-card px-5 shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 py-4 text-sm font-semibold marker:hidden">{q.q}<ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" /></summary><p className="pb-4 text-sm text-muted-foreground">{q.a}</p></details>
            ))}
          </div>
        </section>
      </div>

      {/* CTA */}
      <section className="bg-[linear-gradient(135deg,#0a1a33,#0b2a52)] py-12 text-white">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div><h2 className="text-2xl font-extrabold">{t("ctaTitle")}</h2><p className="mt-1 text-sm text-white/70">{t("ctaText", { city: f.city })}</p></div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/connexion?next=/fiches-google/${slug}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90"><ShoppingCart className="size-4" /> {t("buyNow")}</Link>
              <Link href="/fiches-google" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-foreground hover:bg-accent/90">{t("ctaOther")} <ArrowRight className="size-4" /></Link>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/80">
            {ctaTrust.map((c) => (
              <span key={c.label} className="inline-flex items-center gap-2"><c.icon className="size-4 text-accent" /> {c.label}</span>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
