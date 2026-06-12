"use client";

import { Trash2, Check } from "lucide-react";
import { updateUserRoleAction, deleteUserAction } from "./actions";
import RowMenu from "../../components/dashboard/RowMenu";

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
  return (
    <RowMenu label={labels.actions} width={208}>
      {(close) => (
        <>
          <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.changeRole}</p>
          {roleOptions.map((o) => (
            <form key={o.value} action={updateUserRoleAction} onSubmit={close}>
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
              close();
            }}
          >
            <input type="hidden" name="id" value={id} />
            <button type="submit" className="flex w-full items-center gap-2 px-3 py-2 text-left text-destructive hover:bg-destructive/10">
              <Trash2 className="size-4" /> {labels.delete}
            </button>
          </form>
        </>
      )}
    </RowMenu>
  );
}
