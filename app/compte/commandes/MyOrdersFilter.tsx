"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

// Index d'onglet → groupe de statut (Toutes / En cours / Livrées / Annulées).
const TAB_VALUES = ["", "in_progress", "delivered", "cancelled"];

export default function MyOrdersFilter({
  tab0,
  q0,
  tabs,
  searchPlaceholder,
}: {
  tab0: string;
  q0: string;
  tabs: string[];
  searchPlaceholder: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(q0);

  const go = (tab: string, query: string) => {
    const params = new URLSearchParams();
    if (tab) params.set("tab", tab);
    if (query.trim()) params.set("q", query.trim());
    const qs = params.toString();
    router.push(`/compte/commandes${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-6 border-b border-border">
        {tabs.map((tab, i) => {
          const val = TAB_VALUES[i] ?? "";
          const on = (tab0 || "") === val;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => go(val, q)}
              className={`border-b-2 pb-2.5 text-sm font-semibold ${on ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); go(tab0 || "", q); }} className="flex items-center gap-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-10 w-56 rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </form>
    </div>
  );
}
