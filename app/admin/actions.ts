"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { isCurrentUserAdmin, isCurrentUserSuperAdmin } from "@/lib/queries";

async function assertAdmin() {
  if (!(await isCurrentUserAdmin())) {
    throw new Error("Accès refusé : réservé aux administrateurs.");
  }
}

async function assertSuperAdmin() {
  if (!(await isCurrentUserSuperAdmin())) {
    throw new Error("Accès refusé : réservé au super administrateur.");
  }
}

/** Crée un administrateur (rôle admin ou super_admin). Réservé au super admin. */
export type AdminActionState = { ok?: boolean; error?: string } | null;

export async function createAdminAction(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  try {
    await assertSuperAdmin();
    const admin = createAdminClient();

    const email = str(formData.get("email"));
    const password = str(formData.get("password"));
    const fullName = str(formData.get("full_name"));
    const role = ["admin", "super_admin"].includes(str(formData.get("role"))) ? str(formData.get("role")) : "admin";
    if (!email || password.length < 8) {
      return { error: "Email requis et mot de passe d'au moins 8 caractères." };
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error) return { error: error.message };
    if (data.user) {
      // E7 — rollback du compte auth si l'attribution du rôle échoue.
      const { error: roleErr } = await admin.from("profiles").update({ full_name: fullName, role }).eq("id", data.user.id);
      if (roleErr) {
        await admin.auth.admin.deleteUser(data.user.id);
        return { error: roleErr.message };
      }
    }

    revalidatePath("/admin/roles");
    revalidatePath("/admin/utilisateurs");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la création." };
  }
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Téléverse une image de galerie de fiche sur Cloudinary et renvoie son URL. */
export async function uploadListingImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
  await assertAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Fichier manquant." };
  return uploadImageToCloudinary(file, { folder: "ekolink/listings" });
}

export async function saveListingAction(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const id = str(formData.get("id"));
  let gallery: { url: string; title: string }[] = [];
  try {
    const raw: unknown = JSON.parse(str(formData.get("gallery")) || "[]");
    if (Array.isArray(raw)) {
      gallery = raw
        .filter((g): g is { url: string; title?: string } => Boolean(g) && typeof (g as { url?: unknown }).url === "string" && (g as { url: string }).url.trim() !== "")
        .map((g) => ({ url: g.url.trim(), title: typeof g.title === "string" ? g.title : "" }));
    }
  } catch {
    gallery = [];
  }
  const images = gallery.length ? gallery.map((g) => g.url) : ["/assets/listings/default.png"];
  const ratingRaw = str(formData.get("rating"));
  // Borne la note à 0–5 (la colonne est numeric(2,1) : une valeur > 9.9 ferait échouer l'insert).
  const ratingVal = ratingRaw ? Math.min(5, Math.max(0, Number(ratingRaw) || 0)) : null;

  const payload = {
    title: str(formData.get("title")),
    slug: str(formData.get("slug")),
    category_slug: str(formData.get("category_slug")),
    city: str(formData.get("city")),
    postal_code: str(formData.get("postal_code")) || null,
    price: Math.max(0, Math.round(Number(str(formData.get("price"))) || 0)),
    status: str(formData.get("status")) || "available",
    state: str(formData.get("state")) || "vierge",
    description: str(formData.get("description")) || null,
    images,
    gallery,
    photos_count: Number(str(formData.get("photos_count")) || 0),
    reviews_count: Number(str(formData.get("reviews_count")) || 0),
    rating: ratingVal,
    seo_score: Number(str(formData.get("seo_score")) || 0),
    categories_count: Number(str(formData.get("categories_count")) || 0),
    local_citations: Number(str(formData.get("local_citations")) || 0),
    visibility: ["low", "medium", "high"].includes(str(formData.get("visibility")))
      ? str(formData.get("visibility"))
      : "high",
    delivery_time: str(formData.get("delivery_time")) || "24-48h",
  };

  // E5 — Supabase retourne l'erreur (slug unique, NOT NULL…) sans throw :
  // on la remonte pour ne pas afficher un faux succès et rediriger à tort.
  const { error } = id
    ? await admin.from("listings").update(payload).eq("id", id)
    : await admin.from("listings").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/fiches");
  revalidatePath("/fiches-google");
  redirect("/admin/fiches");
}

export async function deleteListingAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  if (id) {
    const admin = createAdminClient();
    // M6 — Garde-fou FK : une fiche avec des commandes (orders.listing_id RESTRICT)
    // ne peut pas être supprimée. On le signale explicitement plutôt que d'avaler l'erreur.
    const { count } = await admin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("listing_id", id);
    if ((count ?? 0) > 0) {
      throw new Error(`Impossible de supprimer cette fiche : ${count} commande(s) y sont rattachées.`);
    }
    const { error } = await admin.from("listings").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/fiches");
  revalidatePath("/fiches-google");
}

export async function saveCategoryAction(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const id = str(formData.get("id"));
  const nameFr = str(formData.get("name_fr"));
  const payload = {
    slug: str(formData.get("slug")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    name_fr: nameFr,
    name_en: str(formData.get("name_en")) || nameFr,
    icon: str(formData.get("icon")) || null,
  };

  // E7 — on remonte l'erreur (slug en doublon, contrainte…) au lieu d'un faux succès.
  const { error } = id
    ? await admin.from("categories").update(payload).eq("id", id)
    : await admin.from("categories").insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/fiches-google");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();
  const id = str(formData.get("id"));
  const slug = str(formData.get("slug"));

  if (id) {
    // Garde-fou : une catégorie rattachée à des fiches ne peut pas être supprimée (clé étrangère).
    if (slug) {
      const { count } = await admin
        .from("listings")
        .select("id", { count: "exact", head: true })
        .eq("category_slug", slug);
      if ((count ?? 0) > 0) {
        throw new Error(`Impossible de supprimer « ${slug} » : ${count} fiche(s) y sont rattachées. Réaffectez-les d'abord.`);
      }
    }
    const { error } = await admin.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/fiches-google");
  revalidatePath("/");
}

export async function updateOrderStatusAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  const status = str(formData.get("status"));
  const allowed = ["pending", "paid", "in_progress", "delivered", "validated", "cancelled"];
  if (id && allowed.includes(status)) {
    const admin = createAdminClient();
    const { error } = await admin.from("orders").update({ status }).eq("id", id);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin");
  revalidatePath("/admin/commandes");
}
