"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Search, MapPin, Star, LayoutGrid, List, ChevronLeft, ChevronRight, ChevronDown,
  Droplet, Lock, Stethoscope, Building2, UtensilsCrossed, Lightbulb, RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { categoryIcon } from "@/lib/categoryIcons";

/* ---------- Types & données ---------- */
export type ListingStatus = "available" | "reserved" | "sold";
export type CatItem = {
  slug: string;
  title: string;
  metier: string;
  metierSlug: string;
  city: string;
  rating: number;
  avis: number;
  services: string;
  price: number;
  status: ListingStatus;
  delivery: 24 | 48 | 72;
  image?: string;
};

/** Catégorie passée par le serveur (issue de la table Supabase). */
export type BrowserCategory = { slug: string; name: string; icon: string | null };

const METIERS = [
  { slug: "plombier", name: "Plombier", icon: Droplet, color: "blue" },
  { slug: "serrurier", name: "Serrurier", icon: Lock, color: "blue" },
  { slug: "dentiste", name: "Dentiste", icon: Stethoscope, color: "blue" },
  { slug: "immobilier", name: "Immobilier", icon: Building2, color: "blue" },
  { slug: "restaurant", name: "Restaurant", icon: UtensilsCrossed, color: "blue" },
  { slug: "electricien", name: "Électricien", icon: Lightbulb, color: "orange" },
] as const;

const PER_PAGE = 9;

const STATUS_STYLE: Record<ListingStatus, string> = {
  available: "bg-success/12 text-success",
  reserved: "bg-accent/15 text-[#b25e00]",
  sold: "bg-destructive/10 text-destructive",
};
const STATUS_TONE: Record<ListingStatus, "success" | "accent" | "destructive"> = {
  available: "success",
  reserved: "accent",
  sold: "destructive",
};

/* Fiches disposant d'une image dédiée « métier-ville » (sinon repli sur l'image métier). */
const CITY_IMAGES = new Set([
  "plombier-toulouse", "serrurier-bordeaux", "dentiste-nice",
  "immobilier-lille", "restaurant-nantes", "electricien-rennes",
]);
const citySlug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const imgFor = (l: CatItem) => {
  if (l.image) return l.image;
  const key = `${l.metierSlug}-${citySlug(l.city)}`;
  return CITY_IMAGES.has(key) ? `/assets/listings/${key}.png` : `/assets/listings/${l.metierSlug}.png`;
};

const GoogleG = () => (
  <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" /></svg>
);

const Stars = ({ r }: { r: number }) => (
  <span className="inline-flex text-[#fbbc04]">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`size-3.5 ${i < Math.round(r) ? "fill-current" : "fill-transparent text-border"}`} />
    ))}
  </span>
);

