/* eslint-disable @next/next/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import PageHero from "../components/PageHero";

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
  { slug: "update-google-maps-2026", img: "cover-update-maps-2026" },
];

export default async function Blog() {
  const t = await getTranslations("blog");
  const posts = (t.raw("posts") as { meta: string; title: string; excerpt: string }[]).map((p, i) => ({ ...p, ...POST_META[i] }));

  return (
    <main id="main">
      <PageHero title={t("heroTitle")} lead={t("heroLead")} crumb={t("crumb")} />

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {posts.map((p) => (
              <article key={p.slug} className="blog-card">
                <picture className="blog-cover">
                  <source srcSet={`/assets/images/${p.img}.webp`} type="image/webp" />
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
