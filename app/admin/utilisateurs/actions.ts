"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isCurrentUserAdmin, isCurrentUserSuperAdmin, getCurrentProfile } from "@/lib/queries";
import { adminEmails, superAdminEmails } from "@/lib/supabase/config";

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

// Note : le changement de rôle depuis le menu d'actions utilisateur a été retiré.
// L'attribution de rôle se fait à la création (createUserAction) et via la page
// dédiée « Rôles » (createAdminAction). Cela réduit la surface d'escalade/rétrogradation
// latérale entre administrateurs (cf. audit E2).

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

  // Email vérifié + rôle de la cible (protection propriétaire / dernier super_admin).
  const { data: targetAuth } = await admin.auth.admin.getUserById(id);
  const targetEmail = (targetAuth?.user?.email || "").toLowerCase();
  const { data: targetProfile } = await admin.from("profiles").select("role").eq("id", id).maybeSingle();

  // Le propriétaire (listé dans SUPER_ADMIN_EMAILS/ADMIN_EMAILS) ne peut jamais être supprimé.
  if (targetEmail && (superAdminEmails().includes(targetEmail) || adminEmails().includes(targetEmail))) {
    throw new Error("Ce compte administrateur (propriétaire) ne peut pas être supprimé.");
  }

  // Impossible de supprimer le dernier super administrateur (verrouillage du back-office).
  if (targetProfile?.role === "super_admin") {
    const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).eq("role", "super_admin");
    if ((count ?? 0) <= 1) {
      throw new Error("Impossible de supprimer le dernier super administrateur.");
    }
  }

  const { error: delErr } = await admin.auth.admin.deleteUser(id);
  if (delErr) throw new Error(delErr.message);
  await admin.from("profiles").delete().eq("id", id); // au cas où la cascade n'opère pas

  revalidatePath("/admin/utilisateurs");
}
