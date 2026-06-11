/* eslint-disable @next/next/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Blog SEO local",
  description:
    "Le blog EkoLink : guides, études de cas et bonnes pratiques pour le SEO local, Google Business Profile, Pack Local et acquisition digitale pour PME.",
  alternates: { canonical: "/blog" },
};

const POST_META = [
  { slug: "pack-local-30-jours", img: "cover-pack-local" },
  { slug: "avis-google-supprimes", img: "cover-avis-supprimes" },
  { slug: "cas-boulangerie-340-appels", img: "cover-cas-boulangerie" },
  { slug: "photos-google-business", img: "cover-photos-gmb" },
  { slug: "repondre-avis-modeles", img: "cover-repondre-avis" },
  { slug: "update-google-maps-2026", img: "solution-mockup" },
];

export default async function Blog() {
  const t = await getTranslations("blog");
  const posts = (t.raw("posts") as { meta: string; title: string; excerpt: string }[]).map((p, i) => ({ ...p, ...POST_META[i] }));

  return (
    <main id="main">
      <section className="relative overflow-hidden bg-[linear-gradient(120deg,#08162c,#0c2244_58%,#0a1d38)] pb-20 pt-28 text-white md:pb-24 md:pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(41,110,255,0.12),transparent_30%),radial-gradient(circle_at_82%_25%,rgba(248,159,27,0.10),transparent_26%)]" />
          <div className="absolute right-12 top-20 hidden h-40 w-28 bg-[radial-gradient(circle,#1d4f97_1.1px,transparent_1.1px)] bg-[length:12px_12px] opacity-35 lg:block" />
          <div className="absolute left-10 top-24 hidden h-24 w-24 rounded-full border-[10px] border-primary/20 lg:block" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white [clip-path:ellipse(80%_100%_at_50%_100%)]" />
        </div>

        <div className="relative mx-auto max-w-[860px] px-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">{t("badge")}</p>
          <h1 className="mt-3 text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.98] tracking-[-0.04em]">{t("heroTitle")}</h1>
          <p className="mx-auto mt-5 max-w-[620px] text-lg leading-8 text-white/76">{t("heroLead")}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((p) => (
              <article key={p.slug} className="blog-card">
                <picture className="blog-cover">
                  <img src={`/assets/images/${p.img}.png`} alt={p.title} width={1200} height={675} loading="lazy" decoding="async" />
                </picture>
                <div className="blog-body">
                  <div className="blog-meta">{p.meta}</div>
                  <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
                  <p>{p.excerpt}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="info-box info-box--centered">
            <strong>{t("comingSoonTitle")}</strong>
            {" "}{t("comingSoonPre")}
            <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>.
          </div>
        </div>
      </section>
    </main>
  );
}
