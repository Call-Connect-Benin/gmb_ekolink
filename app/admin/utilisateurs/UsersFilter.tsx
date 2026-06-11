"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ChevronDown, Download } from "lucide-react";

export default function UsersFilter({
  q0,
  role0,
  placeholder,
  roleLabel,
  roleOptions,
  exportLabel,
}: {
  q0: string;
  role0: string;
  placeholder: string;
  roleLabel: string;
  roleOptions: { value: string; label: string }[];
  exportLabel: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(q0);
  const [role, setRole] = useState(role0);

  const apply = (nq: string, nr: string) => {
    const params = new URLSearchParams();
    if (nq.trim()) params.set("q", nq.trim());
    if (nr) params.set("role", nr);
    const qs = params.toString();
    router.push(`/admin/utilisateurs${qs ? `?${qs}` : ""}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply(q, role);
      }}
      className="flex flex-1 flex-wrap items-center gap-3"
    >
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="relative">
        <select
          value={role}
          aria-label={roleLabel}
          onChange={(e) => {
            setRole(e.target.value);
            apply(q, e.target.value);
          }}
          className="h-10 appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm text-foreground/80 outline-none focus:border-primary"
        >
          <option value="">{roleLabel}</option>
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <a
        href="/admin/utilisateurs/export"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary"
      >
        <Download className="size-4" /> {exportLabel}
      </a>
    </form>
  );
}
