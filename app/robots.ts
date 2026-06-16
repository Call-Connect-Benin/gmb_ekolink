import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/compte", "/admin", "/auth"],
    },
    sitemap: "https://gmb.ekolink.dev/sitemap.xml",
    host: "https://gmb.ekolink.dev",
  };
}
