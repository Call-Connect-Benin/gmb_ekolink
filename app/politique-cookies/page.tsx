/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Cookie } from "lucide-react";
import { getLocale } from "next-intl/server";
import LegalReader, { type LegalSection } from "../components/LegalReader";

export const metadata: Metadata = {
  title: "Politique des cookies",
  description:
    "Quels cookies utilise EkoLink, à quoi servent-ils, comment les refuser ou les configurer. Conformité RGPD et recommandations CNIL.",
  alternates: { canonical: "/politique-cookies" },
};

const FR_SECTIONS: LegalSection[] = [
  {
    id: "definition",
    label: "Qu'est-ce qu'un cookie ?",
    content: (
      <>
        <h2>1. Qu'est-ce qu'un cookie ?</h2>
        <p>Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site. Il permet au site de mémoriser certaines informations (préférences, statistiques anonymes, identifiant de session…). Aucun cookie ne nous permet de récupérer des informations personnelles que vous n'avez pas vous-même fournies.</p>
      </>
    ),
  },
  {
    id: "utilises",
    label: "Cookies utilisés",
    content: (
      <>
        <h2>2. Cookies utilisés sur ekolink.dev</h2>

        <h3>Cookies strictement nécessaires (exemptés de consentement)</h3>
        <table>
          <thead>
            <tr><th>Nom</th><th>Émetteur</th><th>Finalité</th><th>Durée</th></tr>
          </thead>
          <tbody>
            <tr><td><code>fb_consent_v1</code></td><td>EkoLink</td><td>Mémoriser votre choix sur les cookies</td><td>13 mois</td></tr>
            <tr><td><code>ek_form_token</code></td><td>EkoLink</td><td>Protection anti-CSRF des formulaires (sessionStorage)</td><td>Session</td></tr>
          </tbody>
        </table>

        <h3>Cookies de mesure d'audience (soumis à consentement)</h3>
        <table>
          <thead>
            <tr><th>Nom</th><th>Émetteur</th><th>Finalité</th><th>Durée</th></tr>
          </thead>
          <tbody>
            <tr><td><code>_ga</code></td><td>Google Analytics 4</td><td>Identifier un visiteur unique (anonymisé)</td><td>13 mois</td></tr>
            <tr><td><code>_ga_*</code></td><td>Google Analytics 4</td><td>Conserver l'état de session</td><td>13 mois</td></tr>
          </tbody>
        </table>
        <p>Ces cookies ne sont déposés qu'après votre acceptation explicite via le bandeau de consentement. Tant que vous n'avez pas accepté, aucun cookie de mesure d'audience n'est créé.</p>
      </>
    ),
  },
  {
    id: "choix",
    label: "Exprimer votre choix",
    content: (
      <>
        <h2>3. Comment exprimer votre choix ?</h2>
        <p>Lors de votre première visite, un bandeau s'affiche en bas de l'écran et vous propose deux options claires :</p>
        <ul>
          <li><strong>Tout accepter</strong> : autorise les cookies de mesure d'audience ;</li>
          <li><strong>Refuser</strong> : aucun cookie non-essentiel n'est déposé.</li>
        </ul>
        <p>Votre choix est conservé pendant 13 mois. Pour modifier votre choix, supprimez les cookies de notre site dans votre navigateur — le bandeau réapparaîtra lors de votre prochaine visite.</p>

        <div className="info-box">
          <strong>Refuser n'a aucun impact sur l'usage du site</strong>
          {" "}Notre site fonctionne intégralement sans cookies de mesure d'audience. Vous ne perdez aucune fonctionnalité en refusant.
        </div>
      </>
    ),
  },
  {
    id: "desactiver",
    label: "Désactiver les cookies",
    content: (
      <>
        <h2>4. Désactiver les cookies depuis votre navigateur</h2>
        <p>Tous les navigateurs modernes permettent de désactiver les cookies. Cliquez sur le navigateur que vous utilisez :</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari (macOS)</a></li>
          <li><a href="https://support.microsoft.com/fr-fr/windows/supprimer-et-g%C3%A9rer-les-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>
      </>
    ),
  },
  {
    id: "tiers",
    label: "Cookies tiers",
    content: (
      <>
        <h2>5. Cookies tiers</h2>
        <p>Le site ne charge <strong>aucun</strong> service tiers (réseaux sociaux, vidéos embarquées, polices Google Fonts) tant que vous n'avez pas accepté les cookies. Les polices sont auto-hébergées et aucune balise tierce n'est présente par défaut.</p>
      </>
    ),
  },
  {
    id: "savoir-plus",
    label: "Pour en savoir plus",
    content: (
      <>
        <h2>6. Pour en savoir plus</h2>
        <p>Pour toute question relative aux cookies, contactez-nous à <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>. Vous pouvez également consulter le guide CNIL : <a href="https://www.cnil.fr/fr/cookies-et-traceurs" target="_blank" rel="noopener noreferrer">www.cnil.fr/fr/cookies-et-traceurs</a>.</p>
      </>
    ),
  },
];

