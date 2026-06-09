/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Tonalités d'icône ---------- */
export type Tone = "blue" | "green" | "orange" | "red" | "purple" | "teal";
export const TONE: Record<Tone, { soft: string; fg: string; solid: string }> = {
  blue: { soft: "bg-primary/10", fg: "text-primary", solid: "bg-primary" },
  green: { soft: "bg-success/12", fg: "text-success", solid: "bg-success" },
  orange: { soft: "bg-accent/15", fg: "text-[#d97706]", solid: "bg-accent" },
  red: { soft: "bg-destructive/10", fg: "text-destructive", solid: "bg-destructive" },
  purple: { soft: "bg-[#7c3aed]/10", fg: "text-[#7c3aed]", solid: "bg-[#7c3aed]" },
  teal: { soft: "bg-[#0ea5e9]/10", fg: "text-[#0ea5e9]", solid: "bg-[#0ea5e9]" },
};

/* ---------- Panneau (carte blanche) ---------- */
export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(11,18,28,0.04)]", className)}>
      {children}
    </section>
  );
}

export function PanelHeader({ title, action, className }: { title: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="text-base font-bold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

/* ---------- Carte statistique ---------- */
export function StatCard({
  icon: Icon,
  tone = "blue",
  label,
  value,
  delta,
  deltaDir,
  deltaNote = "vs. le mois dernier",
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  label: string;
  value: string;
  delta?: string;
  deltaDir?: "up" | "down";
  deltaNote?: string;
  className?: string;
}) {
  const t = TONE[tone];
  const up = deltaDir !== "down";
  return (
    <div className={cn("rounded-xl border border-border bg-card p-3.5 shadow-[0_1px_2px_rgba(11,18,28,0.04)]", className)}>
      <div className="flex items-start gap-2.5">
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", t.soft)}>
          <Icon className={cn("size-[18px]", t.fg)} strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-xl font-extrabold leading-tight">{value}</p>
        </div>
      </div>
      {delta && (
        <p className="mt-2 flex items-center gap-1 text-xs">
          <span className={cn("inline-flex items-center gap-0.5 font-bold", up ? "text-success" : "text-destructive")}>
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {delta}
          </span>
          <span className="text-muted-foreground">{deltaNote}</span>
        </p>
      )}
    </div>
  );
}

/* ---------- Pastille de statut ---------- */
const PILL: Record<string, string> = {
  green: "bg-success/12 text-success",
  blue: "bg-primary/10 text-primary",
  orange: "bg-accent/15 text-[#b25e00]",
  red: "bg-destructive/10 text-destructive",
  purple: "bg-[#7c3aed]/10 text-[#7c3aed]",
  gray: "bg-secondary text-muted-foreground",
  teal: "bg-[#0ea5e9]/10 text-[#0ea5e9]",
};
export function Pill({ tone = "gray", children, dot }: { tone?: keyof typeof PILL; children: React.ReactNode; dot?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", PILL[tone])}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ---------- Avatar ---------- */
export function Avatar({ name, src, size = 36 }: { name: string; src?: string | null; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  if (src) {
    return <img src={src} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}

/* ---------- Liste d'actions rapides ---------- */
export function QuickAction({ icon: Icon, label, href = "#", tone = "blue", badge }: { icon: LucideIcon; label: string; href?: string; tone?: Tone; badge?: string }) {
  const t = TONE[tone];
  return (
    <Link href={href} className="group flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", t.soft)}>
        <Icon className={cn("size-4", t.fg)} />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground/85">{label}</span>
      {badge ? (
        <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-bold text-destructive">{badge}</span>
      ) : (
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

/* ---------- Tableau ---------- */
export function Table({ head, children, className }: { head: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">{head}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-3 py-3 font-semibold", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-3 py-3 align-middle", className)}>{children}</td>;
}
export function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn("border-b border-border/70 last:border-0 hover:bg-secondary/40", className)}>{children}</tr>;
}

/* ---------- Pagination ---------- */
export function Pagination({ page = 1, pages = 1, label }: { page?: number; pages?: number; label?: string }) {
  const nums = pages <= 4 ? Array.from({ length: pages }, (_, i) => i + 1) : [1, 2, 3, "…", pages];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-sm text-muted-foreground">
      {label && <span>{label}</span>}
      <div className="flex items-center gap-1">
        <button className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:enabled:border-primary/40 disabled:opacity-40" disabled>«</button>
        {nums.map((n, i) =>
          n === "…" ? (
            <span key={i} className="px-2">…</span>
          ) : (
            <button key={i} className={cn("flex size-8 items-center justify-center rounded-lg text-sm font-semibold", n === page ? "bg-primary text-white" : "border border-border text-foreground/70 hover:border-primary/40")}>{n}</button>
          )
        )}
        <button className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:enabled:border-primary/40">»</button>
      </div>
    </div>
  );
}

/* ---------- Boutons en-tête de page ---------- */
export function ToolbarButton({ icon: Icon, children, variant = "outline", href }: { icon?: LucideIcon; children: React.ReactNode; variant?: "outline" | "primary"; href?: string }) {
  const cls = cn(
    "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
    variant === "primary" ? "bg-primary text-white shadow-sm hover:bg-primary/90" : "border border-border bg-card text-foreground/80 hover:bg-secondary"
  );
  const inner = (
    <>
      {Icon && <Icon className="size-4" />} {children}
    </>
  );
  return href ? <Link href={href} className={cls}>{inner}</Link> : <button className={cls}>{inner}</button>;
}
