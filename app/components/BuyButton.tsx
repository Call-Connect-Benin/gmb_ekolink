"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";

export default function BuyButton({
  listingId,
  slug,
  className = "",
  label,
}: {
  listingId: string;
  slug: string;
  className?: string;
  label?: string;
}) {
  const t = useTranslations("common");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoStarted = useRef(false);

  const buy = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (res.status === 401) {
        // Non authentifié → inscription, puis retour ici avec ?buy=1 pour relancer le paiement.
        const next = encodeURIComponent(`/fiches-google/${slug}?buy=1`);
        router.push(`/inscription?next=${next}`);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("errGeneric"));
      if (data.url) {
        window.location.href = data.url as string;
        return;
      }
      throw new Error(t("sessionUnavailable"));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errGeneric"));
      setLoading(false);
    }
  };

  // Retour d'inscription/connexion : ?buy=1 relance automatiquement le paiement.
  useEffect(() => {
    if (autoStarted.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("buy") === "1") {
      autoStarted.current = true;
      buy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={buy}
        disabled={loading}
        className={className || "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-70"}
      >
        <ShoppingCart className="size-4" /> {loading ? t("buyRedirecting") : (label ?? t("buyNow"))}
      </button>
      {error && (
        <p className="mt-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>
      )}
    </>
  );
}
