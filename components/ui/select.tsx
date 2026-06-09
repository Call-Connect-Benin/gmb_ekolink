import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Select natif stylé (cohérent shadcn) — compatible avec la soumission de
 * formulaires via FormData (Server Actions), contrairement au Select Radix.
 */
function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm outline-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Select };
