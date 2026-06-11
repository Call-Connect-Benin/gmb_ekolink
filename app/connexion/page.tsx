/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import SigninForm from "./SigninForm";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace client EkoLink.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/connexion" },
};

export default function Connexion() {
  const t = useTranslations("auth");
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-[#eef2f7] px-4 py-3">
      <div style={{ zoom: 0.9 }} className="w-full max-w-[460px] rounded-3xl border border-border bg-white p-5 shadow-[0_20px_60px_rgba(11,18,28,0.08)] sm:p-6">
        <div className="text-center">
          <img src="/assets/icons/logo-tight.png" alt="" className="mx-auto h-7 w-auto" />
          <p className="mt-1.5 text-sm font-bold text-primary">{t("welcomeBack")}</p>
          <h1 className="text-2xl font-extrabold tracking-tight">{t("signinTitle")}</h1>
          <p className="mx-auto mt-1 max-w-xs text-[13px] leading-[18px] text-muted-foreground">{t("signinIntro")}</p>
        </div>

        <SigninForm />

        <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-primary/[0.06] px-3 py-2">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground"><span className="font-bold text-primary">{t("secureTitle")}</span> — {t("secureText")}</p>
        </div>

        <p className="mt-2.5 text-center text-sm text-muted-foreground">{t("noAccountQ")} <Link href="/inscription" className="font-bold text-primary hover:underline">{t("signupTitle")}</Link></p>
      </div>
    </main>
  );
}
