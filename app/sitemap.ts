import type { MetadataRoute } from "next";

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
  "/mentions-legales",
  "/cgv",
  "/politique-confidentialite",
  "/politique-cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: path === "/" || path.startsWith("/blog") ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/blog/") ? 0.6 : 0.8,
  }));
}
