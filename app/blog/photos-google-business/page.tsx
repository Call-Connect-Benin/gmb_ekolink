/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import Reveal from "../../components/Reveal";
import ArticleSidebar from "@/app/components/ArticleSidebar";
import ArticleCta from "@/app/components/ArticleCta";

export const metadata: Metadata = {
  title: "Quelles photos publier sur Google Business pour convertir",
  description:
    "L'ordre stratégique, le geotagging EXIF, la fréquence : tout ce qu'il faut savoir pour transformer vos photos en levier de conversion sur Google Business Profile.",
  alternates: { canonical: "/blog/photos-google-business" },
};

export default async function ArticlePhotos() {
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
            <span aria-current="page">{en ? "GBP photos that convert" : "Photos GMB qui convertissent"}</span>
          </nav>
          <h1>{en ? "Which photos to post on Google Business to convert" : "Quelles photos publier sur Google Business pour convertir"}</h1>
          <p className="lead">
            {en
              ? "Order, EXIF geotagging, frequency: everything you need to know to turn your photos into a conversion lever."
              : "L'ordre, le geotagging EXIF, la fréquence : tout ce qu'il faut savoir pour transformer vos photos en levier de conversion."}
          </p>
          <p className="article-meta">{en ? "April 15, 2026 · Guide · 5 min read · By " : "15 avril 2026 · Guide · 5 min de lecture · Par "}<strong>EkoLink</strong></p>
        </div>
      </section>

      <figure className="article-cover">
        <picture>
          <source srcSet="/assets/images/cover-photos-gmb.webp" type="image/webp" />
          <img src="/assets/images/cover-photos-gmb.png" alt="" width={1200} height={675} loading="eager" decoding="async" />
        </picture>
      </figure>

      <div className="mx-auto max-w-[1180px] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="page-content !mx-0 !max-w-none">
            {en ? (
              <>
                <Reveal as="section">
                  <h2>Why photos matter so much</h2>
                  <p>According to Google's internal data, a listing with <strong>more than 30 photos</strong> receives on average:</p>
                  <ul>
                    <li><strong>+42%</strong> direction requests</li>
                    <li><strong>+35%</strong> clicks to the website</li>
                    <li><strong>+2.7×</strong> more total views</li>
                  </ul>
                  <p>Beyond the numbers, photos are also a <strong>freshness</strong> and <strong>legitimacy</strong> signal for the Local Pack algorithm.</p>
                </Reveal>

                <Reveal as="section">
                  <h2>The 5 categories you absolutely must cover</h2>
                  <h3>1. Exterior (the "quality street view")</h3>
                  <p>3 to 5 photos of the storefront taken at different times (day, evening, morning). It's what the customer will see on arrival — visual familiarity reduces purchase anxiety.</p>
                  <h3>2. Interior (the atmosphere)</h3>
                  <p>5 to 10 photos showing the atmosphere: lighting, furniture, cleanliness. Favor photos with <strong>few people</strong> (so they don't date) or with a deliberately blurred crowd.</p>
                  <h3>3. Products / Services (the value)</h3>
                  <p>10 to 20 close-up photos of what you sell: dishes, items, ongoing services. Natural light, neutral background, portrait framing.</p>
                  <h3>4. Team (the human side)</h3>
                  <p>2 to 4 photos of your team in action. Faces increase <strong>the listing click rate</strong> by 15 to 25% according to our measurements.</p>
                  <h3>5. Logo + banner (the identity)</h3>
                  <p>A square logo of at least 720×720 px, and a 1080×608 px banner. These two assets are the first that Google displays at the top of your listing.</p>
                </Reveal>

                <ArticleCta />

                <Reveal as="section">
                  <h2>The little-known secret: EXIF metadata</h2>
                  <p>Google reads the <strong>GPS coordinates</strong> embedded in JPEG files (EXIF). If your photos contain the GPS coordinates of your business, it's a very strong proximity signal.</p>
                  <p><strong>To do</strong>:</p>
                  <ul>
                    <li>Take photos directly with your smartphone (geolocation on) <strong>on site</strong></li>
                    <li>Check that the EXIF really contains the GPS: on Windows, right-click &gt; Properties &gt; Details &gt; GPS</li>
                    <li>Avoid tools that strip EXIF on upload (Photoshop without the "Keep EXIF" option)</li>
                  </ul>
                </Reveal>

                <Reveal as="section">
                  <h2>The strategic publishing order</h2>
                  <p>Google uses the publishing order to understand importance. To maximize conversion:</p>
                  <ol>
                    <li>Logo (1<sup>st</sup>)</li>
                    <li>Cover banner</li>
                    <li>The most appealing storefront photo</li>
                    <li>3 to 5 flagship products/services</li>
                    <li>2 to 3 ambiance interior photos</li>
                    <li>The team (in the last part)</li>
                  </ol>
                </Reveal>

                <Reveal as="section">
                  <h2>Frequency: 1 photo per week</h2>
                  <p>Publishing <strong>regularly</strong> is more important than publishing in bulk. Our recommendation: 1 new photo per week, spread over 6 months. This gives the algorithm a continuous freshness signal.</p>
                </Reveal>

                <Reveal as="section">
                  <h2>Mistakes to avoid</h2>
                  <ul>
                    <li>Blurry or poorly framed photos (Google downgrades them automatically)</li>
                    <li>The same 10 photos on all your channels (Facebook, Instagram, Google) — Google detects duplication</li>
                    <li>Photos with watermark, logo, or overlaid text (Google rejects them)</li>
                    <li>Photos taken with a pro camera but without EXIF GPS</li>
                  </ul>
                </Reveal>

                <div className="info-box info-box--centered">
                  <strong>Professional photos included</strong>{" "}
                  The EkoLink Pro plan includes 10 optimized, geo-tagged photos published in the strategic order.{" "}
                  <Link href="/#tarifs">See the Pro offer →</Link>
                </div>
              </>
            ) : (
              <>
                <Reveal as="section">
                  <h2>Pourquoi les photos comptent autant</h2>
                  <p>Selon les données internes Google, une fiche avec <strong>plus de 30 photos</strong> reçoit en moyenne :</p>
                  <ul>
                    <li><strong>+42 %</strong> de demandes d'itinéraire</li>
                    <li><strong>+35 %</strong> de clics vers le site web</li>
                    <li><strong>+2,7×</strong> plus de vues totales</li>
                  </ul>
                  <p>Au-delà du chiffre, les photos sont aussi un <strong>signal de fraîcheur</strong> et de <strong>légitimité</strong> pour l'algorithme du Pack Local.</p>
                </Reveal>

                <Reveal as="section">
                  <h2>Les 5 catégories à couvrir absolument</h2>
                  <h3>1. Extérieur (la « street view de qualité »)</h3>
                  <p>3 à 5 photos de la façade prises à différents moments (jour, soir, matin). C'est ce que verra le client en arrivant — la familiarité visuelle réduit l'anxiété d'achat.</p>
                  <h3>2. Intérieur (l'ambiance)</h3>
                  <p>5 à 10 photos qui montrent l'atmosphère : éclairage, mobilier, propreté. Privilégier les photos avec <strong>peu de monde</strong> (pour ne pas dater) ou avec une foule volontairement floutée.</p>
                  <h3>3. Produits / Services (la valeur)</h3>
                  <p>10 à 20 photos en gros plan de ce que vous vendez : plats, articles, prestations en cours. Lumière naturelle, fond neutre, cadrage en mode portrait.</p>
                  <h3>4. Équipe (l'humain)</h3>
                  <p>2 à 4 photos de votre équipe en action. Les visages augmentent <strong>le taux de clic sur la fiche</strong> de 15 à 25 % selon nos mesures.</p>
                  <h3>5. Logo + bannière (l'identité)</h3>
                  <p>Un logo carré 720×720 px minimum, et une bannière 1080×608 px. Ces deux assets sont les premiers que Google affiche en haut de votre fiche.</p>
                </Reveal>

                <ArticleCta />

                <Reveal as="section">
                  <h2>Le secret méconnu : les métadonnées EXIF</h2>
                  <p>Google lit les <strong>coordonnées GPS</strong> intégrées dans les fichiers JPEG (EXIF). Si vos photos contiennent les coordonnées GPS de votre commerce, c'est un signal de proximité très fort.</p>
                  <p><strong>À faire</strong> :</p>
                  <ul>
                    <li>Photographier directement avec votre smartphone (géolocalisation activée) <strong>sur place</strong></li>
                    <li>Vérifier que les EXIF contiennent bien le GPS : sur Windows, clic droit &gt; Propriétés &gt; Détails &gt; GPS</li>
                    <li>Éviter les outils qui suppriment les EXIF lors de l'upload (Photoshop sans option « Conserver EXIF »)</li>
                  </ul>
                </Reveal>

                <Reveal as="section">
                  <h2>L'ordre stratégique de publication</h2>
                  <p>Google utilise l'ordre de publication pour comprendre l'importance. Pour maximiser la conversion :</p>
                  <ol>
                    <li>Logo (1<sup>er</sup>)</li>
                    <li>Bannière de couverture</li>
                    <li>Photo de façade la plus appétissante</li>
                    <li>3 à 5 produits/services phares</li>
                    <li>2 à 3 photos d'intérieur d'ambiance</li>
                    <li>L'équipe (en dernière partie)</li>
                  </ol>
                </Reveal>

                <Reveal as="section">
                  <h2>Fréquence : 1 photo par semaine</h2>
                  <p>Publier <strong>régulièrement</strong> est plus important que publier en masse. Notre recommandation : 1 nouvelle photo par semaine, étalée pendant 6 mois. Cela donne un signal de fraîcheur continu à l'algorithme.</p>
                </Reveal>

                <Reveal as="section">
                  <h2>Erreurs à éviter</h2>
                  <ul>
                    <li>Photos floues ou mal cadrées (Google les déclasse automatiquement)</li>
                    <li>Mêmes 10 photos sur tous vos canaux (Facebook, Instagram, Google) — Google détecte la duplication</li>
                    <li>Photos avec watermark, logo, ou texte superposé (Google les rejette)</li>
                    <li>Photos prises avec un appareil pro mais sans EXIF GPS</li>
                  </ul>
                </Reveal>

                <div className="info-box info-box--centered">
                  <strong>Photos professionnelles incluses</strong>{" "}
                  La formule Pro EkoLink inclut 10 photos optimisées, geo-taggées et publiées dans l'ordre stratégique.{" "}
                  <Link href="/#tarifs">Voir l'offre Pro →</Link>
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
