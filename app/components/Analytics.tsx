"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CONSENT_KEY = "ekolink_consent_v1";

/**
 * Google Analytics 4 (CDC §3.4) — chargé UNIQUEMENT après consentement explicite
 * (RGPD). Écoute l'événement `ekolink-consent` émis par la bannière cookies.
 */
export default function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!GA_ID) return;
    const check = () => {
      try {
        const c = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
        setAllowed(c?.value === "accept");
      } catch {
        setAllowed(false);
      }
    };
    check();
    window.addEventListener("storage", check);
    window.addEventListener("ekolink-consent", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("ekolink-consent", check);
    };
  }, []);

  if (!GA_ID || !allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
