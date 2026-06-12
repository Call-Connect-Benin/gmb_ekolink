"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { deleteListingAction } from "../actions";
import RowMenu from "../../components/dashboard/RowMenu";

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
  return (
    <RowMenu label={labels.actions} width={176}>
      {(close) => (
        <>
          <Link href={`/fiches-google/${slug}`} target="_blank" onClick={close} className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary">
            <Eye className="size-4 text-muted-foreground" /> {labels.view}
          </Link>
          <Link href={`/admin/fiches/${id}`} onClick={close} className="flex items-center gap-2.5 px-3 py-2 hover:bg-secondary">
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
              close();
            }}
          >
            <input type="hidden" name="id" value={id} />
            <button type="submit" className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-destructive hover:bg-destructive/10">
              <Trash2 className="size-4" /> {labels.delete}
            </button>
          </form>
        </>
      )}
    </RowMenu>
  );
}
