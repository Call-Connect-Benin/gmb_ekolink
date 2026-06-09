import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AccountNav({
  active,
  isAdmin,
}: {
  active: "compte" | "catalogue" | "admin";
  isAdmin: boolean;
}) {
  const cls = (on: boolean) =>
    cn(
      "flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-semibold transition-colors",
      on ? "bg-primary/10 text-primary" : "hover:bg-muted"
    );

  return (
    <nav className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4 shadow-sm" aria-label="Espace client">
      <Link href="/compte" className={cls(active === "compte")}>Mes commandes</Link>
      <Link href="/fiches-google" className={cls(active === "catalogue")}>Catalogue</Link>
      {isAdmin && (
        <Link href="/admin" className={cls(active === "admin")}>Back-office admin</Link>
      )}
      <form action="/auth/signout" method="post" className="mt-1 border-t border-border pt-1">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-md px-3.5 py-2.5 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
        >
          Déconnexion
        </button>
      </form>
    </nav>
  );
}
