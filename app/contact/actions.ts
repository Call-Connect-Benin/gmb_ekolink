"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { notifyN8n } from "@/lib/notify";

const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

/** Enregistre un message de contact (table contacts) + notifie l'équipe (n8n). */
export async function submitContactAction(formData: FormData): Promise<{ ok: boolean }> {
  // Honeypot anti-spam : champ « website » rempli = bot → on ignore silencieusement.
  if (str(formData.get("website"))) return { ok: true };

  const email = str(formData.get("email"));
  const message = str(formData.get("message"));
  if (!email || message.length < 20) {
    throw new Error("Email et message (≥ 20 caractères) requis.");
  }

  const payload = {
    firstname: str(formData.get("firstname")) || null,
    lastname: str(formData.get("lastname")) || null,
    email,
    phone: str(formData.get("phone")) || null,
    company: str(formData.get("company")) || null,
    subject: str(formData.get("subject")) || null,
    message,
  };

  if (isSupabaseConfigured()) {
    const { error } = await createAdminClient().from("contacts").insert(payload);
    if (error) throw new Error(error.message);
  }

  // Notification équipe (email via n8n) — best-effort, n'échoue pas la soumission.
  await notifyN8n("contact.received", payload);

  return { ok: true };
}
