"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2, ChevronRight, X, AlertTriangle } from "lucide-react";
import { deleteOwnAccountAction } from "./profileActions";

export default function DeleteAccountButton() {
  const t = useTranslations("dash.profile");
  const [open, setOpen] = useState(false);
  const [ack, setAck] = useState(false);

  const close = () => {
    setOpen(false);
    setAck(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-destructive/10"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10"><Trash2 className="size-4 text-destructive" /></span>
        <span className="flex-1 text-left text-sm font-medium text-destructive">{t("deleteAccount")}</span>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-destructive"><AlertTriangle className="size-5" /> {t("deleteAccount")}</h2>
              <button type="button" onClick={close} aria-label={t("pwCancel")} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>

            <p className="text-sm text-muted-foreground">{t("delWarning")}</p>

            <label className="mt-4 flex items-start gap-2.5 text-sm">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 size-4 rounded border-border accent-[#ef4444]" />
              <span>{t("delCheck")}</span>
            </label>

            <form action={deleteOwnAccountAction} className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={close} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">{t("pwCancel")}</button>
              <button type="submit" disabled={!ack} className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-white hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50">{t("delConfirmBtn")}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
