/** Indique si les variables Supabase sont présentes (sinon : mode « non configuré »). */
export const isSupabaseConfigured = () =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

// Stripe « configuré » = vraie clé secrète serveur, et pas un placeholder xxx.
// Accepte sk_ (clé secrète standard) et rk_ (clé restreinte) — les deux sont
// des clés serveur valides ; une clé rk_ doit disposer des bonnes permissions
// (Checkout Sessions en écriture) pour que la création de paiement aboutisse.
export const isStripeConfigured = () => {
  const k = process.env.STRIPE_SECRET_KEY || "";
  return (k.startsWith("sk_") || k.startsWith("rk_")) && !k.includes("xxx");
};

export const adminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
