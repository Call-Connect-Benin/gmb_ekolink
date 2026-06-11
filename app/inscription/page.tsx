/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte EkoLink pour consulter et acheter des fiches Google Business prêtes à l'emploi.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/inscription" },
};

export default function Inscription() {
  const t = useTranslations("auth");
  return (
    <main id="main" className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eef4ff_0%,#ffffff_45%,#fff6ec_100%)] px-4 pb-16 pt-28">
      <div className="absolute left-10 top-40 size-60 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 size-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative mx-auto w-full max-w-[760px] rounded-3xl border border-border bg-white/90 p-8 shadow-[0_24px_70px_rgba(11,18,28,0.1)] backdrop-blur sm:p-10">
        <div className="text-center">
          <img src="/assets/icons/logo-tight.png" alt="" className="mx-auto h-9 w-auto" />
          <p className="mt-3 text-sm font-bold text-primary">{t("joinUs")}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">{t("signupTitle")}</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{t("signupIntro")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("haveAccountQ")} <Link href="/connexion" className="font-bold text-primary hover:underline">{t("signin")}</Link></p>
        </div>

        <SignupForm />
      </div>
    </main>
  );
}
