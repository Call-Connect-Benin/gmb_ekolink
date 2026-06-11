/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { ScrollText } from "lucide-react";
import { getLocale } from "next-intl/server";
import LegalReader, { type LegalSection } from "../components/LegalReader";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description:
    "Conditions Générales de Vente d'EkoLink pour les services de création et optimisation de fiches Google Business : commande, paiement, livraison, garanties, droit de rétractation.",
  alternates: { canonical: "/cgv" },
};

const FR_SECTIONS: LegalSection[] = [
  {
    id: "preambule",
    label: "Préambule",
    content: (
      <div className="info-box">
        <strong>Préambule</strong>{" "}
        Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations contractuelles entre EkoLink S.A.S., société par actions simplifiée immatriculée au RCS sous le SIRET 1179695284, ayant son siège social au 7 Rue Vulpian, 75013 Paris (ci-après « EkoLink » ou « le Prestataire »), et toute personne physique ou morale qui passe commande sur le site ekolink.dev (ci-après « le Client »).
      </div>
    ),
  },
  {
    id: "art1",
    label: "Objet",
    content: (
      <>
        <h2 id="art1">Article 1 — Objet</h2>
        <p>Les présentes CGV ont pour objet de définir les conditions dans lesquelles EkoLink fournit au Client les services de création, configuration et optimisation de fiches Google Business Profile, ci-après désignés « les Services ».</p>
        <p>Toute commande implique l'acceptation pleine et entière des présentes CGV par le Client.</p>
      </>
    ),
  },
  {
    id: "art2",
    label: "Tarifs",
    content: (
      <>
        <h2 id="art2">Article 2 — Tarifs</h2>
        <p>Les tarifs en vigueur sont indiqués en euros et toutes taxes comprises (TTC) sur le site, à la date de la commande. Trois formules sont proposées :</p>
        <table>
          <thead>
            <tr><th>Formule</th><th>Prix TTC</th><th>Délai</th></tr>
          </thead>
          <tbody>
            <tr><td>Starter</td><td>149&nbsp;€</td><td>72h ouvrées</td></tr>
            <tr><td>Pro</td><td>299&nbsp;€</td><td>48h ouvrées</td></tr>
            <tr><td>Agence (5 fiches)</td><td>599&nbsp;€</td><td>48h ouvrées</td></tr>
          </tbody>
        </table>
        <p>EkoLink se réserve le droit de modifier ses tarifs à tout moment, étant entendu que tout produit sera facturé sur la base du tarif en vigueur au moment de la commande.</p>
      </>
    ),
  },
  {
    id: "art3",
    label: "Commande",
    content: (
      <>
        <h2 id="art3">Article 3 — Commande</h2>
        <p>Le Client passe commande en sélectionnant une formule sur le site, en remplissant le formulaire de commande et en validant le paiement. La validation de la commande emporte acceptation des présentes CGV et de la politique de confidentialité.</p>
        <p>EkoLink confirme la commande par email dans un délai de 24 heures suivant la réception du paiement.</p>
      </>
    ),
  },
  {
    id: "art4",
    label: "Paiement",
    content: (
      <>
        <h2 id="art4">Article 4 — Paiement</h2>
        <p>Le paiement est exigible immédiatement à la commande. Les moyens de paiement acceptés sont :</p>
        <ul>
          <li>Carte bancaire (Visa, Mastercard, American Express) via Stripe ;</li>
          <li>PayPal ;</li>
          <li>Virement bancaire (sur demande, délai de traitement majoré).</li>
        </ul>
        <p>Les transactions par carte bancaire sont sécurisées par le protocole TLS 1.3 et 3D Secure. EkoLink ne conserve aucune donnée bancaire.</p>
      </>
    ),
  },
  {
    id: "art5",
    label: "Livraison",
    content: (
      <>
        <h2 id="art5">Article 5 — Livraison</h2>
        <p>La livraison de la fiche Google Business optimisée est effectuée par voie électronique. Elle débute à compter de la réception par EkoLink de l'ensemble des informations nécessaires fournies par le Client (informations légales, photos, identifiants Google).</p>
        <p>Les délais de livraison sont indicatifs et calculés en jours ouvrés. En cas de retard supérieur à 48 heures par rapport au délai annoncé et imputable à EkoLink, le Client bénéficie d'un remboursement automatique de 25% du montant de sa commande.</p>
      </>
    ),
  },
  {
    id: "art6",
    label: "Garantie 30 jours",
    content: (
      <>
        <h2 id="art6">Article 6 — Garantie satisfait ou remboursé 30 jours</h2>
        <p>EkoLink propose une garantie « satisfait ou remboursé » d'une durée de <strong>30 jours calendaires</strong> à compter de la date de livraison de la fiche. Si le Client n'est pas satisfait du Service, il peut demander le remboursement intégral par simple email à <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>, sans aucune justification à fournir.</p>
        <p>Le remboursement est effectué sous 14 jours via le même moyen de paiement que celui utilisé lors de la commande.</p>
      </>
    ),
  },
  {
    id: "art7",
    label: "Droit de rétractation",
    content: (
      <>
        <h2 id="art7">Article 7 — Droit de rétractation</h2>
        <p>Conformément à l'article L221-18 du Code de la consommation, le Client consommateur dispose d'un délai de rétractation de <strong>14 jours</strong> à compter de la conclusion du contrat pour exercer son droit de rétractation, sans avoir à justifier de motif.</p>
        <p>Toutefois, conformément à l'article L221-28 du même Code, le droit de rétractation ne peut être exercé pour les services pleinement exécutés avant la fin de ce délai, dès lors que le Client a expressément renoncé à son droit de rétractation au moment de la commande. La garantie satisfait ou remboursé 30 jours (article 6) reste applicable dans tous les cas.</p>
      </>
    ),
  },
  {
    id: "art8",
    label: "Responsabilité",
    content: (
      <>
        <h2 id="art8">Article 8 — Responsabilité</h2>
        <p>EkoLink s'engage à fournir des Services conformes aux règles de l'art et aux Guidelines Google Business Profile. La responsabilité d'EkoLink ne saurait être engagée en cas de :</p>
        <ul>
          <li>Modification ultérieure de la fiche par le Client ou un tiers ;</li>
          <li>Suspension de la fiche par Google pour non-respect des règles d'utilisation par le Client ;</li>
          <li>Variation de positionnement liée aux mises à jour de l'algorithme Google ;</li>
          <li>Fourniture par le Client d'informations inexactes ou incomplètes.</li>
        </ul>
        <p>En tout état de cause, la responsabilité d'EkoLink est limitée au montant de la commande concernée.</p>
      </>
    ),
  },
  {
    id: "art9",
    label: "Propriété intellectuelle",
    content: (
      <>
        <h2 id="art9">Article 9 — Propriété intellectuelle</h2>
        <p>Les textes, descriptions, contenus et matériels créés par EkoLink dans le cadre des Services sont la propriété d'EkoLink jusqu'au paiement intégral du prix. Au paiement complet, ces éléments sont cédés au Client pour son usage exclusif sur sa fiche Google. Le Client ne peut revendre ou reproduire ces éléments sur d'autres supports sans autorisation écrite préalable.</p>
      </>
    ),
  },
  {
    id: "art10",
    label: "Données personnelles",
    content: (
      <>
        <h2 id="art10">Article 10 — Données personnelles</h2>
        <p>Le traitement des données personnelles est régi par notre <Link href="/politique-confidentialite">politique de confidentialité</Link>, conforme au RGPD.</p>
      </>
    ),
  },
  {
    id: "art11",
    label: "Force majeure",
    content: (
      <>
        <h2 id="art11">Article 11 — Force majeure</h2>
        <p>EkoLink ne saurait être tenu pour responsable de l'inexécution de l'une de ses obligations en cas de force majeure au sens de l'article 1218 du Code civil, notamment en cas de panne généralisée des services Google.</p>
      </>
    ),
  },
  {
    id: "art12",
    label: "Loi applicable & litiges",
    content: (
      <>
        <h2 id="art12">Article 12 — Loi applicable et règlement des litiges</h2>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, le Client est invité à contacter EkoLink à <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> en vue d'une résolution amiable.</p>
        <p>À défaut de résolution amiable, le Client consommateur peut recourir gratuitement au médiateur de la consommation suivant : <strong>Médiateur du e-commerce de la FEVAD</strong>, BP 20015, 75362 Paris Cedex 08 — <a href="https://www.mediateurfevad.fr" target="_blank" rel="noopener noreferrer">www.mediateurfevad.fr</a>.</p>
        <p>À défaut, et conformément à l'article 14 du Règlement (UE) n°524/2013, la Commission européenne met à disposition une plateforme de Règlement en Ligne des Litiges (RLL) accessible à l'adresse : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>
        <p>En dernier recours, tout litige relèvera de la compétence exclusive des tribunaux du ressort de Paris.</p>
      </>
    ),
  },
  {
    id: "acceptation",
    label: "Acceptation",
    content: (
      <div className="info-box">
        <strong>Acceptation</strong>{" "}
        En validant votre commande sur ekolink.dev, vous reconnaissez avoir lu et accepté les présentes Conditions Générales de Vente dans leur intégralité.
      </div>
    ),
  },
];

