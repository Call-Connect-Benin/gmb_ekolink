/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Mail, Phone, Clock, MapPin, Lock } from "lucide-react";

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h4 className="mb-4 text-sm font-bold text-white">{title}</h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((l, i) => (
          <li key={`${l.href}-${i}`}>
            <Link href={l.href} className="text-sm text-white/55 transition-colors hover:text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  const NAVIGATION = [
    { href: "/", label: t("links.home") },
    { href: "/fiches-google", label: t("links.catalogue") },
    { href: "/comment-ca-marche", label: t("links.howItWorks") },
    { href: "/#faq", label: t("links.faq") },
    { href: "/a-propos", label: t("links.about") },
  ];
  const RESSOURCES = [
    { href: "/blog", label: t("links.blog") },
    { href: "/blog", label: t("links.guides") },
    { href: "/blog", label: t("links.seoTips") },
    { href: "/cgv", label: t("links.terms") },
    { href: "/politique-confidentialite", label: t("links.privacy") },
  ];
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(160deg,#0b1119,#0a1a33)] text-white/60">
      <div className="absolute -bottom-24 right-0 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1240px] px-5 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1.2fr_1fr_1fr]">
          {/* Marque */}
          <div>
            <Link href="/" aria-label="EkoLink" className="inline-block">
              <img src="/assets/icons/logo-tight.png" alt="EkoLink" width={323} height={88} className="footer-logo mb-4 object-contain" />
            </Link>
            <p className="mb-5 max-w-[260px] text-sm leading-relaxed">{t("blurb")}</p>
            <ul className="flex list-none gap-3 pl-0" aria-label="Réseaux sociaux">
              {[
                { label: "Facebook", href: "https://web.facebook.com/people/EkoLink/100086166664875/", icon: "facebook" },
                { label: "Instagram", href: "https://www.instagram.com/ekolink", icon: "instagram" },
                { label: "LinkedIn", href: "https://www.linkedin.com/company/ekolink", icon: "linkedin" },
                { label: "YouTube", href: "https://www.youtube.com/@AlbertLanneAds", icon: "youtube" },
              ].map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="block transition-transform hover:-translate-y-0.5 hover:opacity-90">
                    <img src={`/assets/social/${s.icon}.png`} alt={s.label} className="social-icon object-contain" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <Column title={t("navigation")} links={NAVIGATION} />
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">{t("contact")}</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><a href="mailto:contact@ekolink.fr" className="flex items-center gap-2 hover:text-white"><Mail className="size-4 shrink-0 text-primary" /> contact@ekolink.fr</a></li>
              <li><a href="tel:+33617030308" className="flex items-center gap-2 hover:text-white"><Phone className="size-4 shrink-0 text-primary" /> +33 6 17 03 03 08</a></li>
              <li className="flex items-center gap-2"><Clock className="size-4 shrink-0 text-primary" /> {t("hours")}</li>
              <li className="flex items-center gap-2"><MapPin className="size-4 shrink-0 text-primary" /> {t("location")}</li>
            </ul>
          </div>
          <Column title={t("resources")} links={RESSOURCES} />
          <div>
            <h4 className="mb-4 text-sm font-bold text-white">{t("securePayments")}</h4>
            <div className="mb-3 flex flex-wrap gap-2">
              <svg width="40" height="26" viewBox="0 0 38 24" aria-label="Visa"><rect width="38" height="24" rx="4" fill="#fff" /><text x="19" y="16" textAnchor="middle" fontFamily="Arial" fontSize="9" fontWeight="900" fill="#1434CB">VISA</text></svg>
              <svg width="40" height="26" viewBox="0 0 38 24" aria-label="Mastercard"><rect width="38" height="24" rx="4" fill="#fff" /><circle cx="16" cy="12" r="6" fill="#EB001B" /><circle cx="23" cy="12" r="6" fill="#F79E1B" opacity=".9" /></svg>
              <svg width="40" height="26" viewBox="0 0 38 24" aria-label="PayPal"><rect width="38" height="24" rx="4" fill="#fff" /><text x="19" y="16" textAnchor="middle" fontFamily="Arial" fontSize="8" fontWeight="900" fill="#003087">PayPal</text></svg>
              <svg width="40" height="26" viewBox="0 0 38 24" aria-label="Apple Pay"><rect width="38" height="24" rx="4" fill="#000" /><text x="19" y="16" textAnchor="middle" fontFamily="Arial" fontSize="8" fontWeight="900" fill="#fff">Pay</text></svg>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-success"><Lock className="size-3.5" /> {t("secureSite")}</p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs">
          &copy; {year} EkoLink. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
