/** Indique si les variables Supabase sont présentes (sinon : mode « non configuré »). */
export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

// Stripe « configuré » = vraie clé secrète (préfixe sk_ et pas un placeholder xxx).
export const isStripeConfigured = () => {
  const k = process.env.STRIPE_SECRET_KEY || "";
  return k.startsWith("sk_") && !k.includes("xxx");
};

export const adminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
