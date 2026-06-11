/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import ForgotForm from "./ForgotForm";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez le mot de passe de votre compte EkoLink.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/mot-de-passe-oublie" },
};

export default function MotDePasseOublie() {
  const t = useTranslations("auth");
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-[#eef2f7] px-4 py-10">
      <div className="w-full max-w-[480px] rounded-3xl border border-border bg-white p-8 shadow-[0_20px_60px_rgba(11,18,28,0.08)] sm:p-10">
        <div className="text-center">
          <img src="/assets/icons/logo-tight.png" alt="" className="mx-auto h-9 w-auto" />
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{t("forgotTitle")}</h1>
          <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{t("forgotIntro")}</p>
        </div>

        <ForgotForm />
      </div>
    </main>
  );
}
