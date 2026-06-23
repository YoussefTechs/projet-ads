import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/url";

interface SeoParams {
  /** Titre spécifique à la page (le suffixe « | Atlas » est ajouté). */
  title: string;
  description?: string;
  /** Chemin canonique (ex. « /europe/france/paris »). */
  path: string;
  /** Image OG (URL absolue ou relative). Défaut : image OG dynamique. */
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Si vrai, le titre est utilisé tel quel (sans suffixe de marque). */
  rawTitle?: boolean;
}

/**
 * Construit l'objet Metadata Next.js (title, description, canonical,
 * Open Graph, Twitter Cards, robots) — cf. docs/PHASE-2-SEO.md.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  publishedTime,
  modifiedTime,
  authors,
  rawTitle = false,
}: SeoParams): Metadata {
  // Le suffixe « | Atlas » est ajouté par le template du layout racine
  // (sauf rawTitle → titre absolu). OG/Twitter reçoivent le titre complet.
  const brandedTitle = `${title} | ${siteConfig.name}`;
  const desc = description ?? siteConfig.description;
  const canonical = absoluteUrl(path);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : absoluteUrl(image)
    : absoluteUrl(`/api/og?title=${encodeURIComponent(title)}`);

  return {
    title: rawTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical },
    robots: noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
    openGraph: {
      title: rawTitle ? title : brandedTitle,
      description: desc,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      title: rawTitle ? title : brandedTitle,
      description: desc,
      images: [ogImage],
      site: siteConfig.twitter,
    },
  };
}
