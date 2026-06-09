"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Enregistre un avis acheteur (RLS : doit avoir acheté la fiche). */
export async function submitReviewAction(formData: FormData) {
  if (!isSupabaseConfigured()) return;

  const listingId = String(formData.get("listing_id") || "");
  const slug = String(formData.get("slug") || "");
  const rating = Number(formData.get("rating") || 0);
  const comment = String(formData.get("comment") || "").trim();
  const authorName = String(formData.get("author_name") || "").trim();

  if (!listingId || rating < 1 || rating > 5) return;

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return;

  await sb.from("reviews").insert({
    listing_id: listingId,
    buyer_id: user.id,
    rating,
    comment: comment || null,
    author_name: authorName || null,
  });

  if (slug) revalidatePath(`/fiches-google/${slug}`);
}
