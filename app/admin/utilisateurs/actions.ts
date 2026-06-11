"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin, isCurrentUserSuperAdmin, getCurrentProfile } from "@/lib/queries";

const ROLES = ["buyer", "admin"];

async function assertAdmin() {
  if (!(await isCurrentUserAdmin())) {
    throw new Error("Accès refusé : réservé aux administrateurs.");
  }
}

/** Empêche un admin simple de rétrograder/supprimer un super administrateur. */
async function assertCanManageTarget(targetId: string) {
  const admin = createAdminClient();
  const { data } = await admin.from("profiles").select("role").eq("id", targetId).maybeSingle();
  if (data?.role === "super_admin" && !(await isCurrentUserSuperAdmin())) {
    throw new Error("Seul un super administrateur peut modifier un super administrateur.");
  }
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Crée un utilisateur (compte auth + profil), email auto-confirmé. */
export async function createUserAction(formData: FormData) {
  await assertAdmin();
  const admin = createAdminClient();

  const email = str(formData.get("email"));
  const password = str(formData.get("password"));
  const fullName = str(formData.get("full_name"));
  const role = ROLES.includes(str(formData.get("role"))) ? str(formData.get("role")) : "buyer";
  if (!email || password.length < 6) {
    throw new Error("Email requis et mot de passe d'au moins 6 caractères.");
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (error) throw new Error(error.message);

  // Le trigger crée le profil (role 'buyer') ; on aligne nom + rôle choisi.
  if (data.user) {
    await admin.from("profiles").update({ full_name: fullName, role }).eq("id", data.user.id);
  }

  revalidatePath("/admin/utilisateurs");
}

/** Change le rôle d'un utilisateur (buyer ↔ admin). */
export async function updateUserRoleAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  const role = str(formData.get("role"));
  if (id && ROLES.includes(role)) {
    await assertCanManageTarget(id);
    const admin = createAdminClient();
    await admin.from("profiles").update({ role }).eq("id", id);
  }
  revalidatePath("/admin/utilisateurs");
}

/** Supprime un utilisateur (compte auth + profil). Impossible sur son propre compte. */
export async function deleteUserAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  if (!id) return;

  const me = await getCurrentProfile();
  if (me?.id === id) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  }
  await assertCanManageTarget(id);

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(id);
  await admin.from("profiles").delete().eq("id", id); // au cas où la cascade n'opère pas

  revalidatePath("/admin/utilisateurs");
}
