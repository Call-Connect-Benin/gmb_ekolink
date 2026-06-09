/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Users, Star, ShieldCheck, Zap, Handshake, Heart, ShoppingCart, ArrowRight } from "lucide-react";
import { getListings } from "@/lib/queries";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "À propos",
  description: "EkoLink, la référence des fiches Google Business optimisées. Notre mission : booster la visibilité locale des professionnels.",
  alternates: { canonical: "/a-propos" },
};

const VALUE_META = [
  { icon: ShieldCheck, box: "bg-primary/10 text-primary" },
  { icon: Zap, box: "bg-accent/15 text-[#d97706]" },
  { icon: Handshake, box: "bg-success/12 text-success" },
  { icon: Heart, box: "bg-[#7c3aed]/10 text-[#7c3aed]" },
];
const STORY_YEARS = ["2021", "2022", "2023", "2024"];

export default async function APropos() {
  const listings = await getListings();
  const totalFiches = listings.length;
  const rated = listings.map((l) => l.rating).filter((n): n is number => n != null);
  const avgRating = rated.length ? (rated.reduce((a, b) => a + b, 0) / rated.length).toFixed(1) : null;

  const t = await getTranslations("about");
  const values = (t.raw("values") as { title: string; desc: string }[]).map((v, i) => ({ ...v, ...VALUE_META[i] }));
  const story = (t.raw("story") as { title: string; desc: string }[]).map((s, i) => ({ ...s, year: STORY_YEARS[i] }));

  return (
    <main id="main">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0a1a33,#0b2a52)] pb-16 pt-28 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, #fff 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-5 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">{t("badge")}</p>
            <h1 className="mt-3 text-[clamp(2rem,4vw,2.9rem)] font-extrabold leading-tight">{t("h1a")}<span className="text-accent">{t("h1accent")}</span>{t("h1b")}</h1>
            <p className="mt-4 max-w-md text-white/70">{t("lead")}</p>
            <div className="mt-7 flex flex-wrap gap-8">
              <div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-full bg-white/10"><Users className="size-6 text-accent" /></span><div><p className="text-2xl font-extrabold">{totalFiches}</p><p className="text-sm text-white/60">{t("statFiches")}</p></div></div>
              {avgRating && <div className="flex items-center gap-3"><span className="flex size-12 items-center justify-center rounded-full bg-white/10"><Star className="size-6 fill-accent text-accent" /></span><div><p className="text-2xl font-extrabold">{avgRating}/5</p><p className="text-sm text-white/60">{t("statRating")}</p></div></div>}
            </div>
          </div>
          <div className="flex justify-center"><img src="/assets/icons/mark.png" alt="" className="w-64 drop-shadow-2xl lg:w-80" /></div>
        </div>
        <svg className="absolute -bottom-px left-0 w-full" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none"><path d="M0 80V40C240 70 480 80 720 70C960 60 1200 30 1440 40V80H0Z" fill="#ffffff" /></svg>
      </section>

      {/* MISSION */}
      <section className="py-12">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-accent">{t("missionLabel")}</p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight">{t("missionTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("missionP1")}</p>
            <p className="mt-3 text-muted-foreground">{t("missionP2")}</p>
          </div>
          <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#eef4ff,#fff6ec)] shadow-sm">
            <img src="/assets/icons/logo-tight.png" alt="Équipe EkoLink" className="w-64 opacity-90" />
          </div>
        </div>
      </section>

      {/* VALEURS */}
      <section className="bg-secondary/40 py-12">
        <div className="mx-auto max-w-[1180px] px-5">
          <h2 className="text-center text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight">{t("valuesTitle")}</h2>
          <p className="mt-2 text-center text-muted-foreground">{t("valuesSub")}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm">
                <span className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-full ${v.box}`}><v.icon className="size-6" /></span>
                <h3 className="font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section className="py-12">
        <div className="mx-auto grid max-w-[1180px] items-start gap-10 px-5 lg:grid-cols-2">
          <div>
            <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold tracking-tight">{t("storyTitle")}</h2>
            <p className="mt-4 text-muted-foreground">{t("storyP1")}</p>
            <p className="mt-3 text-muted-foreground">{t("storyP2")}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold hover:bg-secondary">{t("storyCta")}</Link>
          </div>
          <ol className="relative space-y-7 border-l-2 border-border pl-8">
            {story.map((s) => (
              <li key={s.year} className="relative">
                <span className="absolute -left-[42px] flex size-5 items-center justify-center rounded-full border-4 border-white bg-primary" />
                <div className="flex items-baseline gap-3"><span className="text-lg font-extrabold text-primary">{s.year}</span><span className="font-bold">{s.title}</span></div>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1180px] px-5">
          <div className="flex flex-wrap items-center gap-5 rounded-2xl bg-[linear-gradient(135deg,#0a1a33,#0b2a52)] p-5 text-white">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent/15"><ShoppingCart className="size-7 text-accent" /></span>
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider text-accent">{t("ctaLabel")}</p>
              <p className="text-xl font-extrabold">{t("ctaTitle")}</p>
              <p className="text-sm text-white/70">{t("ctaText")}</p>
            </div>
            <Link href="/fiches-google" className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground hover:bg-accent/90">{t("ctaBtn")} <ArrowRight className="size-4" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
