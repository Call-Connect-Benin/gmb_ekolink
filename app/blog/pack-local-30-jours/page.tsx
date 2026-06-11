/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getLocale } from "next-intl/server";
import ArticleSidebar from "@/app/components/ArticleSidebar";
import BackToBlog from "@/app/components/BackToBlog";
import ArticleCta from "@/app/components/ArticleCta";

export const metadata: Metadata = {
  title: "Pack Local Google en 30 jours : les 7 leviers",
  description:
    "Comment apparaître dans le Pack Local Google en 30 jours. Les 7 optimisations concrètes pour passer de l'invisibilité au top 3 de Google Maps, avec un cas client réel.",
  alternates: { canonical: "/blog/pack-local-30-jours" },
};

export default async function ArticlePackLocal() {
  const en = (await getLocale()) === "en";

  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f4f8ff_100%)] pb-12 pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-6rem] top-10 hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,#e3edff,transparent_60%)] lg:block" />
          <div className="absolute bottom-[-4rem] left-[-5rem] hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,#fff1dc,transparent_62%)] lg:block" />
        </div>
        <div className="relative mx-auto max-w-[1180px] px-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <BookOpen className="size-3.5" /> {en ? "Guide" : "Guide"}
          </span>
          <h1 className="mt-4 max-w-[880px] text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight">{en ? "How to reach the Google Local Pack in 30 days" : "Comment apparaître dans le Pack Local Google en 30 jours"}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{en ? "The 7 concrete levers to go from invisibility to the first page of Google Maps, illustrated by a real client case." : "Les 7 leviers concrets pour passer de l'invisibilité à la première page de Google Maps, illustrés par un cas client réel."}</p>
          <p className="mt-4 text-sm text-muted-foreground">{en ? "May 22, 2026 · 8 min read · By " : "22 mai 2026 · 8 min de lecture · Par "}<strong className="text-foreground">EkoLink</strong></p>
        </div>
      </section>

      <figure className="article-cover">
        <picture>
          <img src="/assets/images/cover-pack-local.png" alt="" width={1200} height={675} loading="eager" decoding="async" />
        </picture>
      </figure>

      <div className="mx-auto max-w-[1180px] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="page-content !mx-0 !max-w-none">
            {en ? (
              <>
                <h2>What is the Google Local Pack?</h2>
                <p>The "Local Pack" refers to the <strong>3 boxed results</strong> that appear at the top of Google when you type a local search ("bakery Paris 14th", "plumber near me"). Statistically, these 3 results capture <strong>78% of the clicks</strong> on the first page. Outside the Local Pack, you barely exist.</p>

                <div className="info-box">
                  <strong>What the Local Pack changes for an SMB</strong>
                  {" "}A business that moves from position 15 to the top 3 of the Local Pack sees on average <strong>+220% direction requests</strong> and <strong>+180% calls received</strong> in less than 60 days. Source: internal EkoLink study on 50 optimized listings between 2023 and 2025.
                </div>

                <h2>Lever #1 — Ultra-precise main category</h2>
                <p>Many entrepreneurs choose a category that is too generic ("Restaurant") instead of the specific version ("Italian restaurant", "Pizzeria", "Neapolitan cuisine"). Google matches the category to the search intent. The more precise it is, the better you rank on the right queries.</p>
                <p><strong>To do</strong>: explore the ~4,000 available categories via the <code>pleper.com/category-finder</code> tool. Choose the closest to your core business, then add 2 to 9 secondary categories.</p>

                <h2>Lever #2 — 100% consistent NAP</h2>
                <p>NAP = Name, Address, Phone. These 3 pieces of information must be <strong>strictly identical</strong> across your Google listing, your website, your directories. The slightest inconsistency (Avenue vs Av., 01.23.45 vs +33 1 23 45) lowers your trust score.</p>
                <p><strong>To do</strong>: audit with <a href="https://www.brightlocal.com/local-search-audit-tool/" target="_blank" rel="noopener noreferrer">BrightLocal</a> or <a href="https://moz.com/products/local" target="_blank" rel="noopener noreferrer">Moz Local</a>. Fix it manually across all directories.</p>

                <h2>Lever #3 — Keyword-rich description</h2>
                <p>You have 750 characters to describe your business. Most listings waste this space with platitudes ("passionate", "dedicated team"). Yet Google reads this text to understand which queries to serve you on.</p>
                <p><strong>To do</strong>: naturally integrate your 5 to 10 main keywords + your city + 2 to 3 surrounding cities. Example for a hairdresser in Paris 11:</p>
                <blockquote>
                  "Unisex hair salon in Paris 11, specialized in plant-based colorings, balayages and trendy cuts. We welcome men and women 6 days a week, 2 minutes from République and Oberkampf. Walk-in cuts available."
                </blockquote>

                <h2>Lever #4 — 30+ geo-tagged photos</h2>
                <p>Listings with more than 30 photos receive <strong>2.7 times more clicks</strong> than those with fewer than 10 (source: Google Business Profile Insights). But beware: Google also reads the EXIF metadata of your photos.</p>
                <p><strong>To do</strong>: photograph your establishment with a phone that geo-tags automatically. Check that the EXIF contains the GPS coordinates of the real address. Publish in this order: exterior, interior, products/services, team.</p>

                <ArticleCta />

                <h2>Lever #5 — Lasting reviews and replies</h2>
                <p>The "reviews × average rating" ratio is one of the most weighted factors in the Local Pack. But Google regularly removes the reviews it deems suspicious (same devices, incomplete profiles, similar vocabulary).</p>
                <p><strong>To do</strong>:</p>
                <ul>
                  <li>Ask each satisfied customer for a review <strong>in person</strong> (QR code at the counter or business card)</li>
                  <li>Diversify the sources: different customer Wi-Fi, varied days and times</li>
                  <li>Reply to <strong>all reviews within 48h</strong>, positive and negative (a strong signal to Google)</li>
                </ul>

                <h2>Lever #6 — Weekly Google Posts</h2>
                <p>Google Business Posts (offers, news, events) are <strong>rarely used</strong> by your competitors — which is exactly why they give you an edge. A listing that posts once a week sends Google a freshness signal that improves ranking.</p>
                <p><strong>To do</strong>: prepare a calendar of 12 posts for the quarter (news, promo, event, tip). Schedule via the GBP Search Console or a tool like Hootsuite.</p>

                <h2>Lever #7 — Strategic pre-filled Q&A</h2>
                <p>Did you know you can ask your own questions on your Google listing, and answer them? This Q&A area is an under-used SEO gold mine: it increases time spent on the listing and reinforces semantic relevance.</p>
                <p><strong>To do</strong>: ask 10 strategic questions ("Do you accept cards?", "Is there parking?", "Do you offer delivery?") and answer them yourself from a Google account different from the manager's.</p>

                <h2>The client case: Bakery M. (Paris 14)</h2>
                <p>In January 2025, Bakery M. contacted us. Its listing was at <strong>position 18</strong> on Google Maps for "bakery Paris 14", generating fewer than 3 calls a week.</p>
                <p>We applied the 7 levers above in 14 days. Results measured at D+30:</p>
                <table>
                  <thead>
                    <tr><th>Metric</th><th>Before</th><th>After 30 d</th><th>Change</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Local Pack position</td><td>#18</td><td>#2</td><td>+16 spots</td></tr>
                    <tr><td>Listing views</td><td>140/wk</td><td>820/wk</td><td>+486%</td></tr>
                    <tr><td>Direction requests</td><td>11/wk</td><td>67/wk</td><td>+509%</td></tr>
                    <tr><td>Calls</td><td>3/wk</td><td>22/wk</td><td>+633%</td></tr>
                  </tbody>
                </table>

                <h2>Conclusion</h2>
                <p>The Google Local Pack is not a matter of luck. It's a system with knowable rules. The 7 levers above cover <strong>85% of the ranking factors</strong> — the rest is a matter of patience (Google takes 2 to 8 weeks to re-evaluate your signals).</p>

                <div className="info-box info-box--centered">
                  <strong>Want to save time?</strong>
                  {" "}EkoLink applies these 7 levers for you in 48 to 72h, with a 30-day satisfaction-or-refund guarantee. <Link href="/fiches-google">See our plans →</Link>
                </div>
              </>
            ) : (
              <>
                <h2>Qu'est-ce que le Pack Local Google ?</h2>
                <p>Le « Pack Local » désigne les <strong>3 résultats encadrés</strong> qui apparaissent en haut de Google quand on tape une recherche locale (« boulangerie Paris 14e », « plombier près de moi »). Statistiquement, ces 3 résultats captent <strong>78 % des clics</strong> de la première page. En dehors du Pack Local, vous existez à peine.</p>

                <div className="info-box">
                  <strong>Ce que change le Pack Local pour une PME</strong>
                  {" "}Un commerçant qui passe de la position 15 au top 3 du Pack Local voit en moyenne <strong>+220 % de demandes d'itinéraire</strong> et <strong>+180 % d'appels reçus</strong> en moins de 60 jours. Source : étude interne EkoLink sur 50 fiches optimisées entre 2023 et 2025.
                </div>

                <h2>Levier #1 — Catégorie principale ultra-précise</h2>
                <p>Beaucoup d'entrepreneurs choisissent une catégorie trop générique (« Restaurant ») au lieu de la version spécifique (« Restaurant italien », « Pizzeria », « Cuisine napolitaine »). Or, Google fait correspondre la catégorie à l'intention de recherche. Plus elle est précise, plus vous remontez sur les bonnes requêtes.</p>
                <p><strong>À faire</strong> : explorer les ~4 000 catégories disponibles via l'outil <code>pleper.com/category-finder</code>. Choisir la plus proche de votre cœur de métier, puis ajouter 2 à 9 catégories secondaires.</p>

                <h2>Levier #2 — NAP cohérent à 100 %</h2>
                <p>NAP = Name, Address, Phone. Ces 3 informations doivent être <strong>strictement identiques</strong> entre votre fiche Google, votre site web, votre Pages Jaunes, et tous les annuaires où vous apparaissez. La moindre incohérence (Avenue vs Av., 01.23.45 vs +33 1 23 45) abaisse votre score de confiance.</p>
                <p><strong>À faire</strong> : auditer avec <a href="https://www.brightlocal.com/local-search-audit-tool/" target="_blank" rel="noopener noreferrer">BrightLocal</a> ou <a href="https://moz.com/products/local" target="_blank" rel="noopener noreferrer">Moz Local</a>. Corriger sur tous les annuaires manuellement.</p>

                <h2>Levier #3 — Description keyword-rich</h2>
                <p>Vous avez 750 caractères pour décrire votre activité. La majorité des fiches gaspillent cet espace avec des banalités (« passionnés », « équipe dévouée »). Or, Google lit ce texte pour comprendre quelles requêtes vous servir.</p>
                <p><strong>À faire</strong> : intégrer naturellement vos 5 à 10 mots-clés principaux + votre ville + 2 à 3 villes alentour. Exemple pour un coiffeur Paris 11 :</p>
                <blockquote>
                  « Salon de coiffure mixte à Paris 11, spécialisé en colorations végétales, balayages et coupes tendance. Nous accueillons hommes et femmes 6 jours sur 7, à 2 minutes de République et Oberkampf. Coupe sans rendez-vous possible. »
                </blockquote>

                <h2>Levier #4 — 30+ photos géo-taggées</h2>
                <p>Les fiches avec plus de 30 photos reçoivent <strong>2,7 fois plus de clics</strong> que celles qui en ont moins de 10 (source : Google Business Profile Insights). Mais attention : Google lit aussi les métadonnées EXIF de vos photos.</p>
                <p><strong>À faire</strong> : photographier votre établissement avec un téléphone qui géo-tagge automatiquement. Vérifier que les EXIF contiennent les coordonnées GPS de l'adresse réelle. Publier dans cet ordre : extérieur, intérieur, produits/services, équipe.</p>

                <ArticleCta />

                <h2>Levier #5 — Avis pérennes et réponses</h2>
                <p>Le ratio « avis × note moyenne » est l'un des facteurs les plus pondérés du Pack Local. Mais Google supprime régulièrement les avis qu'il juge suspects (mêmes appareils, profils incomplets, vocabulaire similaire).</p>
                <p><strong>À faire</strong> :</p>
                <ul>
                  <li>Demander un avis à chaque client satisfait <strong>physiquement</strong> (QR code en caisse ou carte de visite)</li>
                  <li>Diversifier les sources : Wi-Fi clients différent, jours et heures variés</li>
                  <li>Répondre à <strong>tous les avis sous 48 h</strong>, positifs comme négatifs (signal fort à Google)</li>
                </ul>

                <h2>Levier #6 — Google Posts hebdomadaires</h2>
                <p>Les publications Google Business Posts (offres, actus, événements) sont <strong>peu utilisées</strong> par vos concurrents — c'est précisément pour ça qu'elles vous donnent un avantage. Une fiche qui poste 1 fois par semaine envoie à Google un signal de fraîcheur qui améliore le ranking.</p>
                <p><strong>À faire</strong> : préparer un calendrier de 12 posts pour le trimestre (actu, promo, événement, conseil). Programmer via la Search Console GBP ou un outil comme Hootsuite.</p>

                <h2>Levier #7 — Q&R stratégiques pré-remplies</h2>
                <p>Saviez-vous que vous pouvez vous poser vos propres questions sur votre fiche Google, et y répondre ? Cette zone Q&R est une mine d'or SEO sous-exploitée : elle augmente le temps passé sur la fiche et renforce la pertinence sémantique.</p>
                <p><strong>À faire</strong> : poser 10 questions stratégiques (« Acceptez-vous les cartes ? », « Y a-t-il un parking ? », « Faites-vous de la livraison ? ») et y répondre vous-même depuis un compte Google différent de celui du gérant.</p>

                <h2>Le cas client : Boulangerie M. (Paris 14)</h2>
                <p>En janvier 2025, la Boulangerie M. nous a contactés. Sa fiche était à la <strong>position 18</strong> sur Google Maps pour « boulangerie Paris 14 », elle générait moins de 3 appels par semaine.</p>
                <p>Nous avons appliqué les 7 leviers ci-dessus en 14 jours. Résultats mesurés à J+30 :</p>
                <table>
                  <thead>
                    <tr><th>Métrique</th><th>Avant</th><th>Après 30 j</th><th>Variation</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Position Pack Local</td><td>#18</td><td>#2</td><td>+16 places</td></tr>
                    <tr><td>Vues de la fiche</td><td>140/sem</td><td>820/sem</td><td>+486 %</td></tr>
                    <tr><td>Demandes d'itinéraire</td><td>11/sem</td><td>67/sem</td><td>+509 %</td></tr>
                    <tr><td>Appels</td><td>3/sem</td><td>22/sem</td><td>+633 %</td></tr>
                  </tbody>
                </table>

                <h2>Conclusion</h2>
                <p>Le Pack Local Google n'est pas une question de chance. C'est un système avec des règles connaissables. Les 7 leviers ci-dessus couvrent <strong>85 % des facteurs</strong> de ranking — le reste relève de la patience (Google prend 2 à 8 semaines pour ré-évaluer vos signaux).</p>

                <div className="info-box info-box--centered">
                  <strong>Vous voulez gagner du temps ?</strong>
                  {" "}EkoLink applique ces 7 leviers pour vous en 48 à 72 h, avec garantie satisfait ou remboursé 30 jours. <Link href="/fiches-google">Voir nos formules →</Link>
                </div>
              </>
            )}
            <BackToBlog />
          </article>

          <ArticleSidebar />
        </div>
      </div>
    </main>
  );
}
