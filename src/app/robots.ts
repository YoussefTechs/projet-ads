import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/url";

/** robots.txt (cf. PHASE-2-SEO §16). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/compte",
        "/api/",
        "/connexion",
        "/inscription",
        "/mot-de-passe-oublie",
        "/recherche",
        "/*?sort=",
        "/*?page=",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
