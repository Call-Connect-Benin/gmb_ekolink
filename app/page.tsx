/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  Search, ChevronRight, ChevronDown, MapPin, Star, CheckCircle2, Lock, TrendingUp,
  Truck, Headset, PackageCheck, ShieldCheck, Timer, Check, ArrowRight, Settings,
  Briefcase, Wallet, Flag,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import Reveal from "./components/Reveal";
import Faq from "./components/Faq";
import TestimonialsCard from "./components/TestimonialsCard";
import { Button } from "@/components/ui/button";
import { getCategories, getListings } from "@/lib/queries";
import { categoryIcon } from "@/lib/categoryIcons";
import { listingImage } from "@/lib/listingImage";
import type { Listing } from "@/lib/types";

export const dynamic = "force-dynamic";

const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[1240px] px-5 ${className}`}>{children}</div>
);

const Stars = ({ n = 5 }: { n?: number }) => (
  <span className="inline-flex text-[#fbbc04]">{Array.from({ length: n }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}</span>
);

const STATUS_STYLE: Record<Listing["status"], string> = {
  available: "bg-success/12 text-success",
  reserved: "bg-accent/15 text-[#b25e00]",
  sold: "bg-destructive/10 text-destructive",
};
const StatusBadge = ({ status, label }: { status: Listing["status"]; label: string }) => (
  <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${STATUS_STYLE[status]}`}>{label}</span>
);

const GoogleG = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" /></svg>
);

/** Couleur d'icône : bleu par défaut, orange en accent (icônes outline, sans fond). */
const ICON: Record<string, string> = {
  blue: "text-[#1a73e8]",
  orange: "text-[#f89f1b]",
};

const RES_META = [
  { slug: "pack-local-30-jours", img: "cover-pack-local" },
  { slug: "photos-google-business", img: "cover-photos-gmb" },
  { slug: "cas-boulangerie-340-appels", img: "cover-cas-boulangerie" },
];

const cap = (x: string) => (x ? x.charAt(0).toUpperCase() + x.slice(1) : "—");

