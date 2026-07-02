"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#1a73e8,#f89f1b)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
    >
      <Printer className="size-4" /> {label}
    </button>
  );
}
