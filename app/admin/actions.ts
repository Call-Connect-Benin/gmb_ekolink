"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/queries";

async function assertAdmin() {
  if (!(await isCurrentUserAdmin())) {
    throw new Error("Accès refusé : réservé aux administrateurs.");
  }
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
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

  const payload = {
    title: str(formData.get("title")),
    slug: str(formData.get("slug")),
    category_slug: str(formData.get("category_slug")),
    city: str(formData.get("city")),
    postal_code: str(formData.get("postal_code")) || null,
    price: Number(str(formData.get("price")) || 0),
    status: str(formData.get("status")) || "available",
    state: str(formData.get("state")) || "vierge",
    description: str(formData.get("description")) || null,
    images,
    gallery,
    photos_count: Number(str(formData.get("photos_count")) || 0),
    reviews_count: Number(str(formData.get("reviews_count")) || 0),
    rating: ratingRaw ? Number(ratingRaw) : null,
    seo_score: Number(str(formData.get("seo_score")) || 0),
    categories_count: Number(str(formData.get("categories_count")) || 0),
    local_citations: Number(str(formData.get("local_citations")) || 0),
    visibility: ["low", "medium", "high"].includes(str(formData.get("visibility")))
      ? str(formData.get("visibility"))
      : "high",
  };

  if (id) {
    await admin.from("listings").update(payload).eq("id", id);
  } else {
    await admin.from("listings").insert(payload);
  }

  revalidatePath("/admin");
  revalidatePath("/fiches-google");
  redirect("/admin");
}

export async function deleteListingAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  if (id) {
    const admin = createAdminClient();
    await admin.from("listings").delete().eq("id", id);
  }
  revalidatePath("/admin");
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

  if (id) {
    await admin.from("categories").update(payload).eq("id", id);
  } else {
    await admin.from("categories").insert(payload);
  }

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
    await admin.from("categories").delete().eq("id", id);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/fiches-google");
  revalidatePath("/");
}

export async function updateOrderStatusAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  const status = str(formData.get("status"));
  if (id && status) {
    const admin = createAdminClient();
    await admin.from("orders").update({ status }).eq("id", id);
  }
  revalidatePath("/admin");
}
