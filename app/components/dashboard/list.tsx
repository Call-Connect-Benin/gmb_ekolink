/* Helpers de mise en page pour les écrans-liste de l'admin. */
import { Search, ListFilter, Download, Calendar, ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function EmptyRow({ cols, label }: { cols: number; label?: string }) {
  const t = useTranslations("dashboard");
  return <tr><td colSpan={cols} className="py-14 text-center text-sm text-muted-foreground">{label ?? t("noData")}</td></tr>;
}
export function EmptyMini({ label }: { label?: string }) {
  const t = useTranslations("dashboard");
  return <div className="py-8 text-center text-sm text-muted-foreground">{label ?? t("noDataShort")}</div>;
}

export function PageHead({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function HeadBtn({ icon: Icon, children, variant = "outline" }: { icon?: LucideIcon; children: React.ReactNode; variant?: "outline" | "primary" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
        variant === "primary" ? "bg-primary text-white shadow-sm hover:bg-primary/90" : "border border-border bg-card text-foreground/80 hover:bg-secondary"
      )}
    >
      {Icon && <Icon className="size-4" />} {children}
    </button>
  );
}
export function ExportBtn() {
  const t = useTranslations("dashboard");
  return <HeadBtn icon={Download}>{t("export")}</HeadBtn>;
}

export function StatRow({ children, cols = 5 }: { children: React.ReactNode; cols?: 4 | 5 | 6 }) {
  const c = cols === 6 ? "xl:grid-cols-6" : cols === 4 ? "lg:grid-cols-4" : "xl:grid-cols-5";
  return <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3", c)}>{children}</div>;
}

/** Barre de filtres : recherche + selects + (date) + bouton Filtres. */
export function FilterBar({
  placeholder,
  selects = [],
  date,
  filtersBtn = true,
}: {
  placeholder?: string;
  selects?: string[];
  date?: string;
  filtersBtn?: boolean;
}) {
  const t = useTranslations("dashboard");
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_1px_2px_rgba(11,18,28,0.04)]">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input placeholder={placeholder ?? t("search")} className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
      </div>
      {selects.map((s) => (
        <span key={s} className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground/80">
          {s} <ChevronDown className="size-4 text-muted-foreground" />
        </span>
      ))}
      {date && (
        <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-foreground/80">
          <Calendar className="size-4 text-muted-foreground" /> {date}
        </span>
      )}
      {filtersBtn && (
        <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground/80 hover:bg-secondary">
          <ListFilter className="size-4" /> {t("filters")}
        </button>
      )}
    </div>
  );
}
