"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
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

export type AvatarState = { ok?: boolean; error?: string } | null;

/** Téléverse une photo de profil et enregistre son URL. Retourne un état (spinner/erreur). */
export async function uploadAvatarAction(_prev: AvatarState, formData: FormData): Promise<AvatarState> {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: "Non authentifié." };

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) return null;

  // Upload sur Cloudinary (whitelist MIME + taille gérées dans le helper).
  // publicId = id utilisateur → l'ancienne photo est remplacée (pas d'accumulation).
  const up = await uploadImageToCloudinary(file, { folder: "ekolink/avatars", publicId: user.id });
  if (up.error || !up.url) return { error: up.error ?? "Échec de l'upload." };
  const url = up.url;

  await sb.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  await sb.auth.updateUser({ data: { avatar_url: url } });

  revalidatePath("/compte/profil");
  revalidatePath("/admin/profil");
  revalidatePath("/compte");
  revalidatePath("/admin");
  return { ok: true };
}

/**
 * Suppression de compte (acheteur uniquement) = anonymisation RGPD (M4).
 * On conserve la ligne profil et les commandes/factures (obligation légale ~10 ans),
 * mais on retire toutes les données personnelles et on bloque l'accès au compte.
 */
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
  const anonEmail = `deleted-${user.id.slice(0, 8)}@anonymized.invalid`;

  // 1) Anonymise le profil (PII retirée) + marque anonymisé (badge admin).
  await admin
    .from("profiles")
    .update({ full_name: "Utilisateur supprimé", email: anonEmail, phone: null, avatar_url: null, anonymized: true })
    .eq("id", user.id);

  // 2) Anonymise les avis laissés par l'utilisateur (nom d'auteur + commentaire libre).
  await admin.from("reviews").update({ author_name: "Utilisateur supprimé", comment: null }).eq("buyer_id", user.id);

  // 3) Compte auth : email anonymisé, métadonnées vidées, connexion bloquée.
  await admin.auth.admin.updateUserById(user.id, {
    email: anonEmail,
    user_metadata: {},
    ban_duration: "876000h",
  });

  await sb.auth.signOut();
  redirect("/");
}
