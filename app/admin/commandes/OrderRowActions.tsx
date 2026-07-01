"use client";

import { Check, Receipt } from "lucide-react";
import { updateOrderStatusAction } from "../actions";
import RowMenu from "../../components/dashboard/RowMenu";

type Labels = { actions: string; changeStatus: string; invoice: string };

// Une facture n'existe que pour une commande encaissée.
const PAID = ["paid", "in_progress", "delivered", "validated"];

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
  return (
    <RowMenu label={labels.actions} width={224}>
      {(close) => (
        <>
          {PAID.includes(status) && (
            <>
              <a
                href={`/facture/${id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex w-full items-center gap-2 px-3 py-2 text-left font-medium hover:bg-secondary"
              >
                <Receipt className="size-4 text-primary" /> {labels.invoice}
              </a>
              <div className="my-1 border-t border-border" />
            </>
          )}
          <p className="px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">{labels.changeStatus}</p>
          {statusOptions.map((o) => (
            <form key={o.value} action={updateOrderStatusAction} onSubmit={close}>
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
        </>
      )}
    </RowMenu>
  );
}
