// Types métier de la marketplace (alignés sur le schéma Supabase).

export type ListingStatus = "available" | "reserved" | "sold";
/** vierge = optimisée sans avis ; historique = avec historique d'avis */
export type ListingState = "vierge" | "historique";
export type OrderStatus =
  | "pending" // commande créée, paiement non confirmé
  | "paid" // paiement Stripe confirmé
  | "in_progress" // transfert de la fiche en cours
  | "delivered" // fiche transférée à l'acheteur
  | "validated" // acheteur a confirmé la réception
  | "cancelled";

export type Category = {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string;
  icon: string | null;
};

export type Listing = {
  id: string;
  title: string;
  slug: string;
  category_slug: string;
  city: string;
  postal_code: string | null;
  price: number; // en euros TTC
  status: ListingStatus;
  state: ListingState;
  description: string | null;
  images: string[];
  gallery: { url: string; title: string }[];
  seo_score: number | null;
  photos_count: number;
  reviews_count: number;
  rating: number | null;
  categories_count: number;
  local_citations: number;
  visibility: "low" | "medium" | "high";
  delivery_time: string; // délai de livraison affiché, ex. « 24-48h »
  created_at: string;
};

export type Order = {
  id: string;
  listing_id: string;
  buyer_id: string;
  stripe_session_id: string | null;
  status: OrderStatus;
  amount: number;
  created_at: string;
  listing?: Listing | null;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "buyer" | "admin" | "super_admin";
  created_at: string;
};

export type Review = {
  id: string;
  listing_id: string;
  buyer_id: string;
  rating: number;
  comment: string | null;
  author_name: string | null;
  created_at: string;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente de paiement",
  paid: "Payé",
  in_progress: "Transfert en cours",
  delivered: "Livré",
  validated: "Validé",
  cancelled: "Annulé",
};

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  available: "Disponible",
  reserved: "Réservé",
  sold: "Vendu",
};

export const LISTING_STATE_LABELS: Record<ListingState, string> = {
  vierge: "Vierge optimisée",
  historique: "Avec historique d'avis",
};
