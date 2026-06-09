import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Lit une table Supabase et mappe chaque ligne vers la forme attendue par l'UI.
 * Repli automatique sur `fallback` si Supabase n'est pas configuré, si la table
 * est absente, ou si elle est vide. Ainsi les écrans restent fidèles aux
 * maquettes tant que la migration n'est pas appliquée, puis basculent
 * automatiquement sur les vraies données une fois la base seedée.
 */
export async function table<T>(
  name: string,
  map: (row: Record<string, unknown>) => T,
  fallback: T[],
  opts?: { order?: string; ascending?: boolean; limit?: number }
): Promise<T[]> {
  if (!isSupabaseConfigured()) return fallback;
  try {
    const sb = await createClient();
    let q = sb.from(name).select("*");
    if (opts?.order) q = q.order(opts.order, { ascending: opts.ascending ?? false });
    if (opts?.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error || !data || data.length === 0) return fallback;
    return (data as Record<string, unknown>[]).map(map);
  } catch {
    return fallback;
  }
}

/** Compte les lignes d'une table (repli `fallback`). */
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

export const s = (v: unknown, d = "") => (v == null ? d : String(v));
export const n = (v: unknown, d = 0) => (v == null || isNaN(Number(v)) ? d : Number(v));
