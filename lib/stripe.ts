import "server-only";
import Stripe from "stripe";

/** Instance Stripe côté serveur (lazy : ne lève que si réellement utilisée sans clé). */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY manquant — renseignez-le dans .env.local (voir .env.local.example)."
    );
  }
  return new Stripe(key);
}
