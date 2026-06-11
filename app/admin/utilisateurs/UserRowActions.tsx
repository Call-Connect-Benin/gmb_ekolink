"use client";

import { useState } from "react";
import { MoreHorizontal, Trash2, Check } from "lucide-react";
import { updateUserRoleAction, deleteUserAction } from "./actions";

type Labels = { actions: string; changeRole: string; delete: string; confirmDelete: string };

export default function UserRowActions({
  id,
  role,
  labels,
  roleOptions,
}: {
  id: string;
  role: string;
  labels: Labels;
  roleOptions: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={labels.actions}
        className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-52 overflow-hidden rounded-xl border border-border bg-white py-1 text-sm shadow-lg">
            <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.changeRole}</p>
            {roleOptions.map((o) => (
              <form key={o.value} action={updateUserRoleAction} onSubmit={() => setOpen(false)}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="role" value={o.value} />
                <button
                  type="submit"
                  disabled={o.value === role}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-secondary disabled:cursor-default disabled:text-primary"
                >
                  {o.label}
                  {o.value === role && <Check className="size-4 text-primary" />}
                </button>
              </form>
            ))}
            <div className="my-1 border-t border-border" />
            <form
              action={deleteUserAction}
              onSubmit={(e) => {
                if (!confirm(labels.confirmDelete)) {
                  e.preventDefault();
                  return;
                }
                setOpen(false);
              }}
            >
              <input type="hidden" name="id" value={id} />
              <button type="submit" className="flex w-full items-center gap-2 px-3 py-2 text-left text-destructive hover:bg-destructive/10">
                <Trash2 className="size-4" /> {labels.delete}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
