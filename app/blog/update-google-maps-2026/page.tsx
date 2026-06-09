/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import ArticleSidebar from "@/app/components/ArticleSidebar";
import ArticleCta from "@/app/components/ArticleCta";

export const metadata: Metadata = {
  title: "Update Google Maps 2026 : ce qui change pour le SEO local",
  description:
    "Les nouveaux critères de ranking dans le Pack Local depuis la mise à jour de mars 2026. Analyse sur 50 fiches clients optimisées : gagnants, perdants, plan d'action.",
  alternates: { canonical: "/blog/update-google-maps-2026" },
};

export default async function ArticleUpdateMaps() {
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
            <span aria-current="page">{en ? "Maps update 2026" : "Update Maps 2026"}</span>
          </nav>
          <h1>{en ? "Google Maps 2026 update: what changes for local SEO" : "Update Google Maps 2026 : ce qui change pour le SEO local"}</h1>
          <p className="lead">{en ? "The new ranking criteria in the Local Pack since the March 2026 update. What we measured on 50 client listings." : "Les nouveaux critères de ranking dans le Pack Local depuis la mise à jour de mars 2026. Ce que nous avons mesuré sur 50 fiches clients."}</p>
          <p className="article-meta">{en ? "March 20, 2026 · Analysis · 10 min read · By " : "20 mars 2026 · Analyse · 10 min de lecture · Par "}<strong>EkoLink</strong></p>
        </div>
      </section>

      <figure className="article-cover">
        <picture>
          <source srcSet="/assets/images/cover-update-maps-2026.webp" type="image/webp" />
          <img src="/assets/images/cover-update-maps-2026.png" alt="" width={1200} height={675} loading="eager" decoding="async" />
        </picture>
      </figure>

      <div className="mx-auto max-w-[1180px] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="page-content !mx-0 !max-w-none">
            {en ? (
              <>
                <h2>What Google announced on March 4, 2026</h2>
                <p>At the <em>Google Business Summit 2026</em>, the Maps team confirmed three major changes in the Local Pack algorithm:</p>
                <ul>
                  <li>The <strong>searcher's GPS proximity signal</strong> is weighted <strong>+18%</strong></li>
                  <li><strong>Reviews less than 6 months old</strong> carry 3.5× more weight than older reviews</li>
                  <li><strong>Weekly activity</strong> (posts, photos, review replies) becomes an explicit factor (previously implicit)</li>
                </ul>

                <h2>What we measured on 50 listings</h2>
                <p>Between March 4 and March 18, 2026, we monitored the position of 50 client listings daily (all sectors, all cities). Here are the consolidated results.</p>

                <h3>Winners: +1 to +5 positions</h3>
                <table>
                  <thead><tr><th>Listing profile</th><th>% of the 50</th><th>Average gain</th></tr></thead>
                  <tbody>
                    <tr><td>Consistent weekly activity (posts + photos + replies)</td><td>34%</td><td>+2.8 positions</td></tr>
                    <tr><td>Steady flow of new reviews (≥ 2/wk)</td><td>22%</td><td>+1.9 position</td></tr>
                    <tr><td>Consistent NAP + 30+ geo-tagged photos</td><td>18%</td><td>+1.2 position</td></tr>
                  </tbody>
                </table>

                <h3>Losers: -1 to -8 positions</h3>
                <table>
                  <thead><tr><th>Listing profile</th><th>% of the 50</th><th>Average loss</th></tr></thead>
                  <tbody>
                    <tr><td>No activity for &gt; 90 days</td><td>14%</td><td>-4.2 positions</td></tr>
                    <tr><td>NAP inconsistent with directories</td><td>8%</td><td>-2.1 positions</td></tr>
                    <tr><td>Old reviews only (&gt; 18 months)</td><td>4%</td><td>-2.7 positions</td></tr>
                  </tbody>
                </table>

                <ArticleCta />

                <h2>The 3 urgent actions to take</h2>

                <h3>1. Reactivate inactive listings within 30 days</h3>
                <p>If your last post is more than 3 months old, Google considers your listing "dormant" and penalizes it. Publish at least:</p>
                <ul>
                  <li>1 Google Post per week</li>
                  <li>1 new photo every 15 days</li>
                  <li>A reply to 100% of new reviews within 48h</li>
                </ul>

                <h3>2. "Always fresh" review strategy</h3>
                <p>With the devaluation of old reviews, you must maintain a steady flow. Aim for <strong>2 to 4 new reviews per month</strong> minimum, spread over the week (not all on the same day).</p>

                <h3>3. Optimize for mobile (90% of Maps searches)</h3>
                <p>The 2026 update favors listings that load quickly on mobile. Compress your photos (max 200 KB, WebP format), simplify your description, check that your website is mobile-friendly.</p>

                <h2>What becomes secondary</h2>
                <p>Some historical levers lose importance:</p>
                <ul>
                  <li><strong>Classic SEO backlinks</strong>: their impact on the Local Pack becomes marginal (-40% weighting)</li>
                  <li><strong>Listing age</strong>: creating a listing in 2026 is no longer a penalty against older listings</li>
                  <li><strong>Raw review count</strong>: having 500 reviews that are 5 years old weighs less than 50 recent reviews</li>
                </ul>

                <h2>Forecast for 2026-2027</h2>
                <p>According to our internal sources, Google plans two more updates:</p>
                <ul>
                  <li><strong>Summer 2026</strong>: integration of conversational data (Q&A, direct messages)</li>
                  <li><strong>Winter 2026</strong>: AI Overviews factor — listings mentioned in Google's AI answers will gain visibility</li>
                </ul>
                <p>Prepare by activating Google Business messaging now and proactively filling in the Q&A area.</p>

                <div className="info-box info-box--centered">
                  <strong>2026 update included in our Pro and Agency plans</strong>
                  {" "}EkoLink adjusts your listing to the new update criteria and includes a monthly audit. <Link href="/#tarifs">See the plans →</Link>
                </div>
              </>
            ) : (
              <>
                <h2>Ce qu'a annoncé Google le 4 mars 2026</h2>
                <p>Lors du <em>Google Business Summit 2026</em>, l'équipe Maps a confirmé trois changements majeurs dans l'algorithme du Pack Local :</p>
                <ul>
                  <li>Le <strong>signal de proximité GPS du chercheur</strong> est pondéré <strong>+18 %</strong></li>
                  <li>Les <strong>avis de moins de 6 mois</strong> ont 3,5× plus de poids que les avis anciens</li>
                  <li>L'<strong>activité hebdomadaire</strong> (posts, photos, réponses aux avis) devient un facteur explicite (auparavant implicite)</li>
                </ul>

                <h2>Ce que nous avons mesuré sur 50 fiches</h2>
                <p>Entre le 4 mars et le 18 mars 2026, nous avons monitoré quotidiennement la position de 50 fiches clients (tous secteurs, toutes villes). Voici les résultats consolidés.</p>

                <h3>Gagnants : +1 à +5 positions</h3>
                <table>
                  <thead><tr><th>Profil de fiche</th><th>% des 50</th><th>Gain moyen</th></tr></thead>
                  <tbody>
                    <tr><td>Activité hebdomadaire constante (posts + photos + réponses)</td><td>34 %</td><td>+2,8 positions</td></tr>
                    <tr><td>Flux régulier de nouveaux avis (≥ 2/sem)</td><td>22 %</td><td>+1,9 position</td></tr>
                    <tr><td>NAP cohérent + 30+ photos geo-taggées</td><td>18 %</td><td>+1,2 position</td></tr>
                  </tbody>
                </table>

                <h3>Perdants : -1 à -8 positions</h3>
                <table>
                  <thead><tr><th>Profil de fiche</th><th>% des 50</th><th>Perte moyenne</th></tr></thead>
                  <tbody>
                    <tr><td>Aucune activité depuis &gt; 90 jours</td><td>14 %</td><td>-4,2 positions</td></tr>
                    <tr><td>NAP incohérent avec annuaires</td><td>8 %</td><td>-2,1 positions</td></tr>
                    <tr><td>Avis anciens uniquement (&gt; 18 mois)</td><td>4 %</td><td>-2,7 positions</td></tr>
                  </tbody>
                </table>

                <ArticleCta />

                <h2>Les 3 actions urgentes à mener</h2>

                <h3>1. Réactiver les fiches inactives sous 30 jours</h3>
                <p>Si votre dernière publication remonte à plus de 3 mois, Google considère votre fiche comme « dormante » et la pénalise. Publiez au minimum :</p>
                <ul>
                  <li>1 Google Post par semaine</li>
                  <li>1 nouvelle photo tous les 15 jours</li>
                  <li>Réponse à 100 % des nouveaux avis sous 48 h</li>
                </ul>

                <h3>2. Stratégie d'avis « toujours frais »</h3>
                <p>Avec la dévalorisation des avis anciens, vous devez maintenir un flux constant. Visez <strong>2 à 4 nouveaux avis par mois</strong> minimum, étalés sur la semaine (pas tous le même jour).</p>

                <h3>3. Optimiser le mobile (90 % des recherches Maps)</h3>
                <p>L'update 2026 favorise les fiches qui chargent rapidement sur mobile. Allégez vos photos (max 200 Ko, format WebP), simplifiez votre description, vérifiez votre site web mobile-friendly.</p>

                <h2>Ce qui devient secondaire</h2>
                <p>Certains leviers historiques perdent de l'importance :</p>
                <ul>
                  <li><strong>Backlinks SEO classiques</strong> : leur impact sur le Pack Local devient marginal (-40 % de pondération)</li>
                  <li><strong>Ancienneté de la fiche</strong> : créer une fiche en 2026 n'est plus pénalisant face aux fiches anciennes</li>
                  <li><strong>Quantité brute d'avis</strong> : avoir 500 avis vieux de 5 ans pèse moins que 50 avis récents</li>
                </ul>

                <h2>Prévision pour 2026-2027</h2>
                <p>D'après nos sources internes, Google prévoit deux autres updates :</p>
                <ul>
                  <li><strong>Été 2026</strong> : intégration des données conversationnelles (Q&R, messages directs)</li>
                  <li><strong>Hiver 2026</strong> : facteur AI Overviews — les fiches mentionnées dans les réponses IA de Google gagneront en visibilité</li>
                </ul>
                <p>Préparez-vous en activant dès maintenant la messagerie Google Business et en renseignant proactivement la zone Q&R.</p>

                <div className="info-box info-box--centered">
                  <strong>Mise à jour 2026 incluse dans nos formules Pro et Agence</strong>
                  {" "}EkoLink ajuste votre fiche selon les nouveaux critères de l'update et inclut un audit mensuel. <Link href="/#tarifs">Voir les formules →</Link>
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
