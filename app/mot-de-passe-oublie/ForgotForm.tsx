"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ForgotForm() {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const { error } = await sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errGeneric"));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="mt-7">
        <p className="rounded-xl bg-success/10 px-4 py-3 text-sm text-[color:var(--success)]" role="status">
          {t("resetSent")}
        </p>
        <Link href="/connexion" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          ← {t("backToSignin")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div className="grid gap-1.5">
        <label className="text-sm font-bold">{t("email")}</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>
      )}

      <button type="submit" disabled={loading} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-70">
        {loading ? t("wait") : t("sendResetLink")} <ArrowRight className="size-4" />
      </button>

      <Link href="/connexion" className="block text-center text-sm font-semibold text-primary hover:underline">
        {t("backToSignin")}
      </Link>
    </form>
  );
}
