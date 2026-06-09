/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site ekolink.dev : éditeur, hébergeur, responsable de publication, propriété intellectuelle. EkoLink S.A.S., agence digitale parisienne.",
  alternates: { canonical: "/mentions-legales" },
};

export default async function MentionsLegales() {
  const en = (await getLocale()) === "en";

  return (
    <main id="main">
      <PageHero
        title={en ? "Legal notice" : "Mentions légales"}
        lead={en ? "Last updated: May 22, 2026" : "Dernière mise à jour : 22 mai 2026"}
        crumb={en ? "Legal notice" : "Mentions légales"}
      />
      <div className="container">
        <article className="page-content">
          {en ? (
            <>
              <div className="page-toc">
                <h2>Contents</h2>
                <ol>
                  <li><a href="#editeur">Site publisher</a></li>
                  <li><a href="#hebergeur">Host</a></li>
                  <li><a href="#publication">Publication director</a></li>
                  <li><a href="#pi">Intellectual property</a></li>
                  <li><a href="#donnees">Personal data</a></li>
                  <li><a href="#cookies">Cookies</a></li>
                  <li><a href="#liens">Hyperlinks</a></li>
                  <li><a href="#credits">Credits</a></li>
                </ol>
              </div>

              <h2 id="editeur">1. Site publisher</h2>
              <p>The site <strong>ekolink.dev</strong> is published by:</p>
              <ul>
                <li><strong>Company name:</strong> EkoLink</li>
                <li><strong>Legal form:</strong> Simplified joint-stock company (S.A.S.)</li>
                <li><strong>Share capital:</strong> <span className="placeholder">[TO COMPLETE]</span></li>
                <li><strong>SIRET:</strong> 1179695284</li>
                <li><strong>Trade register (RCS):</strong> <span className="placeholder">[Paris — to complete with the full number]</span></li>
                <li><strong>Intra-EU VAT no.:</strong> <span className="placeholder">[TO COMPLETE — FR XX XXXXXXXXX]</span></li>
                <li><strong>Registered office:</strong> 7 Rue Vulpian, 75013 Paris, France</li>
                <li><strong>Phone:</strong> <a href="tel:+33617030308">+33&nbsp;6&nbsp;17&nbsp;03&nbsp;03&nbsp;08</a></li>
                <li><strong>Email:</strong> <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a></li>
              </ul>

              <h2 id="hebergeur">2. Host</h2>
              <p>The site is hosted by:</p>
              <ul>
                <li><strong>Name:</strong> <span className="placeholder">[TO COMPLETE — e.g. Vercel Inc., OVH SAS, Netlify Inc.]</span></li>
                <li><strong>Address:</strong> <span className="placeholder">[TO COMPLETE]</span></li>
                <li><strong>Phone:</strong> <span className="placeholder">[TO COMPLETE]</span></li>
                <li><strong>Website:</strong> <span className="placeholder">[TO COMPLETE]</span></li>
              </ul>

              <h2 id="publication">3. Publication director</h2>
              <p>Mr <span className="placeholder">[TO COMPLETE — name of the director, likely Albert Lanne]</span>, in his capacity as legal representative of EkoLink S.A.S.</p>

              <h2 id="pi">4. Intellectual property</h2>
              <p>All the content of the ekolink.dev site (texts, images, videos, logos, illustrations, source code, structure, graphic design) is the exclusive property of EkoLink S.A.S. or its partners, and protected by French and international copyright and intellectual property laws.</p>
              <p>Any reproduction, representation, modification, publication, transmission or exploitation, in whole or in part, of the site or its content, by any process and on any medium, is prohibited without the prior written authorization of EkoLink S.A.S. Any unauthorized use constitutes infringement punishable under articles L.335-2 et seq. of the French Intellectual Property Code.</p>
              <p>The <strong>Google</strong>, <strong>Google Business Profile</strong>, <strong>Google Maps</strong> trademarks and their logos are registered trademarks of Google LLC. EkoLink is an independent Google partner and is not affiliated with Google LLC.</p>

              <h2 id="donnees">5. Personal data (GDPR)</h2>
              <p>The processing of personal data collected on the site is detailed in our <Link href="/politique-confidentialite">privacy policy</Link>. In accordance with Regulation (EU) 2016/679 (GDPR) and the amended French Data Protection Act, you have a right of access, rectification, erasure, restriction, objection and portability of your data.</p>
              <p>To exercise these rights, contact us at <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> or by post at the registered office address.</p>

              <h2 id="cookies">6. Cookies</h2>
              <p>The site uses cookies to measure its audience and improve your experience. You can review and change your preferences via our <Link href="/politique-cookies">cookie policy</Link>.</p>

              <h2 id="liens">7. Hyperlinks</h2>
              <p>The site may contain hyperlinks to other websites. EkoLink S.A.S. has no control over these sites and disclaims any responsibility for their content. Setting up a link to the ekolink.dev site is subject to prior authorization.</p>

              <h2 id="credits">8. Credits</h2>
              <ul>
                <li><strong>Design and development:</strong> EkoLink S.A.S.</li>
                <li><strong>Fonts:</strong> Inter (Rasmus Andersson, under SIL Open Font license)</li>
                <li><strong>Icons:</strong> Feather Icons (MIT License) — EkoLink adaptation</li>
              </ul>

              <div className="info-box">
                <strong>Contact</strong>
                For any question regarding this legal notice: <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>
              </div>
            </>
          ) : (
            <>
              <div className="page-toc">
                <h2>Sommaire</h2>
                <ol>
                  <li><a href="#editeur">Éditeur du site</a></li>
                  <li><a href="#hebergeur">Hébergeur</a></li>
                  <li><a href="#publication">Directeur de publication</a></li>
                  <li><a href="#pi">Propriété intellectuelle</a></li>
                  <li><a href="#donnees">Données personnelles</a></li>
                  <li><a href="#cookies">Cookies</a></li>
                  <li><a href="#liens">Liens hypertextes</a></li>
                  <li><a href="#credits">Crédits</a></li>
                </ol>
              </div>

              <h2 id="editeur">1. Éditeur du site</h2>
              <p>Le site <strong>ekolink.dev</strong> est édité par :</p>
              <ul>
                <li><strong>Raison sociale :</strong> EkoLink</li>
                <li><strong>Forme juridique :</strong> Société par Actions Simplifiée (S.A.S.)</li>
                <li><strong>Capital social :</strong> <span className="placeholder">[À COMPLÉTER]</span></li>
                <li><strong>SIRET :</strong> 1179695284</li>
                <li><strong>RCS :</strong> <span className="placeholder">[Paris — à compléter avec le numéro complet]</span></li>
                <li><strong>N° TVA intracommunautaire :</strong> <span className="placeholder">[À COMPLÉTER — FR XX XXXXXXXXX]</span></li>
                <li><strong>Siège social :</strong> 7 Rue Vulpian, 75013 Paris, France</li>
                <li><strong>Téléphone :</strong> <a href="tel:+33617030308">+33&nbsp;6&nbsp;17&nbsp;03&nbsp;03&nbsp;08</a></li>
                <li><strong>Email :</strong> <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a></li>
              </ul>

              <h2 id="hebergeur">2. Hébergeur</h2>
              <p>Le site est hébergé par :</p>
              <ul>
                <li><strong>Nom :</strong> <span className="placeholder">[À COMPLÉTER — ex. Vercel Inc., OVH SAS, Netlify Inc.]</span></li>
                <li><strong>Adresse :</strong> <span className="placeholder">[À COMPLÉTER]</span></li>
                <li><strong>Téléphone :</strong> <span className="placeholder">[À COMPLÉTER]</span></li>
                <li><strong>Site web :</strong> <span className="placeholder">[À COMPLÉTER]</span></li>
              </ul>

              <h2 id="publication">3. Directeur de la publication</h2>
              <p>Monsieur <span className="placeholder">[À COMPLÉTER — nom du dirigeant, probablement Albert Lanne]</span>, en sa qualité de représentant légal d'EkoLink S.A.S.</p>

              <h2 id="pi">4. Propriété intellectuelle</h2>
              <p>L'ensemble du contenu du site ekolink.dev (textes, images, vidéos, logos, illustrations, code source, structure, charte graphique) est la propriété exclusive d'EkoLink S.A.S. ou de ses partenaires, et protégé par les lois françaises et internationales relatives au droit d'auteur et à la propriété intellectuelle.</p>
              <p>Toute reproduction, représentation, modification, publication, transmission ou exploitation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable d'EkoLink S.A.S. Toute exploitation non autorisée constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
              <p>La marque <strong>Google</strong>, <strong>Google Business Profile</strong>, <strong>Google Maps</strong> et leurs logos sont des marques déposées de Google LLC. EkoLink est un partenaire Google indépendant et n'est pas affilié à Google LLC.</p>

              <h2 id="donnees">5. Données personnelles (RGPD)</h2>
              <p>Le traitement des données personnelles collectées sur le site est détaillé dans notre <Link href="/politique-confidentialite">politique de confidentialité</Link>. Conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés modifiée, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données.</p>
              <p>Pour exercer ces droits, contactez-nous à <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> ou par courrier postal à l'adresse du siège social.</p>

              <h2 id="cookies">6. Cookies</h2>
              <p>Le site utilise des cookies pour mesurer son audience et améliorer votre expérience. Vous pouvez consulter et modifier vos préférences via notre <Link href="/politique-cookies">politique des cookies</Link>.</p>

              <h2 id="liens">7. Liens hypertextes</h2>
              <p>Le site peut contenir des liens hypertextes vers d'autres sites internet. EkoLink S.A.S. n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu. La mise en place d'un lien vers le site ekolink.dev est soumise à autorisation préalable.</p>

              <h2 id="credits">8. Crédits</h2>
              <ul>
                <li><strong>Conception et développement :</strong> EkoLink S.A.S.</li>
                <li><strong>Polices :</strong> Inter (Rasmus Andersson, sous licence SIL Open Font)</li>
                <li><strong>Icônes :</strong> Feather Icons (MIT License) — adaptation EkoLink</li>
              </ul>

              <div className="info-box">
                <strong>Contact</strong>
                Pour toute question concernant ces mentions légales : <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>
              </div>
            </>
          )}
        </article>
      </div>
    </main>
  );
}
