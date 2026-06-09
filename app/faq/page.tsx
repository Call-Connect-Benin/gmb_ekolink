import type { Metadata } from "next";

import FaqClient from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQ - Questions fréquentes",
  description:
    "Trouvez rapidement les réponses aux questions les plus courantes sur EkoLink : achat, paiement, transfert, garanties et assistance.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return <FaqClient />;
}
