// Choisit l'image d'une fiche : visuel métier/ville de /assets/listings.
// Les covers de blog (/assets/images/cover-*) ne sont PAS des images de fiche.

/** Métiers disposant d'un visuel générique dans /assets/listings/{slug}.png */
const HAS_METIER_IMG = new Set([
  "plombier", "serrurier", "electricien", "macon", "restaurant", "dentiste", "immobilier",
]);

/** Combinaisons métier-ville disposant d'un visuel dédié. */
const CITY_IMAGES = new Set([
  "plombier-toulouse", "serrurier-bordeaux", "dentiste-nice",
  "immobilier-lille", "restaurant-nantes", "electricien-rennes",
]);

const citySlug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Renvoie l'URL d'image à afficher pour une fiche.
 * Une image en base est utilisée seulement si c'est un vrai visuel de fiche
 * (pas une cover de blog héritée du seed). Sinon on calcule depuis métier/ville.
 */
export function listingImage(metierSlug: string, city: string, dbImage?: string | null): string {
  if (dbImage && !dbImage.includes("/cover-") && dbImage.trim() !== "") return dbImage;
  const key = `${metierSlug}-${citySlug(city)}`;
  if (CITY_IMAGES.has(key)) return `/assets/listings/${key}.png`;
  if (HAS_METIER_IMG.has(metierSlug)) return `/assets/listings/${metierSlug}.png`;
  return "/assets/listings/default.png";
}
