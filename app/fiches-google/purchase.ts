"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentProfile } from "@/lib/queries";
import { WHATSAPP_NUMBER } from "@/lib/contact";

export type PurchaseResult = { needsAuth?: boolean; error?: string; whatsappUrl?: string };

/**
 * Achat manuel via WhatsApp (plus de paiement Stripe interne).
 * - Réservé aux comptes `buyer` (admin/super_admin bloqués).
 * - Réserve la fiche (available → reserved) et crée une commande `pending`,
 *   référencée dans /admin/commandes pour validation par l'admin.
 * - Renvoie une URL WhatsApp pré-remplie (Client · Fiche · Montant).
 */
export async function requestPurchaseAction(listingId: string): Promise<PurchaseResult> {
  if (!isSupabaseConfigured()) return { error: "Service indisponible." };
  if (!listingId) return { error: "Fiche manquante." };

  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { needsAuth: true };

  // Seuls les comptes acheteur peuvent acheter.
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "buyer") {
    return { error: "Seuls les comptes acheteur peuvent acheter une fiche." };
  }

  const admin = createAdminClient();
  const { data: listing } = await admin
    .from("listings")
    .select("id,title,city,price,status")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing) return { error: "Fiche introuvable." };
  if (listing.status !== "available") return { error: "Cette fiche n'est plus disponible." };

  // Réservation atomique : seul le premier acheteur concurrent passe.
  const { data: reserved } = await admin
    .from("listings")
    .update({ status: "reserved" })
    .eq("id", listingId)
    .eq("status", "available")
    .select("id");
  if (!reserved || reserved.length === 0) return { error: "Cette fiche vient d'être réservée." };

  // Commande `pending` (= réservée) + snapshot de facturation (données serveur de confiance).
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .insert({
      listing_id: listing.id,
      buyer_id: user.id,
      amount: listing.price,
      status: "pending",
      billing_name: profile.full_name,
      billing_email: profile.email,
      listing_title: listing.title,
      listing_city: listing.city,
    })
    .select("id")
    .single();
  if (orderErr || !order) {
    // Rollback de la réservation si la commande n'a pas pu être créée.
    await admin.from("listings").update({ status: "available" }).eq("id", listing.id).eq("status", "reserved");
    return { error: "Impossible de créer la commande." };
  }

  // Message WhatsApp pré-rempli : Client · Fiche · Montant.
  const ref = `#CMD-${order.id.slice(0, 8).toUpperCase()}`;
  const clientName = profile.full_name || profile.email || "Client";
  const message =
    `Bonjour, je souhaite acheter une fiche Google Business.\n` +
    `Commande : ${ref}\n` +
    `Client : ${clientName}\n` +
    `Fiche : ${listing.title}${listing.city ? ` (${listing.city})` : ""}\n` +
    `Montant : ${listing.price} €`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return { whatsappUrl };
}