/* ---------- Composant ---------- */
export default function CatalogueBrowser({ items, categories }: { items?: CatItem[]; categories?: BrowserCategory[] }) {
  const t = useTranslations("catalogue.browser");
  const data = items ?? [];
  // Métiers : ceux de la base si fournis, sinon repli sur la liste statique.
  const metiers = categories && categories.length
    ? categories.map((c) => ({ slug: c.slug, name: c.name, Icon: categoryIcon(c.icon), accent: false }))
    : METIERS.map((m) => ({ slug: m.slug, name: m.name, Icon: m.icon, accent: m.color === "orange" }));

  const statusLabel = (s: ListingStatus) => t(s);

  // Bornes de prix dérivées des fiches réelles (repli 100/2500 si catalogue vide).
  const prices = data.map((l) => l.price).filter((p) => p > 0);
  const priceMin = prices.length ? Math.floor(Math.min(...prices)) : 100;
  const priceMax = prices.length ? Math.ceil(Math.max(...prices)) : 2500;

  const [metier, setMetier] = useState("");
  const [showAllCats, setShowAllCats] = useState(false);
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [min, setMin] = useState(() => String(priceMin));
  const [max, setMax] = useState(() => String(priceMax));
  const [states, setStates] = useState<Set<ListingStatus>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [deliveries, setDeliveries] = useState<Set<number>>(new Set());
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const cities = useMemo(
    () => Array.from(new Set(data.map((l) => l.city))).sort(),
    [data]
  );
  const countBy = (pred: (l: CatItem) => boolean) => data.filter(pred).length;

  // Pré-remplit les filtres depuis l'URL (recherche / catégorie venant de l'accueil).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const norm = (s: string) =>
      s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

    const cat = sp.get("category");
    if (cat) {
      const n = norm(cat);
      // Cherche dans les catégories réelles (50) plutôt que la liste statique de repli.
      const m = metiers.find((mt) => mt.slug === n || norm(mt.name) === n);
      if (m) setMetier(m.slug);
    }

    const c = sp.get("city");
    if (c) {
      const n = norm(c);
      const match = cities.find((city) => norm(city) === n);
      if (match) setCity(match);
    }

    const mp = sp.get("maxPrice");
    if (mp && Number(mp) > 0) setMax(mp);

    const st = sp.get("state");
    if (st) {
      const statusMap: Record<string, ListingStatus> = {
        disponible: "available",
        reserve: "reserved",
        vendu: "sold",
      };
      const status = statusMap[norm(st)];
      if (status) setStates(new Set([status]));
    }

    const query = sp.get("q");
    if (query) setQ(query);

    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const minN = Number(min) || 0;
    const maxN = Number(max) || Infinity;
    const out = data.filter((l) => {
      if (metier && l.metierSlug !== metier) return false;
      if (city && l.city !== city) return false;
      if (q && !`${l.title} ${l.city} ${l.services}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (l.price < minN || l.price > maxN) return false;
      if (states.size && !states.has(l.status)) return false;
      if (minRating && l.rating < minRating) return false;
      if (deliveries.size && !deliveries.has(l.delivery)) return false;
      return true;
    });
    if (sort === "price_asc") out.sort((a, b) => a.price - b.price);
    else if (sort === "price_desc") out.sort((a, b) => b.price - a.price);
    else if (sort === "rating") out.sort((a, b) => b.rating - a.rating);
    return out;
  }, [data, metier, city, q, min, max, states, minRating, deliveries, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const toggleState = (s: ListingStatus) =>
    setStates((prev) => {
      const n = new Set(prev);
      n.has(s) ? n.delete(s) : n.add(s);
      return n;
    });
  const toggleDelivery = (d: number) =>
    setDeliveries((prev) => {
      const n = new Set(prev);
      n.has(d) ? n.delete(d) : n.add(d);
      return n;
    });
  const reset = () => {
    setMetier(""); setQ(""); setCity(""); setMin(String(priceMin)); setMax(String(priceMax));
    setStates(new Set()); setMinRating(0); setDeliveries(new Set());
    setSort("recent"); setPage(1);
  };

  const StatusBadge = ({ s }: { s: ListingStatus }) => (
    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${STATUS_STYLE[s]}`}>{statusLabel(s)}</span>
  );

  const CardGrid = ({ l }: { l: CatItem }) => (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/fiches-google/${l.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-muted">
        <img src={imgFor(l)} alt={l.title} loading="lazy" className="size-full object-cover" onError={(e) => { const tg = e.currentTarget; if (tg.dataset.fb !== "1") { tg.dataset.fb = "1"; tg.src = "/assets/listings/default.png"; } }} />
        <span className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full bg-white shadow"><GoogleG /></span>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="text-[0.95rem] font-extrabold leading-tight text-foreground">
          <Link href={`/fiches-google/${l.slug}`}>{l.title}</Link>
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">{l.metier}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {l.city}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-bold">{l.rating.toFixed(1)}</span><Stars r={l.rating} /><span className="text-muted-foreground">({t("reviews", { count: l.avis })})</span>
        </div>
        <p className="text-xs text-muted-foreground">{l.services}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-extrabold text-primary">{l.price} €</span>
          <StatusBadge s={l.status} />
        </div>
        <Link href={`/fiches-google/${l.slug}`} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-1.5">
          {t("viewListing")} <ChevronRight className="size-4" />
        </Link>
      </div>
    </article>
  );

  const CardList = ({ l }: { l: CatItem }) => (
    <article className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm transition hover:shadow-lg sm:gap-5">
      <Link href={`/fiches-google/${l.slug}`} className="relative block aspect-[16/10] w-40 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-56">
        <img src={imgFor(l)} alt={l.title} loading="lazy" className="size-full object-cover" onError={(e) => { const tg = e.currentTarget; if (tg.dataset.fb !== "1") { tg.dataset.fb = "1"; tg.src = "/assets/listings/default.png"; } }} />
        <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white shadow"><GoogleG /></span>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 py-1 pr-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-extrabold leading-tight text-foreground">
            <Link href={`/fiches-google/${l.slug}`}>{l.title}</Link>
          </h3>
          <StatusBadge s={l.status} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">{l.metier}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {l.city}</span>
          <span className="inline-flex items-center gap-1"><span className="font-bold text-foreground">{l.rating.toFixed(1)}</span><Stars r={l.rating} />({l.avis})</span>
        </div>
        <p className="text-sm text-muted-foreground">{l.services}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-extrabold text-primary">{l.price} €</span>
          <Button asChild size="sm"><Link href={`/fiches-google/${l.slug}`}>{t("viewListing")} <ChevronRight className="size-4" /></Link></Button>
        </div>
      </div>
    </article>
  );

  return (
    <>
      {/* Chips métiers (repliable au-delà de 11) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(showAllCats ? metiers : metiers.slice(0, 11)).map((m) => {
          const on = metier === m.slug;
          return (
            <button
              key={m.slug}
              type="button"
              onClick={() => { setMetier(on ? "" : m.slug); setPage(1); }}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                on
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <m.Icon className={`size-4 ${m.accent ? "text-accent" : "text-primary"}`} strokeWidth={1.9} />
              {m.name}
            </button>
          );
        })}
        {metiers.length > 11 && (
          <button
            type="button"
            onClick={() => setShowAllCats((v) => !v)}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-primary/10"
          >
            {showAllCats ? t("showLessCats") : t("showAllCats", { count: metiers.length })}
            <ChevronDown className={`size-4 transition-transform ${showAllCats ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      <div className="mt-7 grid items-start gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
        {/* Sidebar filtres */}
        <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-[88px]">
          <h2 className="text-base font-extrabold">{t("refine")}</h2>

          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder={t("searchPlaceholder")}
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <Field label={t("metier")}>
            <select aria-label={t("metier")} value={metier} onChange={(e) => { setMetier(e.target.value); setPage(1); }} className="cat-select">
              <option value="">{t("allMetiers")}</option>
              {metiers.map((m) => <option key={m.slug} value={m.slug}>{m.name}</option>)}
            </select>
          </Field>

          <Field label={t("ville")}>
            <select aria-label={t("ville")} value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }} className="cat-select">
              <option value="">{t("allVilles")}</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label={t("budget")}>
            <input
              type="range" aria-label={t("budget")} min={priceMin} max={priceMax} step={10} value={Number(max)}
              onChange={(e) => { setMax(e.target.value); setPage(1); }}
              className="w-full accent-[#1a73e8]"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-xs text-muted-foreground">
                {t("min")}
                <input type="number" value={min} onChange={(e) => { setMin(e.target.value); setPage(1); }} className="h-9 w-full min-w-0 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                {t("max")}
                <input type="number" value={max} onChange={(e) => { setMax(e.target.value); setPage(1); }} className="h-9 w-full min-w-0 rounded-lg border border-border bg-background px-2.5 text-sm text-foreground outline-none focus:border-primary" />
              </label>
            </div>
          </Field>

          <Field label={t("etat")}>
            {(["available", "reserved", "sold"] as const).map((s) => (
              <CheckRow
                key={s} label={statusLabel(s)} checked={states.has(s)} onChange={() => { toggleState(s); setPage(1); }}
                count={countBy((l) => l.status === s)}
                tone={STATUS_TONE[s]}
              />
            ))}
          </Field>

          <Field label={t("minRating")}>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n} type="button"
                  onClick={() => { setMinRating(minRating === n ? 0 : n); setPage(1); }}
                  className={`inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    minRating === n ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground/70 hover:border-primary/40"
                  }`}
                >
                  <Star className="size-3.5 fill-[#fbbc04] text-[#fbbc04]" /> {t("ratingOption", { n })}
                </button>
              ))}
            </div>
          </Field>

          <Field label={t("delivery")}>
            {[24, 48, 72].map((d) => (
              <CheckRow
                key={d} label={t("deliveryOption", { d })} checked={deliveries.has(d)} onChange={() => { toggleDelivery(d); setPage(1); }}
                count={countBy((l) => l.delivery === d)} tone="muted"
              />
            ))}
          </Field>

          <Button type="button" className="mt-5 w-full" onClick={() => setPage(1)}>{t("apply")}</Button>
          <Button type="button" variant="outline" className="mt-2 w-full" onClick={reset}>
            <RotateCcw className="size-4" /> {t("reset")}
          </Button>
        </aside>

        {/* Résultats */}
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">
              <span className="text-primary">{filtered.length}</span> {t("found", { count: filtered.length })}
            </p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                {t("sortBy")}
                <select aria-label={t("sortBy")} value={sort} onChange={(e) => setSort(e.target.value)} className="cat-select !h-9 !w-auto !min-w-[150px]">
                  <option value="recent">{t("sortRecent")}</option>
                  <option value="price_asc">{t("sortPriceAsc")}</option>
                  <option value="price_desc">{t("sortPriceDesc")}</option>
                  <option value="rating">{t("sortRating")}</option>
                </select>
              </label>
              <div className="flex overflow-hidden rounded-lg border border-border">
                <button type="button" aria-label={t("gridView")} onClick={() => setView("grid")} className={`flex size-9 items-center justify-center ${view === "grid" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-secondary"}`}>
                  <LayoutGrid className="size-4" />
                </button>
                <button type="button" aria-label={t("listView")} onClick={() => setView("list")} className={`flex size-9 items-center justify-center border-l border-border ${view === "list" ? "bg-primary text-white" : "bg-card text-muted-foreground hover:bg-secondary"}`}>
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-14 text-center text-muted-foreground">
              {t("empty")}{" "}
              <button type="button" onClick={reset} className="font-semibold text-primary hover:underline">{t("resetFilters")}</button>
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((l) => <CardGrid key={l.slug} l={l} />)}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {shown.map((l) => <CardList key={l.slug} l={l} />)}
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Pagination">
              <button type="button" disabled={current === 1} onClick={() => setPage(current - 1)} className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold text-foreground/70 disabled:opacity-40 hover:enabled:border-primary/40">
                <ChevronLeft className="size-4" /> {t("prev")}
              </button>
              {Array.from({ length: pages }).map((_, i) => (
                <button key={i} type="button" onClick={() => setPage(i + 1)} className={`size-9 rounded-lg text-sm font-semibold transition ${current === i + 1 ? "bg-primary text-white" : "border border-border text-foreground/70 hover:border-primary/40"}`}>
                  {i + 1}
                </button>
              ))}
              <button type="button" disabled={current === pages} onClick={() => setPage(current + 1)} className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm font-semibold text-foreground/70 disabled:opacity-40 hover:enabled:border-primary/40">
                {t("next")} <ChevronRight className="size-4" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- Sous-composants ---------- */
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mt-5">
    <div className="mb-2 text-sm font-bold text-foreground">{label}</div>
    {children}
  </div>
);

const CheckRow = ({ label, checked, onChange, count, tone }: {
  label: string; checked: boolean; onChange: () => void; count: number;
  tone: "success" | "accent" | "destructive" | "muted";
}) => {
  const badge = {
    success: "bg-success/12 text-success",
    accent: "bg-accent/15 text-[#b25e00]",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-secondary text-muted-foreground",
  }[tone];
  return (
    <label className="flex cursor-pointer items-center justify-between py-1.5 text-sm">
      <span className="flex items-center gap-2.5">
        <input type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded border-border accent-[#1a73e8]" />
        {label}
      </span>
      <span className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${badge}`}>{count}</span>
    </label>
  );
};
