"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

export default function NewCategoryButton({
  label,
  title,
  closeLabel,
  children,
}: {
  label: string;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:bg-primary/90"
      >
        <Plus className="size-4" /> {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">{title}</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="text-muted-foreground hover:text-foreground">
                <X className="size-5" />
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
