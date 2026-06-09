"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "ekolink_consent_v1";

export default function CookieBanner() {
  const t = useTranslations("common");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let stored: unknown = null;
    try {
      stored = JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
    } catch {
      stored = null;
    }
    if (stored) return;
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const choose = (value: "accept" | "reject") => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ value, date: new Date().toISOString() })
      );
    } catch {
      /* localStorage indisponible */
    }
    window.dispatchEvent(new Event("ekolink-consent"));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      className="fixed inset-x-5 bottom-5 z-[1100] mx-auto max-w-[720px] rounded-2xl border border-border bg-card p-5 shadow-[0_24px_54px_rgba(17,42,78,0.18)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0">
          <strong id="cookie-title" className="mb-1 block">{t("cookieTitle")}</strong>
          <p className="max-w-[480px] text-sm text-muted-foreground">{t("cookieText")}</p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="outline" onClick={() => choose("reject")}>{t("cookieReject")}</Button>
          <Button onClick={() => choose("accept")}>{t("cookieAccept")}</Button>
        </div>
      </div>
    </div>
  );
}
