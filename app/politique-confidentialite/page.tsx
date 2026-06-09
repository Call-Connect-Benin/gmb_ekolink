/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import PageHero from "../components/PageHero";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité d'EkoLink : données collectées, finalités, base légale, durées de conservation, vos droits RGPD.",
  alternates: { canonical: "/politique-confidentialite" },
};

export default async function PolitiqueConfidentialite() {
  const en = (await getLocale()) === "en";

  return (
    <main id="main">
      <PageHero
        title={en ? "Privacy policy" : "Politique de confidentialité"}
        lead={en ? "Compliant with the GDPR and the French Data Protection Act. Last updated: May 22, 2026." : "Conforme au RGPD et à la loi Informatique et Libertés. Dernière mise à jour : 22 mai 2026."}
        crumb={en ? "Privacy policy" : "Politique de confidentialité"}
      />

      <div className="container">
        <article className="page-content">
          {en ? (
            <>
              <div className="info-box">
                <strong>In short</strong>{" "}
                We only collect the data needed to provide our services. We never sell it. You can exercise your rights of access, rectification or erasure at any time by writing to{" "}
                <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>.
              </div>

              <h2>1. Data controller</h2>
              <p>The data controller is <strong>EkoLink S.A.S.</strong>, with registered office at 7 Rue Vulpian, 75013 Paris, SIRET 1179695284.</p>
              <p>Contact: <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> — Phone: <a href="tel:+33641479836">+33&nbsp;6&nbsp;41&nbsp;47&nbsp;98&nbsp;36</a></p>
              <p>GDPR / DPO contact: <span className="placeholder">[TO COMPLETE — email of the DPO or the person in charge of data protection]</span></p>

              <h2>2. Personal data collected</h2>
              <p>We collect the following data when you interact with our site:</p>

              <h3>Contact form</h3>
              <ul>
                <li>First and last name</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Company name (optional)</li>
                <li>Subject and message</li>
              </ul>

              <h3>Order funnel</h3>
              <ul>
                <li>Identity (first name, last name)</li>
                <li>Email and phone</li>
                <li>Professional information (company name, sector, business area, address, website URL)</li>
                <li>Payment data (processed directly by our provider Stripe or PayPal — EkoLink stores no card number)</li>
              </ul>

              <h3>Technical data</h3>
              <ul>
                <li>IP address (anonymized)</li>
                <li>Browser type, operating system, screen resolution</li>
                <li>Pages visited, session duration</li>
                <li>Traffic source (only after consent to cookies)</li>
              </ul>

              <h2>3. Purposes of processing</h2>
              <table>
                <thead>
                  <tr><th>Purpose</th><th>Legal basis</th><th>Retention period</th></tr>
                </thead>
                <tbody>
                  <tr><td>Reply to a contact request</td><td>Legitimate interest</td><td>3 years after the last contact</td></tr>
                  <tr><td>Process an order and provide the service</td><td>Performance of the contract</td><td>10 years (accounting obligations)</td></tr>
                  <tr><td>Issue an invoice</td><td>Legal obligation</td><td>10 years</td></tr>
                  <tr><td>Newsletter / commercial prospecting</td><td>Consent</td><td>3 years after the last contact</td></tr>
                  <tr><td>Audience measurement (Google Analytics)</td><td>Consent</td><td>13 months</td></tr>
                  <tr><td>Security and fraud prevention</td><td>Legitimate interest</td><td>1 year</td></tr>
                </tbody>
              </table>

              <h2>4. Data recipients</h2>
              <p>Your data is only accessible to authorized people within EkoLink, as well as our technical subcontractors strictly within the scope of their tasks:</p>
              <ul>
                <li><strong>Host:</strong> <span className="placeholder">[TO COMPLETE]</span> — for hosting the site and keeping server logs;</li>
                <li><strong>Stripe / PayPal:</strong> payment processing (banking data not stored by EkoLink);</li>
                <li><strong>Google:</strong> for creating and optimizing your Google Business listing (with your explicit consent);</li>
                <li><strong>Google Analytics:</strong> anonymized audience measurement, after consent.</li>
              </ul>
              <p>No data is sold or passed on to third parties for commercial purposes.</p>

              <h2>5. Transfer outside the European Union</h2>
              <p>Some of our providers (Google, Stripe) may transfer data to the United States. These transfers are governed by the <strong>Standard Contractual Clauses</strong> of the European Commission and the <strong>EU-US Data Privacy Framework</strong>, ensuring a level of protection equivalent to the GDPR.</p>

              <h2>6. Your rights</h2>
              <p>In accordance with the GDPR, you have the following rights:</p>
              <ul>
                <li><strong>Right of access</strong>: obtain a copy of your data;</li>
                <li><strong>Right of rectification</strong>: correct your data;</li>
                <li><strong>Right to erasure</strong> ("right to be forgotten"): request the deletion of your data;</li>
                <li><strong>Right to portability</strong>: retrieve your data in a structured format;</li>
                <li><strong>Right to object</strong>: object to processing (notably for commercial prospecting);</li>
                <li><strong>Right to restriction</strong>: temporarily restrict processing;</li>
                <li><strong>Right to withdraw your consent</strong> at any time.</li>
              </ul>
              <p>To exercise these rights: <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> or by post to the registered office. We will reply within 30 days maximum. Proof of identity may be requested in case of reasonable doubt.</p>

              <h2>7. Complaint to the CNIL</h2>
              <p>If, after contacting us, you believe your rights are not respected, you can file a complaint with the CNIL (French data protection authority):</p>
              <ul>
                <li>Online: <a href="https://www.cnil.fr/en/plaintes" target="_blank" rel="noopener noreferrer">www.cnil.fr/en/plaintes</a></li>
                <li>By post: 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
              </ul>

              <h2>8. Data security</h2>
              <p>EkoLink implements appropriate technical and organizational measures to ensure the security of your data: HTTPS encryption (TLS 1.3), strong authentication, regular backups, access logging, and training of our team in good security practices.</p>

              <h2>9. Cookies</h2>
              <p>Cookie management is detailed in our <Link href="/politique-cookies">cookie policy</Link>.</p>

              <h2>10. Changes</h2>
              <p>This policy may be modified at any time to remain compliant with the evolution of the law. The date of the last update appears at the top of the document.</p>
            </>
          ) : (
            <>
              <div className="info-box">
                <strong>En résumé</strong>{" "}
                Nous collectons uniquement les données nécessaires à la fourniture de nos services. Nous ne les vendons jamais. Vous pouvez à tout moment exercer vos droits d'accès, rectification ou suppression en nous écrivant à{" "}
                <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>.
              </div>

              <h2>1. Responsable du traitement</h2>
              <p>Le responsable du traitement des données est <strong>EkoLink S.A.S.</strong>, dont le siège social est situé 7 Rue Vulpian, 75013 Paris, SIRET 1179695284.</p>
              <p>Contact : <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> — Téléphone : <a href="tel:+33641479836">+33&nbsp;6&nbsp;41&nbsp;47&nbsp;98&nbsp;36</a></p>
              <p>Contact RGPD / DPO : <span className="placeholder">[À COMPLÉTER — email du DPO ou de la personne en charge de la protection des données]</span></p>

              <h2>2. Données personnelles collectées</h2>
              <p>Nous collectons les données suivantes lorsque vous interagissez avec notre site :</p>

              <h3>Formulaire de contact</h3>
              <ul>
                <li>Prénom et nom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
                <li>Nom de l'entreprise (optionnel)</li>
                <li>Sujet et message</li>
              </ul>

              <h3>Tunnel de commande</h3>
              <ul>
                <li>Identité (prénom, nom)</li>
                <li>Email et téléphone</li>
                <li>Informations professionnelles (raison sociale, secteur, zone d'activité, adresse, URL du site)</li>
                <li>Données de paiement (traitées directement par notre prestataire Stripe ou PayPal — EkoLink ne stocke aucun numéro de carte)</li>
              </ul>

              <h3>Données techniques</h3>
              <ul>
                <li>Adresse IP (anonymisée)</li>
                <li>Type de navigateur, système d'exploitation, résolution d'écran</li>
                <li>Pages visitées, durée des sessions</li>
                <li>Source de trafic (uniquement après consentement aux cookies)</li>
              </ul>

              <h2>3. Finalités du traitement</h2>
              <table>
                <thead>
                  <tr><th>Finalité</th><th>Base légale</th><th>Durée de conservation</th></tr>
                </thead>
                <tbody>
                  <tr><td>Répondre à une demande de contact</td><td>Intérêt légitime</td><td>3 ans après le dernier contact</td></tr>
                  <tr><td>Traiter une commande et fournir le service</td><td>Exécution du contrat</td><td>10 ans (obligations comptables)</td></tr>
                  <tr><td>Émettre une facture</td><td>Obligation légale</td><td>10 ans</td></tr>
                  <tr><td>Newsletter / prospection commerciale</td><td>Consentement</td><td>3 ans après le dernier contact</td></tr>
                  <tr><td>Mesure d'audience (Google Analytics)</td><td>Consentement</td><td>13 mois</td></tr>
                  <tr><td>Sécurité et prévention de la fraude</td><td>Intérêt légitime</td><td>1 an</td></tr>
                </tbody>
              </table>

              <h2>4. Destinataires des données</h2>
              <p>Vos données sont uniquement accessibles aux personnes habilitées au sein d'EkoLink, ainsi qu'à nos sous-traitants techniques dans la limite stricte de leurs missions :</p>
              <ul>
                <li><strong>Hébergeur :</strong> <span className="placeholder">[À COMPLÉTER]</span> — pour l'hébergement du site et la conservation des logs serveur ;</li>
                <li><strong>Stripe / PayPal :</strong> traitement des paiements (données bancaires non stockées par EkoLink) ;</li>
                <li><strong>Google :</strong> pour la création et l'optimisation de votre fiche Google Business (avec votre accord explicite) ;</li>
                <li><strong>Google Analytics :</strong> mesure d'audience anonymisée, après consentement.</li>
              </ul>
              <p>Aucune donnée n'est vendue ni transmise à des tiers à des fins commerciales.</p>

              <h2>5. Transfert hors Union Européenne</h2>
              <p>Certains de nos prestataires (Google, Stripe) peuvent transférer des données vers les États-Unis. Ces transferts sont encadrés par les <strong>Clauses Contractuelles Types</strong> de la Commission européenne et le cadre <strong>EU-US Data Privacy Framework</strong>, garantissant un niveau de protection équivalent au RGPD.</p>

              <h2>6. Vos droits</h2>
              <p>Conformément au RGPD, vous disposez des droits suivants :</p>
              <ul>
                <li><strong>Droit d'accès</strong> : obtenir une copie de vos données ;</li>
                <li><strong>Droit de rectification</strong> : corriger vos données ;</li>
                <li><strong>Droit d'effacement</strong> (« droit à l'oubli ») : demander la suppression de vos données ;</li>
                <li><strong>Droit à la portabilité</strong> : récupérer vos données dans un format structuré ;</li>
                <li><strong>Droit d'opposition</strong> : vous opposer au traitement (notamment pour la prospection commerciale) ;</li>
                <li><strong>Droit à la limitation</strong> : restreindre temporairement le traitement ;</li>
                <li><strong>Droit de retirer votre consentement</strong> à tout moment.</li>
              </ul>
              <p>Pour exercer ces droits : <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> ou par courrier au siège social. Nous vous répondrons sous 30 jours maximum. Une preuve d'identité peut être demandée en cas de doute raisonnable.</p>

              <h2>7. Réclamation auprès de la CNIL</h2>
              <p>Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL :</p>
              <ul>
                <li>En ligne : <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">www.cnil.fr/fr/plaintes</a></li>
                <li>Par courrier : 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
              </ul>

              <h2>8. Sécurité des données</h2>
              <p>EkoLink met en œuvre les mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données : chiffrement HTTPS (TLS 1.3), authentification renforcée, sauvegardes régulières, journalisation des accès, et formation de notre équipe aux bonnes pratiques de sécurité.</p>

              <h2>9. Cookies</h2>
              <p>La gestion des cookies est détaillée dans notre <Link href="/politique-cookies">politique des cookies</Link>.</p>

              <h2>10. Modifications</h2>
              <p>La présente politique peut être modifiée à tout moment pour rester conforme à l'évolution de la législation. La date de dernière mise à jour figure en haut du document.</p>
            </>
          )}
        </article>
      </div>
    </main>
  );
}
