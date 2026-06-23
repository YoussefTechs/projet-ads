import { siteConfig } from "@/config/site";

/**
 * Constructeurs d'URL canoniques (cf. docs/PHASE-2-SEO.md §17).
 * Centraliser ici garantit un maillage interne cohérent et stable.
 */

export function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const paths = {
  home: () => "/",
  destinations: () => "/destinations",
  continent: (continent: string) => `/${continent}`,
  country: (continent: string, country: string) => `/${continent}/${country}`,
  city: (continent: string, country: string, city: string) =>
    `/${continent}/${country}/${city}`,
  place: (continent: string, country: string, city: string, place: string) =>
    `/${continent}/${country}/${city}/lieux/${place}`,
  hotel: (continent: string, country: string, city: string, hotel: string) =>
    `/${continent}/${country}/${city}/hotels/${hotel}`,
  restaurant: (
    continent: string,
    country: string,
    city: string,
    restaurant: string,
  ) => `/${continent}/${country}/${city}/restaurants/${restaurant}`,
  cityIntent: (
    continent: string,
    country: string,
    city: string,
    intent: string,
  ) => `/${continent}/${country}/${city}/${intent}`,
  guides: () => "/guides",
  guide: (slug: string) => `/guides/${slug}`,
  blog: () => "/blog",
  article: (slug: string) => `/blog/${slug}`,
  categories: () => "/categories",
  category: (slug: string) => `/categories/${slug}`,
  comparators: () => "/comparateurs",
  /** Comparateur : ordre alphabétique forcé pour une URL canonique unique. */
  comparator: (a: string, b: string) =>
    `/comparateurs/${[a, b].sort().join("-vs-")}`,
  search: (q?: string) => (q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche"),
  author: (slug: string) => `/auteurs/${slug}`,
  authors: () => "/auteurs",
  account: () => "/compte",
  favorites: () => "/compte/favoris",
  login: () => "/connexion",
  register: () => "/inscription",
  admin: () => "/admin",
} as const;
