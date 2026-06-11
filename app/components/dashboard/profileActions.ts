"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/queries";

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

export type ProfileFormState = { ok?: boolean; error?: boolean } | null;

/** Met à jour le profil de l'utilisateur courant (nom + téléphone). Retourne un état pour le feedback UI. */
export async function updateProfileAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: true };

  const firstName = str(formData.get("firstName"));
  const lastName = str(formData.get("lastName"));
  const phone = str(formData.get("phone"));
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const { error } = await sb.from("profiles").update({ full_name: fullName || null, phone: phone || null }).eq("id", user.id);
  if (error) return { error: true };
  await sb.auth.updateUser({ data: { full_name: fullName } });

  revalidatePath("/compte/profil");
  revalidatePath("/admin/profil");
  revalidatePath("/compte");
  revalidatePath("/admin");
  return { ok: true };
}

/** Téléverse une nouvelle photo de profil pour l'utilisateur courant et enregistre son URL. */
export async function uploadAvatarAction(formData: FormData) {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return;

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return;
  if (!file.type.startsWith("image/")) throw new Error("Le fichier doit être une image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("L'image ne doit pas dépasser 5 Mo.");

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${user.id}/avatar.${ext}`;

  // Upload via le client service_role (contourne la RLS du storage).
  const admin = createAdminClient();
  const { error: upErr } = await admin.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (upErr) throw new Error(upErr.message);

  const { data: pub } = admin.storage.from("avatars").getPublicUrl(path);
  // Cache-buster pour forcer le rafraîchissement de l'image après remplacement.
  const url = `${pub.publicUrl}?v=${Date.now()}`;

  await sb.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  await sb.auth.updateUser({ data: { avatar_url: url } });

  revalidatePath("/compte/profil");
  revalidatePath("/admin/profil");
  revalidatePath("/compte");
  revalidatePath("/admin");
}

/** Supprime le compte de l'utilisateur courant (acheteur uniquement). Déconnecte puis redirige. */
export async function deleteOwnAccountAction() {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return;

  // Interdit aux administrateurs et super administrateurs.
  if (await isCurrentUserAdmin()) {
    throw new Error("La suppression de compte est désactivée pour les administrateurs.");
  }

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(user.id);
  await sb.auth.signOut();
  redirect("/");
}
