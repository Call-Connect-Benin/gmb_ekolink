"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "../components/PasswordInput";

const CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function ResetForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Vérifie qu'une session de récupération est bien présente (lien email valide).
  useEffect(() => {
    if (!CONFIGURED) {
      setError(t("errNotConfigured"));
      return;
    }
    const sb = createClient();
    sb.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) setReady(true);
        else setError(t("resetInvalid"));
      })
      .catch(() => setError(t("resetInvalid")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const sb = createClient();
      const { error } = await sb.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      router.refresh();
      setTimeout(() => router.push("/compte"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errGeneric"));
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <p className="mt-7 rounded-xl bg-success/10 px-4 py-3 text-sm text-[color:var(--success)]" role="status">
        {t("resetDone")}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-7 space-y-4">
      <div className="grid gap-1.5">
        <label className="text-sm font-bold">{t("newPassword")}</label>
        <PasswordInput placeholder={t("passwordMinPlaceholder")} autoComplete="new-password" required minLength={6} value={password} onChange={setPassword} />
      </div>
      <div className="grid gap-1.5">
        <label className="text-sm font-bold">{t("confirmPassword")}</label>
        <PasswordInput placeholder={t("confirmPlaceholder")} autoComplete="new-password" required value={confirm} onChange={setConfirm} />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>
      )}

      <button type="submit" disabled={loading || !ready} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-70">
        {loading ? t("wait") : t("updatePassword")} <ArrowRight className="size-4" />
      </button>

      <Link href="/connexion" className="block text-center text-sm font-semibold text-primary hover:underline">
        {t("backToSignin")}
      </Link>
    </form>
  );
}
