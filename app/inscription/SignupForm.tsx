"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { UserRound, Mail, Phone, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "../components/PasswordInput";

const CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" /></svg>
);

function strengthScore(pw: string): number {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..4
}

export default function SignupForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const score = strengthScore(password);

  const nextUrl = () =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next")
      : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!CONFIGURED) {
      setError(t("errNotConfigured"));
      return;
    }
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    if (!accept) {
      setError(t("mustAcceptTerms"));
      return;
    }
    setLoading(true);
    try {
      const sb = createClient();
      const next = nextUrl();
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
          emailRedirectTo: next
            ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
            : undefined,
        },
      });
      if (error) throw error;
      if (data.session) {
        router.push(next || "/fiches-google");
        router.refresh();
      } else if (next) {
        router.push("/compte?verify=1");
      } else {
        setInfo(t("accountCreated"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError("");
    if (!CONFIGURED) {
      setError(t("errNotConfigured"));
      return;
    }
    const sb = createClient();
    const next = nextUrl() || "/fiches-google";
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  };

  const inputCls =
    "h-12 w-full rounded-xl border border-border bg-background pl-11 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-7 max-w-[560px] space-y-4">
      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
        <label className="text-sm font-bold">{t("fullName")}</label>
        <div className="relative"><UserRound className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" placeholder={t("fullNamePlaceholder")} className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
        <label className="text-sm font-bold">{t("email")}</label>
        <div className="relative"><Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder={t("emailPlaceholderEx")} className={inputCls} /></div>
      </div>
      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
        <label className="text-sm font-bold">{t("phone")}</label>
        <div className="relative"><Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder={t("phonePlaceholder")} className={inputCls} /></div>
      </div>

      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-start gap-3">
        <label className="pt-3 text-sm font-bold">{t("password")}</label>
        <div>
          <PasswordInput
            placeholder={t("passwordMinPlaceholder")}
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={setPassword}
            className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm outline-none focus:border-primary"
          />
          <div className="mt-2 flex items-center gap-2">
            <div className="flex flex-1 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`h-1.5 flex-1 rounded-full ${i < score ? (score <= 1 ? "bg-destructive" : score === 2 ? "bg-accent" : "bg-success") : "bg-border"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{t("passwordStrength")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3">
        <label className="text-sm font-bold">{t("confirmPassword")}</label>
        <PasswordInput placeholder={t("confirmPlaceholder")} autoComplete="new-password" required value={confirm} onChange={setConfirm} />
      </div>

      <label className="flex items-start gap-2 pt-1 text-sm"><input type="checkbox" checked={accept} onChange={(e) => setAccept(e.target.checked)} className="mt-0.5 size-4 rounded border-border accent-[#1a73e8]" /> <span>{t("acceptPre")}<Link href="/cgv" className="font-semibold text-primary hover:underline">{t("terms")}</Link>{t("acceptMid")}<Link href="/politique-confidentialite" className="font-semibold text-primary hover:underline">{t("privacy")}</Link>. <span className="text-destructive">*</span></span></label>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>
      )}
      {info && (
        <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-[color:var(--success)]" role="status">{info}</p>
      )}

      <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-70">{loading ? t("wait") : t("createAccount")}</button>

      <div className="my-2 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> {t("or")} <span className="h-px flex-1 bg-border" /></div>
      <button type="button" onClick={onGoogle} className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary"><GoogleG /> {t("signupGoogle")}</button>
      <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-muted-foreground"><ShieldCheck className="size-3.5" /> {t("dataSecure")}</p>
    </form>
  );
}
