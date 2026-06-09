import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Commander votre fiche Google optimisée",
  description:
    "Commandez votre fiche Google Business optimisée en 3 étapes. Livraison 48h. Paiement sécurisé. Garantie satisfait ou remboursé 30 jours.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/commander" },
};

export default function Commander() {
  return (
    <main id="main">
      <PageHero
        title="Commandez votre fiche Google"
        lead="3 étapes simples. Livraison sous 48 heures. Paiement 100% sécurisé."
        crumb="Commander"
      />
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <CheckoutForm />
        </div>
      </section>
    </main>
  );
}