const EN_SECTIONS: LegalSection[] = [
  {
    id: "definition",
    label: "What is a cookie?",
    content: (
      <>
        <h2>1. What is a cookie?</h2>
        <p>A cookie is a small text file placed on your device (computer, tablet, smartphone) when you visit a site. It allows the site to remember certain information (preferences, anonymous statistics, session ID…). No cookie lets us retrieve personal information that you have not provided yourself.</p>
      </>
    ),
  },
  {
    id: "utilises",
    label: "Cookies used",
    content: (
      <>
        <h2>2. Cookies used on ekolink.dev</h2>

        <h3>Strictly necessary cookies (exempt from consent)</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Issuer</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td><code>fb_consent_v1</code></td><td>EkoLink</td><td>Remember your cookie choice</td><td>13 months</td></tr>
            <tr><td><code>ek_form_token</code></td><td>EkoLink</td><td>Anti-CSRF form protection (sessionStorage)</td><td>Session</td></tr>
          </tbody>
        </table>

        <h3>Audience measurement cookies (subject to consent)</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Issuer</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr><td><code>_ga</code></td><td>Google Analytics 4</td><td>Identify a unique visitor (anonymized)</td><td>13 months</td></tr>
            <tr><td><code>_ga_*</code></td><td>Google Analytics 4</td><td>Keep the session state</td><td>13 months</td></tr>
          </tbody>
        </table>
        <p>These cookies are only placed after your explicit acceptance via the consent banner. As long as you have not accepted, no audience measurement cookie is created.</p>
      </>
    ),
  },
  {
    id: "choix",
    label: "Your choice",
    content: (
      <>
        <h2>3. How to express your choice?</h2>
        <p>On your first visit, a banner appears at the bottom of the screen and offers two clear options:</p>
        <ul>
          <li><strong>Accept all</strong>: allows audience measurement cookies;</li>
          <li><strong>Decline</strong>: no non-essential cookie is placed.</li>
        </ul>
        <p>Your choice is kept for 13 months. To change your choice, delete our site's cookies in your browser — the banner will reappear on your next visit.</p>

        <div className="info-box">
          <strong>Declining has no impact on using the site</strong>
          {" "}Our site works fully without audience measurement cookies. You lose no feature by declining.
        </div>
      </>
    ),
  },
  {
    id: "desactiver",
    label: "Disabling cookies",
    content: (
      <>
        <h2>4. Disabling cookies from your browser</h2>
        <p>All modern browsers allow you to disable cookies. Click on the browser you use:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/en-us/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari (macOS)</a></li>
          <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>
      </>
    ),
  },
  {
    id: "tiers",
    label: "Third-party cookies",
    content: (
      <>
        <h2>5. Third-party cookies</h2>
        <p>The site loads <strong>no</strong> third-party service (social networks, embedded videos, Google Fonts) until you have accepted cookies. Fonts are self-hosted and no third-party tag is present by default.</p>
      </>
    ),
  },
  {
    id: "savoir-plus",
    label: "Learn more",
    content: (
      <>
        <h2>6. Learn more</h2>
        <p>For any question about cookies, contact us at <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>. You can also consult the CNIL guide: <a href="https://www.cnil.fr/en/cookies-and-other-tracking-devices" target="_blank" rel="noopener noreferrer">www.cnil.fr/en/cookies-and-other-tracking-devices</a>.</p>
      </>
    ),
  },
];

export default async function PolitiqueCookies() {
  const en = (await getLocale()) === "en";

  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f4f8ff_100%)] pb-14 pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-5rem] top-8 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,#e3edff,transparent_60%)] lg:block" />
          <div className="absolute bottom-[-3rem] left-[-4rem] hidden h-64 w-64 rounded-full bg-[radial-gradient(circle,#fff1dc,transparent_62%)] lg:block" />
        </div>
        <div className="relative mx-auto max-w-[900px] px-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Cookie className="size-3.5" /> {en ? "Cookies" : "Cookies"}
          </span>
          <h1 className="mt-5 text-[clamp(2.2rem,4.4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight">
            {en ? (
              <>Cookie <span className="text-primary">policy</span></>
            ) : (
              <>Politique des <span className="text-primary">cookies</span></>
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {en
              ? "Which cookies we use, why, and how to decline. Last updated: May 22, 2026."
              : "Quels cookies nous utilisons, pourquoi, et comment refuser. Dernière mise à jour : 22 mai 2026."}
          </p>
        </div>
      </section>

      <LegalReader
        sections={en ? EN_SECTIONS : FR_SECTIONS}
        tocTitle={en ? "Contents" : "Sommaire"}
        prevLabel={en ? "Previous" : "Précédent"}
        nextLabel={en ? "Next" : "Suivant"}
      />
    </main>
  );
}
