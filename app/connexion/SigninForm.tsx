"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/utils";
import PasswordInput from "../components/PasswordInput";

const CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" /></svg>
);

export default function SigninForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nextUrl = () =>
    typeof window !== "undefined"
      ? safeNext(new URLSearchParams(window.location.search).get("next"))
      : null;

  // Affiche un message si le retour OAuth a échoué (?error=oauth).
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "oauth") {
      setError(t("oauthError"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!CONFIGURED) {
      setError(t("errNotConfigured"));
      return;
    }
    setLoading(true);
    try {
      const sb = createClient();
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push(nextUrl() || "/compte");
      router.refresh();
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
    const next = nextUrl() || "/compte";
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  };

  return (
    <>
      <form onSubmit={onSubmit} className="mt-4 space-y-2.5">
        <div className="grid gap-1">
          <label className="text-sm font-bold">{t("email")}</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              suppressHydrationWarning
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              className="h-10 w-full rounded-xl border border-border bg-background pl-11 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-bold">{t("password")}</label>
          <PasswordInput
            placeholder={t("passwordPlaceholder")}
            autoComplete="current-password"
            required
            value={password}
            onChange={setPassword}
            className="h-10 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="text-right"><Link href="/mot-de-passe-oublie" className="text-sm font-semibold text-primary hover:underline">{t("forgotPassword")}</Link></div>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" defaultChecked className="size-4 rounded border-border accent-[#1a73e8]" /> {t("rememberMe")}</label>

        {error && (
          <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>
        )}

        <button type="submit" disabled={loading} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-70">
          {loading ? t("wait") : t("signin")}
        </button>
      </form>

      <div className="my-2.5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> {t("or")} <span className="h-px flex-1 bg-border" /></div>

      <button type="button" onClick={onGoogle} className="flex h-10 w-full items-center justify-center gap-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary"><GoogleG /> {t("google")}</button>
    </>
  );
}
