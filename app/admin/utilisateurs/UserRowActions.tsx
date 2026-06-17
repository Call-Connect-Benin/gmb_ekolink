"use client";

import { Trash2 } from "lucide-react";
import { deleteUserAction } from "./actions";
import RowMenu from "../../components/dashboard/RowMenu";

type Labels = { actions: string; delete: string; confirmDelete: string };

export default function UserRowActions({ id, labels }: { id: string; labels: Labels }) {
  return (
    <RowMenu label={labels.actions} width={208}>
      {(close) => (
        <form
          action={deleteUserAction}
          onSubmit={(e) => {
            if (!confirm(labels.confirmDelete)) {
              e.preventDefault();
              return;
            }
            close();
          }}
        >
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="flex w-full items-center gap-2 px-3 py-2 text-left text-destructive hover:bg-destructive/10">
            <Trash2 className="size-4" /> {labels.delete}
          </button>
        </form>
      )}
    </RowMenu>
  );
}
