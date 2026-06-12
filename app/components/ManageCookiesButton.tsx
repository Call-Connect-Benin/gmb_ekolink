"use client";

import { useTranslations } from "next-intl";

/** M12 — Rouvre la bannière de consentement (CNIL : pouvoir revenir sur son choix). */
export default function ManageCookiesButton() {
  const t = useTranslations("footer");
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("ekolink-open-consent"))}
      className="text-white/55 transition-colors hover:text-white"
    >
      {t("links.manageCookies")}
    </button>
  );
}
