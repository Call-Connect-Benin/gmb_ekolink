/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PageHero from "../components/PageHero";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — EkoLink, agence Google Partner à Paris",
  description:
    "Une question sur votre fiche Google Business ? Contactez EkoLink, agence digitale Google Partner basée à Paris. Réponse sous 24 heures ouvrées.",
  alternates: { canonical: "/contact" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact EkoLink",
  url: "https://ekolink.dev/contact",
  mainEntity: {
    "@type": "Organization",
    name: "EkoLink",
    telephone: "+33-6-41-47-98-36",
    email: "contact@ekolink.fr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "7 Rue Vulpian",
      addressLocality: "Paris",
      postalCode: "75013",
      addressCountry: "FR",
    },
  },
};

export default async function Contact() {
  const t = await getTranslations("contact");
  const coords = [
    { t: t("email"), v: <a href="mailto:contact@ekolink.fr" className="text-primary hover:underline">contact@ekolink.fr</a> },
    { t: t("phone"), v: <a href="tel:+33641479836" className="text-primary hover:underline">+33 6 41 47 98 36</a> },
    { t: t("address"), v: <>{t("addressVal1")}<br />{t("addressVal2")}<br />{t("addressVal3")}</> },
    { t: t("hours"), v: <>{t("hoursVal1")}<br />{t("hoursVal2")}</> },
    { t: t("responseGuaranteed"), v: t("responseVal") },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main">
        <PageHero
          title={t("heroTitle")}
          lead={t("heroLead")}
          crumb={t("crumb")}
        />

        <section className="py-12">
          <div className="mx-auto grid max-w-[1200px] items-start gap-8 px-5 lg:grid-cols-[1.4fr_1fr]">
            <ContactForm />

            <aside className="rounded-xl border border-border bg-secondary/40 p-7">
              <h2 className="mb-5 text-xl font-bold">{t("coordsTitle")}</h2>
              <div className="flex flex-col gap-5 text-sm">
                {coords.map((it) => (
                  <div key={it.t}>
                    <strong className="block">{it.t}</strong>
                    <span className="text-muted-foreground">{it.v}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
