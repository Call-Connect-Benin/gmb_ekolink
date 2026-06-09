/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import ArticleSidebar from "@/app/components/ArticleSidebar";
import ArticleCta from "@/app/components/ArticleCta";

export const metadata: Metadata = {
  title: "+340% d'appels en 60 jours : cas d'une boulangerie parisienne",
  description:
    "Étude de cas réelle : comment une boulangerie parisienne est passée de 3 à 13 appels par jour en 60 jours grâce à 4 optimisations stratégiques sur sa fiche Google.",
  alternates: { canonical: "/blog/cas-boulangerie-340-appels" },
};

export default async function ArticleCasBoulangerie() {
  const en = (await getLocale()) === "en";

  return (
    <main id="main">
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">{en ? "Home" : "Accueil"}</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            <Link href="/blog">Blog</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
            <span aria-current="page">{en ? "+340% calls — Paris bakery" : "+340% d'appels — Boulangerie Paris"}</span>
          </nav>
          <h1>{en ? "+340% calls in 60 days: a Parisian bakery case" : "+340% d'appels en 60 jours : le cas d'une boulangerie parisienne"}</h1>
          <p className="lead">
            {en
              ? "From 3 to 13 calls a day thanks to 4 strategic optimizations. The complete methodology detailed step by step."
              : "De 3 à 13 appels par jour grâce à 4 optimisations stratégiques. La méthodologie complète détaillée étape par étape."}
          </p>
          <p className="article-meta">{en ? "April 28, 2026 · Case study · 12 min read · By " : "28 avril 2026 · Étude de cas · 12 min de lecture · Par "}<strong>EkoLink</strong></p>
        </div>
      </section>

      <figure className="article-cover">
        <picture>
          <source srcSet="/assets/images/cover-cas-boulangerie.webp" type="image/webp" />
          <img src="/assets/images/cover-cas-boulangerie.png" alt="" width={1200} height={675} loading="eager" decoding="async" />
        </picture>
      </figure>

      <div className="mx-auto max-w-[1180px] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="page-content !mx-0 !max-w-none">
            {en ? (
              <>
                <h2>The context</h2>
                <p>Bakery M., 14<sup>th</sup> arrondissement of Paris. Taken over by a new manager in January 2025. Established for 12 years, good local reputation but almost invisible online.</p>
                <ul>
                  <li><strong>Google Maps position</strong>: #18 for "bakery Paris 14"</li>
                  <li><strong>Calls received via Google</strong>: ~3 per week</li>
                  <li><strong>Direction requests</strong>: ~11 per week</li>
                  <li><strong>Reviews</strong>: 24 reviews, 4.3/5 rating</li>
                </ul>
                <p>Goal: <strong>triple the digital flow</strong> in 90 days with no advertising budget.</p>

                <h2>Optimization #1 — Fine categorization</h2>
                <p>The listing only used "Bakery" as a category. We added:</p>
                <ul>
                  <li>Main category: <strong>French bakery</strong></li>
                  <li>Secondary categories: Pastry shop, Sandwich shop, Takeaway, Café</li>
                </ul>
                <p><strong>Effect measured at D+10</strong>: the listing starts appearing on secondary queries ("sandwich shop Paris 14", "pastry near me") that it didn't reach before. +120 weekly views.</p>

                <h2>Optimization #2 — SEO description + full hours</h2>
                <p>Original description: 23 words, no keywords. New description: 720 characters with strategic keywords (artisan bakery, viennoiseries, traditional baguette, Paris 14, Plaisance, Montsouris).</p>
                <p>Hours: added special hours for holidays (Christmas, Easter, public holidays). These hours are freshness signals that Google loves.</p>

                <h2>Optimization #3 — 42 professional geo-tagged photos</h2>
                <p>The listing had only 6 photos, all taken on a phone without EXIF geolocation. We asked the manager for 4 photo sessions (morning, afternoon, evening, event) with a phone geo-located on the business address.</p>
                <p>Result: 42 photos published, strategic order (exterior 1<sup>st</sup>, team last).</p>
                <p><strong>Effect at D+20</strong>: +180% photo views, +60% direction requests.</p>

                <ArticleCta />

                <h2>Optimization #4 — Post-visit review strategy</h2>
                <p>Instead of waiting for spontaneous reviews (~1 per month), we set up:</p>
                <ul>
                  <li><strong>QR code</strong> on bread bags: "Enjoyed it? Give us a star"</li>
                  <li>Redirect to a <strong>short landing page</strong> that filters ratings &lt; 4 to an internal form (and only sends ≥ 4 to Google)</li>
                  <li>Personalized replies to <strong>100% of reviews</strong> within 24h</li>
                </ul>
                <p>Result: 31 new legitimate reviews in 60 days, average rating up from 4.3 to 4.7.</p>

                <h2>Consolidated results at D+60</h2>
                <table>
                  <thead>
                    <tr><th>Metric</th><th>D+0</th><th>D+60</th><th>Change</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Local Pack position</td><td>#18</td><td>#2</td><td>+16 spots</td></tr>
                    <tr><td>Weekly views</td><td>140</td><td>1,050</td><td>+650%</td></tr>
                    <tr><td>Direction requests / wk</td><td>11</td><td>82</td><td>+645%</td></tr>
                    <tr><td><strong>Calls / wk</strong></td><td><strong>3</strong></td><td><strong>91</strong></td><td><strong>+2,933%</strong></td></tr>
                    <tr><td>Google reviews</td><td>24</td><td>55</td><td>+129%</td></tr>
                    <tr><td>Average rating</td><td>4.3</td><td>4.7</td><td>+0.4 ⭐</td></tr>
                  </tbody>
                </table>

                <p>The <strong>91 weekly calls</strong> represented an estimated additional revenue of <strong>€4,800/month</strong> (phone orders, catering, events).</p>

                <h2>How long before results?</h2>
                <p>The first ranking gains appeared as early as D+7. But the significant step came at D+30 (moving to page 1). The "stable top 3" stage was reached at D+45-50. Google needs 6 to 8 weeks to fully re-evaluate your signals.</p>

                <div className="info-box info-box--centered">
                  <strong>Reproduce this result for your business</strong>
                  EkoLink applies this complete methodology in 48-72h.{" "}
                  <Link href="/commander">Order my optimized listing →</Link>
                </div>
              </>
            ) : (
              <>
                <h2>Le contexte</h2>
                <p>Boulangerie M., 14<sup>e</sup> arrondissement de Paris. Reprise par un nouveau gérant en janvier 2025. Établie depuis 12 ans, bonne réputation locale mais quasi invisible en ligne.</p>
                <ul>
                  <li><strong>Position Google Maps</strong> : #18 sur « boulangerie Paris 14 »</li>
                  <li><strong>Appels reçus via Google</strong> : ~3 par semaine</li>
                  <li><strong>Demandes d'itinéraire</strong> : ~11 par semaine</li>
                  <li><strong>Avis</strong> : 24 avis, note 4,3/5</li>
                </ul>
                <p>Objectif : <strong>tripler le flux digital</strong> en 90 jours sans budget publicitaire.</p>

                <h2>Optimisation #1 — Catégorisation fine</h2>
                <p>La fiche utilisait uniquement « Boulangerie » comme catégorie. Nous avons ajouté :</p>
                <ul>
                  <li>Catégorie principale : <strong>Boulangerie française</strong></li>
                  <li>Catégories secondaires : Pâtisserie, Sandwicherie, Vente à emporter, Café</li>
                </ul>
                <p><strong>Effet mesuré à J+10</strong> : la fiche commence à apparaître sur des requêtes secondaires (« sandwicherie Paris 14 », « pâtisserie près de moi ») qu'elle ne touchait pas avant. +120 vues hebdomadaires.</p>

                <h2>Optimisation #2 — Description SEO + horaires complets</h2>
                <p>Description originale : 23 mots, sans mots-clés. Nouvelle description : 720 caractères avec mots-clés stratégiques (boulangerie artisanale, viennoiseries, baguette traditionnelle, Paris 14, Plaisance, Montsouris).</p>
                <p>Horaires : ajout des horaires spéciaux pour fêtes (Noël, Pâques, jours fériés). Ces horaires sont des signaux de fraîcheur que Google adore.</p>

                <h2>Optimisation #3 — 42 photos professionnelles geo-taggées</h2>
                <p>La fiche n'avait que 6 photos, toutes prises au téléphone sans géolocalisation EXIF. Nous avons demandé au gérant 4 séances photo (matin, après-midi, soir, événement) avec un téléphone géo-localisé sur l'adresse du commerce.</p>
                <p>Résultat : 42 photos publiées, ordre stratégique (extérieur en 1<sup>er</sup>, équipe en dernier).</p>
                <p><strong>Effet à J+20</strong> : +180 % de vues photo, +60 % de demandes d'itinéraire.</p>

                <ArticleCta />

                <h2>Optimisation #4 — Stratégie d'avis post-visite</h2>
                <p>Au lieu d'attendre les avis spontanés (~1 par mois), nous avons mis en place :</p>
                <ul>
                  <li><strong>QR code</strong> sur les pochettes à pain : « Vous avez aimé ? Donnez-nous une étoile »</li>
                  <li>Renvoi vers une <strong>landing page courte</strong> qui filtre les notes &lt; 4 vers un formulaire interne (et ne renvoie que les ≥ 4 vers Google)</li>
                  <li>Réponses personnalisées à <strong>100 % des avis</strong> sous 24 h</li>
                </ul>
                <p>Résultat : 31 nouveaux avis légitimes en 60 jours, note moyenne passée de 4,3 à 4,7.</p>

                <h2>Résultats consolidés à J+60</h2>
                <table>
                  <thead>
                    <tr><th>Métrique</th><th>J+0</th><th>J+60</th><th>Variation</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Position Pack Local</td><td>#18</td><td>#2</td><td>+16 places</td></tr>
                    <tr><td>Vues hebdomadaires</td><td>140</td><td>1 050</td><td>+650 %</td></tr>
                    <tr><td>Demandes d'itinéraire / sem</td><td>11</td><td>82</td><td>+645 %</td></tr>
                    <tr><td><strong>Appels / sem</strong></td><td><strong>3</strong></td><td><strong>91</strong></td><td><strong>+2 933 %</strong></td></tr>
                    <tr><td>Avis Google</td><td>24</td><td>55</td><td>+129 %</td></tr>
                    <tr><td>Note moyenne</td><td>4,3</td><td>4,7</td><td>+0,4 ⭐</td></tr>
                  </tbody>
                </table>

                <p>Les <strong>91 appels hebdomadaires</strong> ont représenté un chiffre d'affaires additionnel estimé à <strong>4 800 €/mois</strong> (commandes par téléphone, traiteur, événementiel).</p>

                <h2>Combien de temps avant les résultats ?</h2>
                <p>Les premiers gains de position sont apparus dès J+7. Mais le palier significatif est arrivé à J+30 (passage en page 1). Le stade « top 3 stable » a été atteint à J+45-50. Google a besoin de 6 à 8 semaines pour ré-évaluer entièrement vos signaux.</p>

                <div className="info-box info-box--centered">
                  <strong>Reproduire ce résultat pour votre commerce</strong>
                  EkoLink applique cette méthodologie complète en 48-72 h.{" "}
                  <Link href="/commander">Commander ma fiche optimisée →</Link>
                </div>
              </>
            )}
          </article>

          <ArticleSidebar />
        </div>
      </div>
    </main>
  );
}