const EN_SECTIONS: LegalSection[] = [
  {
    id: "preambule",
    label: "Preamble",
    content: (
      <div className="info-box">
        <strong>Preamble</strong>{" "}
        These Terms and Conditions of Sale (T&Cs) govern all the contractual relationships between EkoLink S.A.S., a simplified joint-stock company registered with the trade register under SIRET 1179695284, with its registered office at 7 Rue Vulpian, 75013 Paris (hereinafter "EkoLink" or "the Provider"), and any natural or legal person who places an order on the ekolink.dev site (hereinafter "the Client").
      </div>
    ),
  },
  {
    id: "art1",
    label: "Purpose",
    content: (
      <>
        <h2 id="art1">Article 1 — Purpose</h2>
        <p>The purpose of these T&Cs is to define the conditions under which EkoLink provides the Client with the services of creating, configuring and optimizing Google Business Profile listings, hereinafter referred to as "the Services".</p>
        <p>Any order implies the Client's full and unreserved acceptance of these T&Cs.</p>
      </>
    ),
  },
  {
    id: "art2",
    label: "Pricing",
    content: (
      <>
        <h2 id="art2">Article 2 — Pricing</h2>
        <p>The prices in force are shown in euros, all taxes included, on the site, on the order date. Three plans are offered:</p>
        <table>
          <thead>
            <tr><th>Plan</th><th>Price incl. tax</th><th>Lead time</th></tr>
          </thead>
          <tbody>
            <tr><td>Starter</td><td>149&nbsp;€</td><td>72 business hours</td></tr>
            <tr><td>Pro</td><td>299&nbsp;€</td><td>48 business hours</td></tr>
            <tr><td>Agency (5 listings)</td><td>599&nbsp;€</td><td>48 business hours</td></tr>
          </tbody>
        </table>
        <p>EkoLink reserves the right to change its prices at any time, it being understood that any product will be billed on the basis of the price in force at the time of the order.</p>
      </>
    ),
  },
  {
    id: "art3",
    label: "Order",
    content: (
      <>
        <h2 id="art3">Article 3 — Order</h2>
        <p>The Client places an order by selecting a plan on the site, filling in the order form and validating the payment. Validating the order entails acceptance of these T&Cs and of the privacy policy.</p>
        <p>EkoLink confirms the order by email within 24 hours of receiving the payment.</p>
      </>
    ),
  },
  {
    id: "art4",
    label: "Payment",
    content: (
      <>
        <h2 id="art4">Article 4 — Payment</h2>
        <p>Payment is due immediately upon ordering. The accepted payment methods are:</p>
        <ul>
          <li>Card (Visa, Mastercard, American Express) via Stripe;</li>
          <li>PayPal;</li>
          <li>Bank transfer (on request, with extended processing time).</li>
        </ul>
        <p>Card transactions are secured by the TLS 1.3 and 3D Secure protocols. EkoLink keeps no banking data.</p>
      </>
    ),
  },
  {
    id: "art5",
    label: "Delivery",
    content: (
      <>
        <h2 id="art5">Article 5 — Delivery</h2>
        <p>The delivery of the optimized Google Business listing is carried out electronically. It begins from the moment EkoLink receives all the necessary information provided by the Client (legal information, photos, Google credentials).</p>
        <p>Delivery times are indicative and calculated in business days. In the event of a delay of more than 48 hours from the announced time and attributable to EkoLink, the Client benefits from an automatic refund of 25% of the order amount.</p>
      </>
    ),
  },
  {
    id: "art6",
    label: "30-day guarantee",
    content: (
      <>
        <h2 id="art6">Article 6 — 30-day satisfaction-or-refund guarantee</h2>
        <p>EkoLink offers a "satisfaction or refund" guarantee for a period of <strong>30 calendar days</strong> from the date of delivery of the listing. If the Client is not satisfied with the Service, they may request a full refund by simple email to <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a>, with no justification required.</p>
        <p>The refund is made within 14 days using the same payment method as the one used for the order.</p>
      </>
    ),
  },
  {
    id: "art7",
    label: "Right of withdrawal",
    content: (
      <>
        <h2 id="art7">Article 7 — Right of withdrawal</h2>
        <p>In accordance with article L221-18 of the French Consumer Code, the consumer Client has a withdrawal period of <strong>14 days</strong> from the conclusion of the contract to exercise their right of withdrawal, without having to give a reason.</p>
        <p>However, in accordance with article L221-28 of the same Code, the right of withdrawal cannot be exercised for services fully performed before the end of this period, where the Client has expressly waived their right of withdrawal at the time of the order. The 30-day satisfaction-or-refund guarantee (article 6) remains applicable in all cases.</p>
      </>
    ),
  },
  {
    id: "art8",
    label: "Liability",
    content: (
      <>
        <h2 id="art8">Article 8 — Liability</h2>
        <p>EkoLink undertakes to provide Services that comply with the state of the art and the Google Business Profile Guidelines. EkoLink cannot be held liable in the event of:</p>
        <ul>
          <li>Subsequent modification of the listing by the Client or a third party;</li>
          <li>Suspension of the listing by Google for non-compliance with the rules of use by the Client;</li>
          <li>Ranking variation related to updates of the Google algorithm;</li>
          <li>The Client providing inaccurate or incomplete information.</li>
        </ul>
        <p>In any event, EkoLink's liability is limited to the amount of the order concerned.</p>
      </>
    ),
  },
  {
    id: "art9",
    label: "Intellectual property",
    content: (
      <>
        <h2 id="art9">Article 9 — Intellectual property</h2>
        <p>The texts, descriptions, content and materials created by EkoLink as part of the Services are the property of EkoLink until full payment of the price. Upon full payment, these elements are assigned to the Client for their exclusive use on their Google listing. The Client may not resell or reproduce these elements on other media without prior written authorization.</p>
      </>
    ),
  },
  {
    id: "art10",
    label: "Personal data",
    content: (
      <>
        <h2 id="art10">Article 10 — Personal data</h2>
        <p>The processing of personal data is governed by our <Link href="/politique-confidentialite">privacy policy</Link>, compliant with the GDPR.</p>
      </>
    ),
  },
  {
    id: "art11",
    label: "Force majeure",
    content: (
      <>
        <h2 id="art11">Article 11 — Force majeure</h2>
        <p>EkoLink cannot be held liable for the non-performance of any of its obligations in the event of force majeure within the meaning of article 1218 of the French Civil Code, in particular in the event of a generalized outage of Google services.</p>
      </>
    ),
  },
  {
    id: "art12",
    label: "Law & disputes",
    content: (
      <>
        <h2 id="art12">Article 12 — Applicable law and dispute resolution</h2>
        <p>These T&Cs are governed by French law. In the event of a dispute, the Client is invited to contact EkoLink at <a href="mailto:contact@ekolink.fr">contact@ekolink.fr</a> with a view to an amicable resolution.</p>
        <p>Failing an amicable resolution, the consumer Client may use, free of charge, the following consumer mediator: <strong>FEVAD e-commerce Mediator</strong>, BP 20015, 75362 Paris Cedex 08 — <a href="https://www.mediateurfevad.fr" target="_blank" rel="noopener noreferrer">www.mediateurfevad.fr</a>.</p>
        <p>Failing that, and in accordance with article 14 of Regulation (EU) No. 524/2013, the European Commission provides an Online Dispute Resolution (ODR) platform accessible at: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.</p>
        <p>As a last resort, any dispute will fall under the exclusive jurisdiction of the courts of Paris.</p>
      </>
    ),
  },
  {
    id: "acceptation",
    label: "Acceptance",
    content: (
      <div className="info-box">
        <strong>Acceptance</strong>{" "}
        By validating your order on ekolink.dev, you acknowledge having read and accepted these Terms and Conditions of Sale in their entirety.
      </div>
    ),
  },
];

export default async function Cgv() {
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
            <ScrollText className="size-3.5" /> {en ? "Legal document" : "Document légal"}
          </span>
          <h1 className="mt-5 text-[clamp(2.2rem,4.4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight">
            {en ? (
              <>Terms &amp; Conditions <span className="text-primary">of Sale</span></>
            ) : (
              <>Conditions Générales <span className="text-primary">de Vente</span></>
            )}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            {en ? "Version in force since May 22, 2026." : "Version en vigueur depuis le 22 mai 2026."}
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
