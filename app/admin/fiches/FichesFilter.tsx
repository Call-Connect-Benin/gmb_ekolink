"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ChevronDown, Download, FolderCog, Eye } from "lucide-react";

export default function FichesFilter({
  q0,
  status0,
  cat0,
  placeholder,
  statusLabel,
  catLabel,
  statusOptions,
  catOptions,
  exportLabel,
  manageCatsLabel,
  viewCatalogLabel,
}: {
  q0: string;
  status0: string;
  cat0: string;
  placeholder: string;
  statusLabel: string;
  catLabel: string;
  statusOptions: { value: string; label: string }[];
  catOptions: { value: string; label: string }[];
  exportLabel: string;
  manageCatsLabel: string;
  viewCatalogLabel: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(q0);
  const [status, setStatus] = useState(status0);
  const [cat, setCat] = useState(cat0);

  const apply = (nq: string, ns: string, nc: string) => {
    const params = new URLSearchParams();
    if (nq.trim()) params.set("q", nq.trim());
    if (ns) params.set("status", ns);
    if (nc) params.set("cat", nc);
    const qs = params.toString();
    router.push(`/admin/fiches${qs ? `?${qs}` : ""}`);
  };

  const selectCls = "h-10 appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm text-foreground/80 outline-none focus:border-primary";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply(q, status, cat);
      }}
      className="flex flex-wrap items-center gap-3"
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
        <select value={status} aria-label={statusLabel} onChange={(e) => { setStatus(e.target.value); apply(q, e.target.value, cat); }} className={selectCls}>
          <option value="">{statusLabel}</option>
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="relative">
        <select value={cat} aria-label={catLabel} onChange={(e) => { setCat(e.target.value); apply(q, status, e.target.value); }} className={selectCls}>
          <option value="">{catLabel}</option>
          {catOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <a href="/admin/fiches/export" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary">
        <Download className="size-4" /> {exportLabel}
      </a>
      <a href="/admin/categories" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary">
        <FolderCog className="size-4" /> {manageCatsLabel}
      </a>
      <a href="/fiches-google" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary">
        <Eye className="size-4" /> {viewCatalogLabel}
      </a>
    </form>
  );
}
