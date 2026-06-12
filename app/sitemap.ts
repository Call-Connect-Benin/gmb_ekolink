import type { MetadataRoute } from "next";
import { getListings } from "@/lib/queries";

const BASE = "https://ekolink.dev";

const routes = [
  "/",
  "/a-propos",
  "/contact",
  "/fiches-google",
  "/comment-ca-marche",
  "/faq",
  "/blog",
  "/blog/avis-google-supprimes",
  "/blog/cas-boulangerie-340-appels",
  "/blog/pack-local-30-jours",
  "/blog/photos-google-business",
  "/blog/repondre-avis-modeles",
  "/blog/update-google-maps-2026",
  "/cgv",
  "/politique-confidentialite",
  "/politique-cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "/" || path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/blog/") ? 0.6 : 0.8,
  }));

  // M9 — Fiches générées dynamiquement (sinon invisibles du sitemap → non indexées).
  const listings = await getListings();
  const listingEntries: MetadataRoute.Sitemap = listings
    .filter((l) => l.slug)
    .map((l) => ({
      url: `${BASE}/fiches-google/${l.slug}`,
      lastModified: l.created_at ? new Date(l.created_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  return [...staticEntries, ...listingEntries];
}
