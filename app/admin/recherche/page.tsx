import Link from "next/link";
import { FileText, Users, Tags, SearchX } from "lucide-react";
import { getLocale } from "next-intl/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata = { title: "Recherche", robots: { index: false, follow: false } };

type ListingRow = { id: string; slug: string; title: string; city: string; price: number; status: string };
type UserRow = { id: string; email: string | null; full_name: string | null; role: string };
type CategoryRow = { id: string; slug: string; name_fr: string; name_en: string };

export default async function AdminSearch({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const en = (await getLocale()) === "en";
  const raw = (q || "").trim();
  // M3 — assainit la saisie avant interpolation dans .or() (filtre PostgREST).
  // On retire les métacaractères qui détourneraient le filtre : % , ( ) * : et \
  const query = raw.replace(/[%,()*:\\]/g, " ").replace(/\s+/g, " ").trim();

  let listings: ListingRow[] = [];
  let users: UserRow[] = [];
  let categories: CategoryRow[] = [];

  if (query && isSupabaseConfigured()) {
    const admin = createAdminClient();
    const like = `%${query}%`;
    const [l, u, c] = await Promise.all([
      admin.from("listings").select("id,slug,title,city,price,status").or(`title.ilike.${like},city.ilike.${like},slug.ilike.${like}`).limit(25),
      admin.from("profiles").select("id,email,full_name,role").or(`email.ilike.${like},full_name.ilike.${like}`).limit(25),
      admin.from("categories").select("id,slug,name_fr,name_en").or(`name_fr.ilike.${like},name_en.ilike.${like},slug.ilike.${like}`).limit(25),
    ]);
    listings = (l.data as ListingRow[]) ?? [];
    users = (u.data as UserRow[]) ?? [];
    categories = (c.data as CategoryRow[]) ?? [];
  }

  const total = listings.length + users.length + categories.length;
  const T = {
    title: en ? "Search" : "Recherche",
    resultsFor: en ? "Results for" : "Résultats pour",
    count: en ? `${total} result(s)` : `${total} résultat(s)`,
    empty: en ? "No result for this search." : "Aucun résultat pour cette recherche.",
    prompt: en ? "Type a query in the search bar above." : "Saisissez une recherche dans la barre ci-dessus.",
    listings: en ? "Listings" : "Fiches",
    users: en ? "Users" : "Utilisateurs",
    categories: en ? "Categories" : "Catégories",
    admin: en ? "Admin" : "Admin",
    buyer: en ? "Buyer" : "Acheteur",
  };

  const Section = ({ icon: Icon, title, children }: { icon: typeof FileText; title: string; count: number; children: React.ReactNode }) => (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-4 text-primary" /> {title}
      </h2>
      <div className="flex flex-col divide-y divide-border">{children}</div>
    </section>
  );

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{T.title}</h1>
        {query ? (
          <p className="mt-1 text-muted-foreground">{T.resultsFor} « <span className="font-semibold text-foreground">{query}</span> » — {T.count}</p>
        ) : (
          <p className="mt-1 text-muted-foreground">{T.prompt}</p>
        )}
      </div>

      {query && total === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
          <SearchX className="size-10 text-muted-foreground/60" />
          <p className="font-semibold">{T.empty}</p>
        </div>
      )}

      <div className="grid gap-5">
        {listings.length > 0 && (
          <Section icon={FileText} title={T.listings} count={listings.length}>
            {listings.map((l) => (
              <Link key={l.id} href={`/admin/fiches/${l.id}`} className="flex items-center gap-3 py-2.5 text-sm transition hover:bg-secondary/50">
                <span className="flex-1 truncate font-semibold">{l.title}</span>
                <span className="truncate text-muted-foreground">{l.city}</span>
                <span className="font-bold text-primary">{l.price} €</span>
              </Link>
            ))}
          </Section>
        )}

        {users.length > 0 && (
          <Section icon={Users} title={T.users} count={users.length}>
            {users.map((u) => (
              <Link key={u.id} href="/admin/utilisateurs" className="flex items-center gap-3 py-2.5 text-sm transition hover:bg-secondary/50">
                <span className="flex-1 truncate font-semibold">{u.full_name || "—"}</span>
                <span className="truncate text-muted-foreground">{u.email}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${u.role === "admin" || u.role === "super_admin" ? "bg-accent/15 text-[#b25e00]" : "bg-primary/10 text-primary"}`}>{u.role === "admin" || u.role === "super_admin" ? T.admin : T.buyer}</span>
              </Link>
            ))}
          </Section>
        )}

        {categories.length > 0 && (
          <Section icon={Tags} title={T.categories} count={categories.length}>
            {categories.map((c) => (
              <Link key={c.id} href={`/admin/categories/${c.slug}`} className="flex items-center gap-3 py-2.5 text-sm transition hover:bg-secondary/50">
                <span className="flex-1 truncate font-semibold">{en ? c.name_en : c.name_fr}</span>
                <span className="truncate text-muted-foreground">{c.slug}</span>
              </Link>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}
