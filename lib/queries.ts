import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, adminEmails } from "@/lib/supabase/config";
import type { Category, Listing, Order, Profile } from "@/lib/types";

export type ListingFilters = {
  category?: string;
  city?: string;
  state?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  q?: string; // recherche plein-texte (titre/description)
  sort?: string; // recent | price_asc | price_desc
};

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = await createClient();
    const { data } = await sb.from("categories").select("*").order("name_fr");
    return (data as Category[]) ?? [];
  } catch {
    return [];
  }
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = await createClient();
    let query = sb.from("listings").select("*");
    if (filters.category) query = query.eq("category_slug", filters.category);
    if (filters.city) query = query.ilike("city", `%${filters.city}%`);
    if (filters.state) query = query.eq("state", filters.state);
    if (filters.status) query = query.eq("status", filters.status);
    if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
    if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
    if (filters.q) {
      // M10 — neutralise les métacaractères du filtre PostgREST .or() : % , ( ) * : \
      const term = filters.q.replace(/[%,()*:\\]/g, " ").replace(/\s+/g, " ").trim();
      if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }
    if (filters.sort === "price_asc") query = query.order("price", { ascending: true });
    else if (filters.sort === "price_desc") query = query.order("price", { ascending: false });
    else query = query.order("created_at", { ascending: false });
    const { data } = await query;
    return (data as Listing[]) ?? [];
  } catch {
    return [];
  }
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = await createClient();
    const { data } = await sb.from("listings").select("*").eq("slug", slug).maybeSingle();
    return (data as Listing) ?? null;
  } catch {
    return null;
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = await createClient();
    const { data } = await sb.from("listings").select("*").eq("id", id).maybeSingle();
    return (data as Listing) ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

// Mémoïsé par requête (React.cache) : layout + gardes + pages le rappellent.
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return null;
    const { data } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();
    return (data as Profile) ?? null;
  } catch {
    return null;
  }
});

/** Admin = rôle 'admin'/'super_admin' en base OU email listé dans ADMIN_EMAILS. */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  if (!profile) return false;
  if (profile.role === "admin" || profile.role === "super_admin") return true;
  return adminEmails().includes((profile.email || "").toLowerCase());
}

/** Super admin = rôle 'super_admin' en base OU email listé dans ADMIN_EMAILS (le propriétaire). */
export async function isCurrentUserSuperAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  if (!profile) return false;
  if (profile.role === "super_admin") return true;
  return adminEmails().includes((profile.email || "").toLowerCase());
}

export async function getMyOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = await createClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return [];
    const { data } = await sb
      .from("orders")
      .select("*, listing:listings(*)")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });
    return (data as Order[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = await createClient();
    const { data } = await sb
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as Profile[]) ?? [];
  } catch {
    return [];
  }
}

// M7 — Client service_role (et non RLS) : appelée uniquement depuis l'export
// admin (gardé par isCurrentUserAdmin). Évite un CSV tronqué/vide pour un admin
// défini via ADMIN_EMAILS (que is_admin() en base ne reconnaît pas).
export async function getAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];
  // E8 — garde d'autorisation interne (cette fonction contourne la RLS).
  if (!(await isCurrentUserAdmin())) return [];
  try {
    const sb = createAdminClient();
    const { data } = await sb
      .from("orders")
      .select("*, listing:listings(*)")
      .order("created_at", { ascending: false });
    return (data as Order[]) ?? [];
  } catch {
    return [];
  }
}
