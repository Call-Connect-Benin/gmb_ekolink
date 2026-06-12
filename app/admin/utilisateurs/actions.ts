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

/** Attribuer/créer le rôle « admin » est réservé au super administrateur (E2/E3). */
async function assertCanGrantRole(role: string) {
  if (role === "admin" && !(await isCurrentUserSuperAdmin())) {
    throw new Error("Seul un super administrateur peut attribuer le rôle administrateur.");
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

export type UserActionState = { ok?: boolean; error?: string } | null;

/** Crée un utilisateur (compte auth + profil), email auto-confirmé. Retourne un état (E9). */
export async function createUserAction(_prev: UserActionState, formData: FormData): Promise<UserActionState> {
  try {
    await assertAdmin();
    const admin = createAdminClient();

    const email = str(formData.get("email"));
    const password = str(formData.get("password"));
    const fullName = str(formData.get("full_name"));
    const role = ROLES.includes(str(formData.get("role"))) ? str(formData.get("role")) : "buyer";
    await assertCanGrantRole(role);
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

    // Le trigger crée le profil (role 'buyer') ; on aligne nom + rôle choisi.
    // E7 — si l'alignement du rôle échoue, on rollback le compte auth.
    if (data.user) {
      const { error: roleErr } = await admin.from("profiles").update({ full_name: fullName, role }).eq("id", data.user.id);
      if (roleErr) {
        await admin.auth.admin.deleteUser(data.user.id);
        return { error: roleErr.message };
      }
    }

    revalidatePath("/admin/utilisateurs");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erreur lors de la création." };
  }
}

/** Change le rôle d'un utilisateur (buyer ↔ admin). */
export async function updateUserRoleAction(formData: FormData) {
  await assertAdmin();
  const id = str(formData.get("id"));
  const role = str(formData.get("role"));
  if (id && ROLES.includes(role)) {
    await assertCanManageTarget(id);
    await assertCanGrantRole(role); // E3 — promotion vers admin = super_admin only
    const admin = createAdminClient();
    const { error } = await admin.from("profiles").update({ role }).eq("id", id);
    if (error) throw new Error(error.message);
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
  const { error: delErr } = await admin.auth.admin.deleteUser(id);
  if (delErr) throw new Error(delErr.message);
  await admin.from("profiles").delete().eq("id", id); // au cas où la cascade n'opère pas

  revalidatePath("/admin/utilisateurs");
}
