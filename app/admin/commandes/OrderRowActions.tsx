"use client";

import { useState } from "react";
import { MoreHorizontal, Check } from "lucide-react";
import { updateOrderStatusAction } from "../actions";

type Labels = { actions: string; changeStatus: string };

export default function OrderRowActions({
  id,
  status,
  labels,
  statusOptions,
}: {
  id: string;
  status: string;
  labels: Labels;
  statusOptions: { value: string; label: string }[];
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
          <div className="absolute right-0 z-50 mt-1 w-56 overflow-hidden rounded-xl border border-border bg-white py-1 text-sm shadow-lg">
            <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.changeStatus}</p>
            {statusOptions.map((o) => (
              <form key={o.value} action={updateOrderStatusAction} onSubmit={() => setOpen(false)}>
                <input type="hidden" name="id" value={id} />
                <input type="hidden" name="status" value={o.value} />
                <button
                  type="submit"
                  disabled={o.value === status}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-secondary disabled:cursor-default disabled:text-primary"
                >
                  {o.label}
                  {o.value === status && <Check className="size-4 text-primary" />}
                </button>
              </form>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
