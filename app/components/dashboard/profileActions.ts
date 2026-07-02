"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createSbClient } from "@supabase/supabase-js";
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

export type PasswordResult = { ok?: boolean; error?: "wrong" | "weak" | "same" | "failed" };

/**
 * C2 — Changement de mot de passe sécurisé.
 * L'ancien mot de passe est vérifié via un client Supabase ÉPHÉMÈRE
 * (persistSession: false) : la session active de l'utilisateur n'est jamais
 * réécrite (pas de last_sign_in_at faussé, pas de rotation de tokens).
 */
export async function changePasswordAction(oldPassword: string, newPassword: string): Promise<PasswordResult> {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user?.email) return { error: "failed" };

  if (newPassword.length < 8) return { error: "weak" };
  if (newPassword === oldPassword) return { error: "same" };

  // Vérification de l'ancien mot de passe sans impacter la session courante.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const verifier = createSbClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: vErr } = await verifier.auth.signInWithPassword({ email: user.email, password: oldPassword });
  if (vErr) return { error: "wrong" };

  // Met à jour le mot de passe via la session réelle (client serveur courant).
  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) return { error: "failed" };
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

  const { error: dbErr } = await sb.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  if (dbErr) return { error: "Échec de l'enregistrement de la photo." };
  await sb.auth.updateUser({ data: { avatar_url: url } });

  revalidatePath("/compte/profil");
  revalidatePath("/admin/profil");
  revalidatePath("/compte");
  revalidatePath("/admin");
  return { ok: true };
}

export type DeleteAccountState = { error?: "admin" | "failed" } | null;

/**
 * Suppression de compte (acheteur uniquement) = anonymisation RGPD (M4 / C3).
 * On conserve la ligne profil et les commandes/factures (obligation légale ~10 ans).
 * On retire les PII directement personnelles (nom, email de compte, téléphone, avatar,
 * nom d'auteur des avis). Les champs billing_name/billing_email des commandes FACTURÉES
 * sont VOLONTAIREMENT conservés : ce sont des mentions obligatoires de la facture
 * (art. 242 nonies A CGI), couvertes par l'exception de conservation légale du RGPD.
 *
 * C3 — chaque étape est vérifiée : en cas d'échec, on N'EFFECTUE PAS la déconnexion
 * et on renvoie une erreur (au lieu de laisser croire à une suppression réussie).
 */
export async function deleteOwnAccountAction(_prev: DeleteAccountState, _formData: FormData): Promise<DeleteAccountState> {
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: "failed" };

  // Interdit aux administrateurs et super administrateurs.
  if (await isCurrentUserAdmin()) return { error: "admin" };

  const admin = createAdminClient();
  const anonEmail = `deleted-${user.id.slice(0, 8)}@anonymized.invalid`;

  // 1) Anonymise le profil (PII retirée) + marque anonymisé (badge admin).
  const { error: profErr } = await admin
    .from("profiles")
    .update({ full_name: "Utilisateur supprimé", email: anonEmail, phone: null, avatar_url: null, anonymized: true })
    .eq("id", user.id);
  if (profErr) return { error: "failed" };

  // 2) Anonymise les avis laissés par l'utilisateur (nom d'auteur + commentaire libre).
  const { error: revErr } = await admin
    .from("reviews")
    .update({ author_name: "Utilisateur supprimé", comment: null })
    .eq("buyer_id", user.id);
  if (revErr) return { error: "failed" };

  // 3) Compte auth : email anonymisé, métadonnées vidées, connexion bloquée.
  const { error: authErr } = await admin.auth.admin.updateUserById(user.id, {
    email: anonEmail,
    user_metadata: {},
    ban_duration: "876000h",
  });
  if (authErr) return { error: "failed" };

  // Toutes les étapes ont réussi : on déconnecte et on redirige.
  await sb.auth.signOut();
  redirect("/");
}
