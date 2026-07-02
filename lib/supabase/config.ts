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

const parseEmails = (raw: string | undefined) =>
  (raw || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const adminEmails = () => parseEmails(process.env.ADMIN_EMAILS);

// Super administrateurs par email : variable DÉDIÉE (ne pas réutiliser ADMIN_EMAILS,
// sinon tout admin listé obtiendrait les droits super_admin — escalade). Vide = super
// admin uniquement via le rôle 'super_admin' en base.
export const superAdminEmails = () => parseEmails(process.env.SUPER_ADMIN_EMAILS);
