// E10 — Numéro WhatsApp unique (source de vérité). Surchargage possible via
// NEXT_PUBLIC_WHATSAPP. Évite les numéros divergents et les liens wa.me/ vides.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP || "33644678642";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
