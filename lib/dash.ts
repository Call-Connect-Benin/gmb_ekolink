import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Opts = { order?: string; ascending?: boolean; limit?: number };

/**
 * Lit une table Supabase (client RLS) et mappe chaque ligne vers la forme UI.
 * Repli sur `fallback` UNIQUEMENT si Supabase n'est pas configuré, si la table
 * est absente, ou en cas d'erreur. Une table légitimement VIDE renvoie [] (et
 * non les données de maquette).
 */
export async function table<T>(
  name: string,
  map: (row: Record<string, unknown>) => T,
  fallback: T[],
  opts?: Opts
): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const sb = await createClient();
    let q = sb.from(name).select("*");
    if (opts?.order) q = q.order(opts.order, { ascending: opts.ascending ?? false });
    if (opts?.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error || !data) return fallback;
    return (data as Record<string, unknown>[]).map(map);
  } catch {
    return fallback;
  }
}

/**
 * Variante service_role (contourne la RLS). À utiliser uniquement derrière une
 * garde admin (layout `/admin`). Indispensable pour les écrans admin afin que les
 * agrégats soient corrects même pour un admin défini par ADMIN_EMAILS (que
 * `is_admin()` en base ne reconnaît pas).
 */
export async function tableAdmin<T>(
  name: string,
  map: (row: Record<string, unknown>) => T,
  opts?: Opts
): Promise<T[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = createAdminClient();
    let q = sb.from(name).select("*");
    if (opts?.order) q = q.order(opts.order, { ascending: opts.ascending ?? false });
    if (opts?.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error || !data) return [];
    return (data as Record<string, unknown>[]).map(map);
  } catch {
    return [];
  }
}

/** Compte les lignes d'une table (client RLS ; repli `fallback`). */
export async function count(name: string, fallback: number): Promise<number> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const sb = await createClient();
    const { count: c, error } = await sb.from(name).select("*", { count: "exact", head: true });
    if (error || c == null) return fallback;
    return c;
  } catch {
    return fallback;
  }
}

/** Compte service_role (contourne la RLS ; derrière garde admin). */
export async function countAdmin(name: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const sb = createAdminClient();
    const { count: c, error } = await sb.from(name).select("*", { count: "exact", head: true });
    if (error || c == null) return 0;
    return c;
  } catch {
    return 0;
  }
}

export const s = (v: unknown, d = "") => (v == null ? d : String(v));
export const n = (v: unknown, d = 0) => (v == null || isNaN(Number(v)) ? d : Number(v));
