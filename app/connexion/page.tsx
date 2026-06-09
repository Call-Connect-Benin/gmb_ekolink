import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { UserRound, Mail, Lock, Eye, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace client EkoLink.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/connexion" },
};

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" /></svg>
);

export default function Connexion() {
  const t = useTranslations("auth");
  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-[#eef2f7] px-4 py-10">
      <div className="w-full max-w-[480px] rounded-3xl border border-border bg-white p-8 shadow-[0_20px_60px_rgba(11,18,28,0.08)] sm:p-10">
        <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10"><UserRound className="size-8 text-primary" /></div>
        <h1 className="text-center text-3xl font-extrabold tracking-tight">{t("welcomeBack")}</h1>
        <p className="mx-auto mt-2 max-w-xs text-center text-sm text-muted-foreground">{t("signinIntro")}</p>

        <form className="mt-7 space-y-4">
          <div className="grid gap-1.5">
            <label className="text-sm font-bold">{t("email")}</label>
            <div className="relative"><Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="email" placeholder={t("emailPlaceholder")} className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></div>
          </div>
          <div className="grid gap-1.5">
            <label className="text-sm font-bold">{t("password")}</label>
            <div className="relative"><Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="password" placeholder={t("passwordPlaceholder")} className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /><Eye className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 cursor-pointer text-muted-foreground" /></div>
            <div className="text-right"><Link href="#" className="text-sm font-semibold text-primary hover:underline">{t("forgotPassword")}</Link></div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="size-4 rounded border-border accent-[#1a73e8]" /> {t("rememberMe")}</label>
          <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary/90">{t("signin")} <ArrowRight className="size-4" /></button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> {t("or")} <span className="h-px flex-1 bg-border" /></div>

        <button type="button" className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary"><GoogleG /> {t("google")}</button>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-primary/[0.06] p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div><p className="text-sm font-bold text-primary">{t("secureTitle")}</p><p className="text-xs text-muted-foreground">{t("secureText")}</p></div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">{t("noAccountQ")} <Link href="/inscription" className="font-bold text-primary hover:underline">{t("signupTitle")}</Link></p>
      </div>
    </main>
  );
}
