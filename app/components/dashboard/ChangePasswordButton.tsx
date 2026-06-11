"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { KeyRound, ChevronRight, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "../PasswordInput";

export default function ChangePasswordButton() {
  const t = useTranslations("dash.profile");
  const [open, setOpen] = useState(false);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const close = () => {
    setOpen(false);
    setPw("");
    setConfirm("");
    setError("");
    setDone(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (pw !== confirm) {
      setError(t("pwMismatch"));
      return;
    }
    setLoading(true);
    try {
      const sb = createClient();
      const { error } = await sb.auth.updateUser({ password: pw });
      if (error) throw error;
      setDone(true);
      setTimeout(close, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"><KeyRound className="size-4 text-primary" /></span>
        <span className="flex-1 text-left text-sm font-medium text-foreground/85">{t("changePassword")}</span>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{t("changePassword")}</h2>
              <button type="button" onClick={close} aria-label={t("pwCancel")} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>

            {done ? (
              <p className="rounded-xl bg-success/10 px-4 py-3 text-sm text-[color:var(--success)]">{t("pwSuccess")}</p>
            ) : (
              <form onSubmit={submit} className="flex flex-col gap-3">
                <div className="grid gap-1.5">
                  <label className="text-sm font-semibold">{t("pwNew")}</label>
                  <PasswordInput value={pw} onChange={setPw} required minLength={6} autoComplete="new-password" />
                </div>
                <div className="grid gap-1.5">
                  <label className="text-sm font-semibold">{t("pwConfirm")}</label>
                  <PasswordInput value={confirm} onChange={setConfirm} required autoComplete="new-password" />
                </div>

                {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

                <div className="mt-2 flex justify-end gap-2">
                  <button type="button" onClick={close} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">{t("pwCancel")}</button>
                  <button type="submit" disabled={loading} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-70">{t("pwSave")}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
