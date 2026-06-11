"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createAdminAction } from "../actions";

type Labels = {
  add: string;
  title: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
  roleAdmin: string;
  roleSuper: string;
  create: string;
  cancel: string;
};

export default function AddAdminButton({ labels }: { labels: Labels }) {
  const [open, setOpen] = useState(false);
  const input = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
      >
        <Plus className="size-4" /> {labels.add}
      </button>

      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{labels.title}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={labels.cancel} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>
            <form action={createAdminAction} onSubmit={() => setTimeout(() => setOpen(false), 0)} className="flex flex-col gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.fullName}</label>
                <input name="full_name" type="text" className={input} placeholder="Forlan LAIN" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.email}</label>
                <input name="email" type="email" required className={input} placeholder="admin@ekolink.fr" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.password}</label>
                <input name="password" type="password" required minLength={6} className={input} placeholder="••••••••" />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold">{labels.role}</label>
                <select name="role" defaultValue="admin" className={input}>
                  <option value="admin">{labels.roleAdmin}</option>
                  <option value="super_admin">{labels.roleSuper}</option>
                </select>
              </div>
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">{labels.cancel}</button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90">{labels.create}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
