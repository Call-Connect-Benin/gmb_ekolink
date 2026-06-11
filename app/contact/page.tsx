/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, Timer, MessageSquare } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
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
    telephone: "+33-6-17-03-03-08",
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
  const en = (await getLocale()) === "en";
  const coords = [
    { icon: Mail, t: t("email"), v: <a href="mailto:contact@ekolink.fr" className="text-primary hover:underline">contact@ekolink.fr</a> },
    { icon: Phone, t: t("phone"), v: <a href="tel:+33617030308" className="text-primary hover:underline">+33 6 17 03 03 08</a> },
    { icon: MapPin, t: t("address"), v: <>{t("addressVal1")}<br />{t("addressVal2")}<br />{t("addressVal3")}</> },
    { icon: Clock, t: t("hours"), v: <>{t("hoursVal1")}<br />{t("hoursVal2")}</> },
    { icon: Timer, t: t("responseGuaranteed"), v: t("responseVal") },
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main">
        <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f4f8ff_100%)] pb-14 pt-28">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute right-[-5rem] top-8 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,#e3edff,transparent_60%)] lg:block" />
            <div className="absolute bottom-[-3rem] left-[-4rem] hidden h-64 w-64 rounded-full bg-[radial-gradient(circle,#fff1dc,transparent_62%)] lg:block" />
          </div>
          <div className="relative mx-auto max-w-[900px] px-5 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <MessageSquare className="size-3.5" /> {t("crumb")}
            </span>
            <h1 className="mt-5 text-[clamp(2.2rem,4.4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight">
              {en ? (
                <>Contact <span className="text-primary">EkoLink</span></>
              ) : (
                <>Contactez <span className="text-primary">EkoLink</span></>
              )}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{t("heroLead")}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="mx-auto grid max-w-[1200px] items-start gap-8 px-5 lg:grid-cols-[1.4fr_1fr]">
            <ContactForm />

            <aside className="rounded-xl border border-border bg-secondary/40 p-7">
              <h2 className="mb-5 text-xl font-bold">{t("coordsTitle")}</h2>
              <div className="flex flex-col gap-5 text-sm">
                {coords.map((it) => (
                  <div key={it.t} className="flex gap-3">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <it.icon className="size-4.5 text-primary" />
                    </span>
                    <div>
                      <strong className="block">{it.t}</strong>
                      <span className="text-muted-foreground">{it.v}</span>
                    </div>
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
