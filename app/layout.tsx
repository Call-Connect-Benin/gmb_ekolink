import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
// globals.css importe Tailwind/shadcn + le CSS d'origine (couche legacy).
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import BackToTop from "./components/BackToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import Analytics from "./components/Analytics";
import SiteChrome from "./components/SiteChrome";

export const metadata: Metadata = {
  metadataBase: new URL("https://ekolink.dev"),
  title: {
    default: "Fiche Google Business optimisée en 48h | EkoLink",
    template: "%s | EkoLink",
  },
  description:
    "EkoLink, agence Google Partner depuis 2015, livre votre fiche Google Business optimisée en 48h. SEO local clé en main, garantie 30 jours.",
  keywords: [
    "fiche google business",
    "google my business",
    "SEO local",
    "référencement local",
    "ekolink",
    "agence google partner",
  ],
  authors: [{ name: "EkoLink S.A.S." }],
  alternates: { canonical: "/" },
  // Favicon / icônes : détectés automatiquement via app/favicon.ico,
  // app/icon.png et app/apple-icon.png (conventions de fichiers Next).
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "EkoLink",
    title: "Fiche Google Business optimisée et prête à l'emploi | EkoLink",
    description:
      "Obtenez une fiche Google Business clé en main, optimisée SEO local et livrée en 48h. Plus de 500 commerces accompagnés.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiche Google Business optimisée et prête à l'emploi",
    description:
      "Obtenez une fiche Google Business clé en main, optimisée SEO local et livrée en 48h.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1A73E8",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-[9999] focus:bg-primary focus:px-5 focus:py-3 focus:text-primary-foreground"
          >
            Aller au contenu principal
          </a>
          <SiteChrome
            header={<Header />}
            footer={<Footer />}
            floating={
              <>
                <CookieBanner />
                <BackToTop />
                <WhatsAppButton />
              </>
            }
          >
            {children}
          </SiteChrome>
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
