import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl, paths } from "@/lib/url";

/**
 * Sitemap XML automatique (cf. PHASE-2-SEO §15).
 * NB : à l'échelle (>50k URLs), segmenter via `generateSitemaps`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const PUBLISHED = { status: "PUBLISHED" as const };

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/destinations",
    "/guides",
    "/blog",
    "/categories",
    "/comparateurs",
    "/a-propos",
    "/contact",
    "/faq",
    "/auteurs",
    "/mentions-legales",
    "/confidentialite",
    "/cookies",
    "/conditions-generales",
    "/charte-editoriale",
  ].map((path) => ({
    url: absoluteUrl(path || "/"),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));

  try {
    const [continents, countries, cities, places, activities, articles, categories] =
      await Promise.all([
        prisma.continent.findMany({ select: { slug: true, updatedAt: true } }),
        prisma.country.findMany({
          where: PUBLISHED,
          select: {
            slug: true,
            updatedAt: true,
            continent: { select: { slug: true } },
          },
        }),
        prisma.city.findMany({
          where: PUBLISHED,
          select: {
            slug: true,
            updatedAt: true,
            country: {
              select: { slug: true, continent: { select: { slug: true } } },
            },
          },
        }),
        prisma.place.findMany({
          where: PUBLISHED,
          select: {
            slug: true,
            updatedAt: true,
            city: {
              select: {
                slug: true,
                country: {
                  select: { slug: true, continent: { select: { slug: true } } },
                },
              },
            },
          },
        }),
        prisma.activity.findMany({
          where: PUBLISHED,
          select: {
            slug: true,
            updatedAt: true,
            city: {
              select: {
                slug: true,
                country: {
                  select: { slug: true, continent: { select: { slug: true } } },
                },
              },
            },
          },
        }),
        prisma.article.findMany({
          where: PUBLISHED,
          select: { slug: true, type: true, updatedAt: true },
        }),
        prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
      ]);

    const dynamicRoutes: MetadataRoute.Sitemap = [
      ...continents.map((c) => ({
        url: absoluteUrl(paths.continent(c.slug)),
        lastModified: c.updatedAt,
        priority: 0.7,
      })),
      ...countries.map((c) => ({
        url: absoluteUrl(paths.country(c.continent.slug, c.slug)),
        lastModified: c.updatedAt,
        priority: 0.8,
      })),
      ...cities.map((c) => ({
        url: absoluteUrl(
          paths.city(c.country.continent.slug, c.country.slug, c.slug),
        ),
        lastModified: c.updatedAt,
        priority: 0.8,
      })),
      ...places.map((p) => ({
        url: absoluteUrl(
          paths.place(
            p.city.country.continent.slug,
            p.city.country.slug,
            p.city.slug,
            p.slug,
          ),
        ),
        lastModified: p.updatedAt,
        priority: 0.6,
      })),
      ...activities.map((a) => ({
        url: absoluteUrl(
          paths.activity(
            a.city.country.continent.slug,
            a.city.country.slug,
            a.city.slug,
            a.slug,
          ),
        ),
        lastModified: a.updatedAt,
        priority: 0.6,
      })),
      ...articles.map((a) => ({
        url: absoluteUrl(
          a.type === "BLOG" ? paths.article(a.slug) : paths.guide(a.slug),
        ),
        lastModified: a.updatedAt,
        priority: 0.7,
      })),
      ...categories.map((c) => ({
        url: absoluteUrl(paths.category(c.slug)),
        lastModified: c.updatedAt,
        priority: 0.5,
      })),
    ];

    return [...staticRoutes, ...dynamicRoutes];
  } catch {
    // En cas d'indisponibilité de la base, on sert au moins les routes statiques.
    return staticRoutes;
  }
}