export default async function Home() {
  const t = await getTranslations("home");
  const locale = await getLocale();
  const [listings, categories] = await Promise.all([getListings(), getCategories()]);
  const catLabel = (slug: string) => {
    const c = categories.find((x) => x.slug === slug);
    return c ? (locale === "en" ? c.name_en : c.name_fr) : cap(slug);
  };

  // Catégories populaires (depuis la base) : top 12 par nombre de fiches.
  const cats = categories
    .map((c) => ({
      Icon: categoryIcon(c.icon),
      name: locale === "en" ? c.name_en : c.name_fr,
      slug: c.slug,
      count: listings.filter((l) => l.category_slug === c.slug).length,
      accent: false,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 6);

  // Fiches mises en avant : uniquement les fiches DISPONIBLES.
  const available = listings.filter((l) => l.status === "available");
  const fiches = available.slice(0, 6).map((l) => ({
    slug: l.slug,
    title: l.title,
    cat: catLabel(l.category_slug),
    city: l.city,
    rating: (l.rating ?? 0).toFixed(1),
    avis: l.reviews_count,
    price: l.price,
    status: l.status,
    statusLabel: t(`status.${l.status}`),
    image: listingImage(l.category_slug, l.city, l.images?.[0]),
  }));

  // Statistiques vitrine — calculées depuis la base (aucune valeur fictive).
  const totalFiches = listings.length;
  const villes = new Set(listings.map((l) => l.city)).size;
  const totalReviews = listings.reduce((s, l) => s + (l.reviews_count || 0), 0);
  const rated = listings.map((l) => l.rating).filter((n): n is number => n != null);
  const avgRating = rated.length ? (rated.reduce((a, b) => a + b, 0) / rated.length).toFixed(1) : null;

  const TRUST = [
    { icon: Lock, color: "blue", h: t("trust.secureH"), p: t("trust.secureP") },
    { icon: TrendingUp, color: "orange", h: t("trust.seoH"), p: t("trust.seoP") },
    { icon: Truck, color: "blue", h: t("trust.deliveryH"), p: t("trust.deliveryP") },
    { icon: Headset, color: "orange", h: t("trust.supportH"), p: t("trust.supportP") },
  ];

  const SEARCH = [
    { name: "category", label: t("search.metier"), Icon: Briefcase, all: t("search.allMetiers"), opts: categories.map((c) => ({ v: c.slug, l: locale === "en" ? c.name_en : c.name_fr })) },
    { name: "city", label: t("search.ville"), Icon: MapPin, all: t("search.allVilles"), opts: ["Toulouse", "Bordeaux", "Nice", "Lille", "Nantes", "Rennes"].map((c) => ({ v: c, l: c })) },
    { name: "maxPrice", label: t("search.budget"), Icon: Wallet, all: t("search.budgetMax"), opts: ["200", "300", "400", "600"].map((p) => ({ v: p, l: p })) },
    { name: "state", label: t("search.etat"), Icon: Flag, all: t("search.allEtats"), opts: [{ v: "disponible", l: t("search.sDisponible") }, { v: "réservé", l: t("search.sReserve") }, { v: "vendu", l: t("search.sVendu") }] },
  ];

  const STEPS = [
    { img: "/assets/steps/choisir.png", h: t("how.step1H"), p: t("how.step1P") },
    { img: "/assets/steps/payer.png", h: t("how.step2H"), p: t("how.step2P") },
    { img: "/assets/steps/recevoir.png", h: t("how.step3H"), p: t("how.step3P") },
  ];

  const STATS = [
    { icon: PackageCheck, v: String(totalFiches), l: t("stats.online") },
    { icon: MapPin, v: String(villes), l: t("stats.cities") },
    { icon: Briefcase, v: String(categories.length), l: t("stats.categories") },
    { icon: Star, v: avgRating ? `${avgRating}/5` : "—", l: t("stats.rating") },
    { icon: CheckCircle2, v: String(totalReviews), l: t("stats.reviews") },
    { icon: Timer, v: "24h", l: t("stats.delivery") },
  ];

  const WHY = [
    { icon: PackageCheck, color: "orange", h: t("why.readyH"), p: t("why.readyP") },
    { icon: TrendingUp, color: "blue", h: t("why.seoH"), p: t("why.seoP") },
    { icon: ShieldCheck, color: "orange", h: t("why.secureH"), p: t("why.secureP") },
    { icon: Headset, color: "blue", h: t("why.humanH"), p: t("why.humanP") },
  ];

  const GUARANTEES = [
    { icon: ShieldCheck, color: "blue", h: t("guarantees.transferH"), items: t.raw("guarantees.transferItems") as string[] },
    { icon: Settings, color: "orange", h: t("guarantees.dataH"), items: t.raw("guarantees.dataItems") as string[] },
    { icon: Headset, color: "blue", h: t("guarantees.supportH"), items: t.raw("guarantees.supportItems") as string[] },
    { icon: Timer, color: "orange", h: t("guarantees.deliveryH"), items: t.raw("guarantees.deliveryItems") as string[] },
  ];

  const partnerBullets = t.raw("partner.bullets") as string[];
  const ctaChips = t.raw("cta.chips") as string[];
  const faqItems = (t.raw("faq") as { q: string; a: string }[]).map((it) => ({ q: it.q, a: <p>{it.a}</p> }));
  const resources = (t.raw("resources.items") as { tag: string; title: string }[]).map((it, i) => ({ ...it, ...RES_META[i] }));

  return (
    <main id="main">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f4f8ff_100%)] pb-8 pt-20">
        <Container className="grid min-h-[80vh] items-center gap-8 lg:grid-cols-2">
          <Reveal>
            <h1 className="text-[clamp(2.2rem,4.4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight">
              {t("hero.title")} <span className="text-primary">{t("hero.titleAccent")}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">{t("hero.lead")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link href="/fiches-google">{t("hero.ctaSee")} <ChevronRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="accent"><Link href="/fiches-google">{t("hero.ctaBrowse")}</Link></Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-foreground/80">
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><CheckCircle2 className="size-4 text-success" strokeWidth={1.75} /> {t("hero.badgeReal")}</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><TrendingUp className="size-4 text-primary" strokeWidth={1.75} /> {t("hero.badgeSeo")}</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Timer className="size-4 text-accent" strokeWidth={1.75} /> {t("hero.badgeFast")}</span>
              <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Headset className="size-4 text-primary" strokeWidth={1.75} /> {t("hero.badgeSupport")}</span>
            </div>
          </Reveal>

          {/* Cartes GBP flottantes */}
          <Reveal delay={120} className="relative">
            <div className="relative flex items-center justify-center">
              <img src="/assets/hero/serrurier-lyon.png" alt="Fiche Google Business — Serrurier Lyon" className="z-10 w-[210px] -mr-6 translate-y-6 max-[1180px]:hidden" />
              <img src="/assets/hero/plombier-paris.png" alt="Fiche Google Business — Plombier Paris" className="z-20 w-[230px]" />
              <img src="/assets/hero/dentiste-marseille.png" alt="Fiche Google Business — Dentiste Marseille" className="z-10 w-[210px] -ml-6 translate-y-6 max-[1180px]:hidden" />
            </div>
          </Reveal>
        </Container>

        {/* Barre de confiance */}
        <Container>
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-2xl border border-border bg-white p-6 shadow-[0_18px_50px_rgba(11,18,28,0.08)] md:grid-cols-3 lg:grid-cols-5">
            {TRUST.map((tr) => (
              <div key={tr.h} className="flex items-center gap-3">
                <tr.icon className={`size-7 shrink-0 ${ICON[tr.color]}`} strokeWidth={1.75} />
                <div><div className="text-sm font-bold leading-tight">{tr.h}</div><div className="text-xs text-muted-foreground">{tr.p}</div></div>
              </div>
            ))}
            <div className="flex flex-col justify-center">
              <div className="text-sm font-bold leading-tight">{t("trust.available", { count: available.length })}</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Stars /> {t("trust.reviews", { rating: avgRating ?? "—", count: totalReviews })}</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== RECHERCHE ===== */}
      <section className="py-12">
        <Container>
          <form action="/fiches-google" method="get" className="grid items-end gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto]">
            {SEARCH.map((f) => (
              <div key={f.name} className="flex flex-col gap-1.5">
                <label htmlFor={`f-${f.name}`} className="text-sm font-semibold">{f.label}</label>
                <div className="relative">
                  <f.Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <select id={`f-${f.name}`} name={f.name} defaultValue="" className="h-11 w-full appearance-none rounded-xl border border-input bg-white pl-9 pr-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40">
                    <option value="">{f.all}</option>
                    {f.opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            ))}
            <Button type="submit" size="lg" className="h-11 rounded-xl"><Search className="size-4" /> {t("search.button")}</Button>
          </form>
        </Container>
      </section>

      {/* ===== CATÉGORIES POPULAIRES ===== */}
      <section className="py-12">
        <Container>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight">{t("categories.title")}</h2>
            <Link href="/fiches-google" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">{t("categories.all")} <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {cats.map((c) => (
              <Link key={c.slug} href={`/fiches-google?category=${c.slug}`} className="group rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                <c.Icon className={`mx-auto mb-3 size-8 ${c.accent ? ICON.orange : ICON.blue}`} strokeWidth={1.75} />
                <div className="text-sm font-bold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{t("categories.count", { count: c.count })}</div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== FICHES DISPONIBLES ===== */}
      <section className="pb-12">
        <Container>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight">{t("listings.title")}</h2>
            <Link href="/fiches-google" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">{t("listings.all")} <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {fiches.map((l, i) => (
              <Link key={l.slug ?? `${l.title}-${i}`} href={l.slug ? `/fiches-google/${l.slug}` : "/fiches-google"} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img src={l.image ?? "/assets/listings/default.png"} alt="" loading="lazy" className="size-full object-cover" />
                  <span className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-white shadow"><GoogleG /></span>
                </div>
                <div className="flex flex-1 flex-col gap-1 p-3.5">
                  <h3 className="text-sm font-extrabold leading-tight text-foreground">{l.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">{l.cat}</span> <MapPin className="size-3" /> {l.city}</div>
                  <div className="flex items-center gap-1 text-xs"><span className="font-bold">{l.rating}</span><Stars /><span className="text-muted-foreground">({l.avis})</span></div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="font-extrabold text-primary">{l.price} €</span>
                    <StatusBadge status={l.status} label={l.statusLabel} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="bg-[#f7f4ef] py-14">
        <Container>
          <h2 className="mb-6 text-center text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-tight">{t("how.title")}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.h} delay={i * 80} className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_8px_30px_rgba(11,18,28,0.05)]">
                <div className="relative shrink-0 self-center">
                  <img src={s.img} alt="" className="size-14 object-contain" />
                  <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white ring-4 ring-white">{i + 1}</span>
                </div>
                <div><h3 className="font-extrabold">{s.h}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.p}</p></div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm md:grid-cols-3 lg:grid-cols-6">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col items-center gap-1 text-center">
                <s.icon className="size-6 text-primary" />
                <div className="text-lg font-extrabold leading-none">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== POURQUOI CHOISIR ===== */}
      <section className="py-12">
        <Container>
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight">{t("why.title")}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal as="article" key={w.h} delay={i * 70} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <w.icon className={`mb-4 size-9 ${ICON[w.color]}`} strokeWidth={1.75} />
                <h3 className="font-bold">{w.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.p}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== NOS GARANTIES ===== */}
      <section className="py-12">
        <Container>
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight">{t("guarantees.title")}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map((g, i) => (
              <Reveal as="article" key={g.h} delay={i * 70} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <g.icon className={`size-7 shrink-0 ${ICON[g.color]}`} strokeWidth={1.75} />
                  <h3 className="font-bold">{g.h}</h3>
                </div>
                <ul className="flex flex-col gap-2 text-sm">
                  {g.items.map((it) => <li key={it} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-success" /> <span className="text-muted-foreground">{it}</span></li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== BANDEAU PARTENAIRE ===== */}
      <section className="py-12">
        <Container>
          <div className="grid items-center gap-8 rounded-3xl border border-primary/15 bg-[linear-gradient(135deg,#eef4ff,#fff7ed)] p-8 lg:grid-cols-[1.1fr_1fr] lg:p-12">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">{t("partner.title")}</h2>
              <p className="mt-2 text-muted-foreground">{t("partner.text")}</p>
              <ul className="mt-5 grid gap-2.5 text-sm sm:grid-cols-2">
                {partnerBullets.map((b) => (
                  <li key={b} className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-primary text-white"><Check className="size-3" /></span> {b}</li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-6"><Link href="/contact">{t("partner.cta")}</Link></Button>
            </div>
            <div className="flex min-w-0 items-center gap-5">
              <img src="/assets/partner.png" alt="Tableau de bord partenaire EkoLink" className="min-w-0 flex-1 drop-shadow-xl" />
              <div className="hidden w-28 shrink-0 flex-col gap-3.5 lg:flex">
                <div><div className="text-base font-extrabold leading-tight text-primary">{totalFiches}</div><div className="text-xs text-muted-foreground">{t("stats.online")}</div></div>
                <div><div className="text-base font-extrabold leading-tight text-primary">{villes}</div><div className="text-xs text-muted-foreground">{t("stats.cities")}</div></div>
                <div><div className="text-base font-extrabold leading-tight text-primary">24h</div><div className="text-xs text-muted-foreground">{t("stats.delivery")}</div></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== FAQ + TÉMOIGNAGE ===== */}
      <section id="faq" className="py-12">
        <Container>
          <h2 className="mb-6 text-2xl font-extrabold tracking-tight">{t("faqTitle")}</h2>
          <div className="grid items-stretch gap-8 lg:grid-cols-[1.4fr_1fr]">
            <Faq items={faqItems} />
            <TestimonialsCard />
          </div>
        </Container>
      </section>

      {/* ===== RESSOURCES ===== */}
      <section className="py-12">
        <Container>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold tracking-tight">{t("resources.title")}</h2>
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">{t("resources.all")} <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {resources.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-[16/9] overflow-hidden bg-muted"><img src={`/assets/images/${r.img}.png`} alt="" loading="lazy" className="size-full object-cover" /></div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span className="w-fit rounded bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary">{r.tag}</span>
                  <h3 className="font-bold leading-snug">{r.title}</h3>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">{t("resources.read")} <ArrowRight className="size-4" /></span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#0b1119,#102a52)] py-14 text-white">
        <div className="absolute -left-20 bottom-0 size-72 rounded-full bg-primary/20 blur-3xl" />
        <Container>
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-extrabold leading-tight">{t("cta.title")}</h2>
              <p className="mt-3 text-white/70">{t("cta.text")}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white/80 lg:justify-start">
                {ctaChips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5"><Check className="size-4 text-success" /> {c}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg"><Link href="/fiches-google">{t("hero.ctaSee")} <ChevronRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="accent"><Link href="/fiches-google">{t("hero.ctaBrowse")}</Link></Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
