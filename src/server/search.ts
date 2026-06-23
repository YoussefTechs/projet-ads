import "server-only";
import { prisma } from "@/lib/db";
import { paths } from "@/lib/url";

/**
 * Recherche multi-entités (MVP : PostgreSQL `contains` insensible à la casse).
 * Évolution prévue : moteur dédié (Meilisearch/Typesense) — cf. Phase 1 §21.4.
 */

export type SearchResultType =
  | "country"
  | "city"
  | "place"
  | "article";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  name: string;
  subtitle?: string;
  href: string;
  image?: string | null;
}

const PUBLISHED = { status: "PUBLISHED" as const };
const insensitive = "insensitive" as const;

/** Recherche instantanée (autocomplétion) — quelques résultats par type. */
export async function instantSearch(
  q: string,
  perType = 4,
): Promise<SearchResult[]> {
  const query = q.trim();
  if (query.length < 2) return [];

  const [countries, cities, places, articles] = await Promise.all([
    prisma.country.findMany({
      where: { name: { contains: query, mode: insensitive }, ...PUBLISHED },
      take: perType,
      include: { continent: { select: { slug: true } } },
    }),
    prisma.city.findMany({
      where: { name: { contains: query, mode: insensitive }, ...PUBLISHED },
      take: perType,
      include: {
        country: {
          select: { name: true, slug: true, continent: { select: { slug: true } } },
        },
      },
    }),
    prisma.place.findMany({
      where: { name: { contains: query, mode: insensitive }, ...PUBLISHED },
      take: perType,
      include: {
        city: {
          select: {
            name: true,
            slug: true,
            country: {
              select: { slug: true, continent: { select: { slug: true } } },
            },
          },
        },
      },
    }),
    prisma.article.findMany({
      where: { title: { contains: query, mode: insensitive }, ...PUBLISHED },
      take: perType,
    }),
  ]);

  const results: SearchResult[] = [
    ...countries.map((c) => ({
      id: c.id,
      type: "country" as const,
      name: c.name,
      subtitle: "Pays",
      href: paths.country(c.continent.slug, c.slug),
      image: c.heroImage,
    })),
    ...cities.map((c) => ({
      id: c.id,
      type: "city" as const,
      name: c.name,
      subtitle: c.country.name,
      href: paths.city(c.country.continent.slug, c.country.slug, c.slug),
      image: c.heroImage,
    })),
    ...places.map((p) => ({
      id: p.id,
      type: "place" as const,
      name: p.name,
      subtitle: p.city.name,
      href: paths.place(
        p.city.country.continent.slug,
        p.city.country.slug,
        p.city.slug,
        p.slug,
      ),
      image: p.heroImage,
    })),
    ...articles.map((a) => ({
      id: a.id,
      type: "article" as const,
      name: a.title,
      subtitle: a.type === "BLOG" ? "Article" : "Guide",
      href: a.type === "BLOG" ? paths.article(a.slug) : paths.guide(a.slug),
      image: a.coverImage,
    })),
  ];

  return results;
}

interface SearchAllOptions {
  q: string;
  type?: string;
  continent?: string;
  page?: number;
  perPage?: number;
}

/** Recherche complète paginée (page /recherche). */
export async function searchAll({
  q,
  type,
  continent,
  page = 1,
  perPage = 12,
}: SearchAllOptions): Promise<{ results: SearchResult[]; total: number }> {
  const all = await instantSearch(q, 50);
  let filtered = all;
  if (type && type !== "all") {
    filtered = filtered.filter((r) => r.type === type);
  }
  if (continent) {
    filtered = filtered.filter((r) => r.href.startsWith(`/${continent}/`));
  }
  const total = filtered.length;
  const start = (page - 1) * perPage;
  return { results: filtered.slice(start, start + perPage), total };
}
