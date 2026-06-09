/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { UserRound, Mail, Phone, Lock, Eye, ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte EkoLink pour consulter et acheter des fiches Google Business prêtes à l'emploi.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/inscription" },
};

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" /></svg>
);
const Field = ({ icon: Icon, label, type = "text", placeholder, eye }: { icon: typeof Mail; label: string; type?: string; placeholder: string; eye?: boolean }) => (
  <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
    <label className="text-sm font-bold">{label}</label>
    <div className="relative"><Icon className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type={type} placeholder={placeholder} className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />{eye && <Eye className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}</div>
  </div>
);

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

        <form className="mx-auto mt-7 max-w-[560px] space-y-4">
          <Field icon={UserRound} label={t("fullName")} placeholder={t("fullNamePlaceholder")} />
          <Field icon={Mail} label={t("email")} type="email" placeholder={t("emailPlaceholderEx")} />
          <Field icon={Phone} label={t("phone")} placeholder={t("phonePlaceholder")} />
          <div className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-3">
            <label className="pt-3 text-sm font-bold">{t("password")}</label>
            <div>
              <div className="relative"><Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="password" placeholder={t("passwordMinPlaceholder")} className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm outline-none focus:border-primary" /><Eye className="absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /></div>
              <div className="mt-2 flex items-center gap-2"><div className="flex flex-1 gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className={`h-1.5 flex-1 rounded-full ${i === 0 ? "bg-primary" : "bg-border"}`} />)}</div><span className="text-xs text-muted-foreground">{t("passwordStrength")}</span></div>
            </div>
          </div>
          <Field icon={Lock} label={t("confirmPassword")} type="password" placeholder={t("confirmPlaceholder")} eye />

          <label className="flex items-start gap-2 pt-1 text-sm"><input type="checkbox" className="mt-0.5 size-4 rounded border-border accent-[#1a73e8]" /> <span>{t("acceptPre")}<Link href="/cgv" className="font-semibold text-primary hover:underline">{t("terms")}</Link>{t("acceptMid")}<Link href="/politique-confidentialite" className="font-semibold text-primary hover:underline">{t("privacy")}</Link>. <span className="text-destructive">*</span></span></label>

          <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary/90">{t("createAccount")} <ArrowRight className="size-4" /></button>

          <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> {t("or")} <span className="h-px flex-1 bg-border" /></div>
          <button type="button" className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary"><GoogleG /> {t("signupGoogle")}</button>
          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-muted-foreground"><ShieldCheck className="size-3.5" /> {t("dataSecure")}</p>
        </form>
      </div>
    </main>
  );
}
