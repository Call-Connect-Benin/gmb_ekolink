"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus, X, UserPlus, ChevronRight } from "lucide-react";
import { createUserAction } from "./actions";

type Labels = {
  add: string;
  modalTitle: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  create: string;
  cancel: string;
};

export default function AddUserButton({
  labels,
  roleOptions,
  variant = "button",
}: {
  labels: Labels;
  roleOptions: { value: string; label: string }[];
  variant?: "button" | "quick";
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createUserAction, null);
  const input = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  // E9 — ne fermer la modale qu'en cas de succès réel.
  useEffect(() => {
    if (state?.ok) setOpen(false);
  }, [state]);

  const trigger =
    variant === "quick" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"><UserPlus className="size-4 text-primary" /></span>
        <span className="flex-1 text-left text-sm font-medium text-foreground/85">{labels.add}</span>
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </button>
    ) : (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90"
      >
        <Plus className="size-4" /> {labels.add}
      </button>
    );

  return (
    <>
      {trigger}

      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{labels.modalTitle}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={labels.cancel} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>
            <form action={formAction} className="flex flex-col gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.fullName}</label>
                <input name="full_name" type="text" className={input} placeholder="Forlan LAIN" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.email}</label>
                <input name="email" type="email" required className={input} placeholder="forlan.lain@email.com" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.password}</label>
                <input name="password" type="password" required minLength={8} className={input} placeholder="••••••••" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.role}</label>
                <select name="role" defaultValue="buyer" className={input}>
                  {roleOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              {state?.error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>}
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">{labels.cancel}</button>
                <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 disabled:opacity-70">{labels.create}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
