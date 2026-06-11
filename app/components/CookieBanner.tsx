"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

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
      aria-label={t("cookieTitle")}
      className="fixed inset-x-3 bottom-4 z-[1100] mx-auto max-w-[620px] rounded-[1.6rem] border border-white/10 bg-[#0b1220]/95 px-5 py-4 text-white shadow-[0_24px_60px_rgba(8,22,48,0.5)] backdrop-blur-md md:px-6"
    >
      <div className="flex flex-col items-center gap-3.5 sm:flex-row sm:justify-between sm:gap-5">
        <p className="text-center text-[13px] leading-6 text-white/70 sm:text-left">
          {t("cookieText")}{" "}
          <Link href="/politique-cookies" className="font-semibold text-accent underline-offset-2 hover:underline">
            {t("cookieLearnMore")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2.5">
          <button
            type="button"
            onClick={() => choose("reject")}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90 transition hover:bg-white/10"
          >
            {t("cookieReject")}
          </button>
          <button
            type="button"
            onClick={() => choose("accept")}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white shadow-[0_8px_22px_rgba(26,115,232,0.4)] transition hover:bg-primary/90"
          >
            {t("cookieAccept")}
          </button>
        </div>
      </div>
    </div>
  );
}
