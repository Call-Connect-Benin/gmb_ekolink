"use client";

import Link from "next/link";
import { useState } from "react";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { deleteListingAction } from "../actions";

type Labels = { actions: string; view: string; edit: string; delete: string; confirmDelete: string };

export default function FicheRowActions({
  id,
  slug,
  labels,
}: {
  id: string;
  slug: string;
  labels: Labels;
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
          <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-white py-1 text-sm shadow-lg">
            <Link href={`/fiches-google/${slug}`} target="_blank" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary">
              <Eye className="size-4 text-muted-foreground" /> {labels.view}
            </Link>
            <Link href={`/admin/fiches/${id}`} onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary">
              <Pencil className="size-4 text-muted-foreground" /> {labels.edit}
            </Link>
            <div className="my-1 border-t border-border" />
            <form
              action={deleteListingAction}
              onSubmit={(e) => {
                if (!confirm(labels.confirmDelete)) {
                  e.preventDefault();
                  return;
                }
                setOpen(false);
              }}
            >
              <input type="hidden" name="id" value={id} />
              <button type="submit" className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-destructive hover:bg-destructive/10">
                <Trash2 className="size-4" /> {labels.delete}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
