import "server-only";
import { prisma } from "@/lib/db";
import type { EntityType } from "@prisma/client";
import { paths } from "@/lib/url";

/** Favoris & commentaires (engagement utilisateur). */

// ─────────────────────────── Commentaires ─────────────────────

export function getApprovedComments(
  entityType: EntityType,
  entityId: string,
) {
  return prisma.comment.findMany({
    where: { entityType, entityId, status: "APPROVED", parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true, image: true } },
      replies: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, image: true } } },
      },
    },
  });
}

export function getCommentCount(entityType: EntityType, entityId: string) {
  return prisma.comment.count({
    where: { entityType, entityId, status: "APPROVED" },
  });
}

// ──────────────────────────── Favoris ─────────────────────────

export async function getUserFavoriteKeys(userId: string): Promise<Set<string>> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    select: { entityType: true, entityId: true },
  });
  return new Set(favorites.map((f) => `${f.entityType}:${f.entityId}`));
}

export async function isFavorited(
  userId: string,
  entityType: EntityType,
  entityId: string,
): Promise<boolean> {
  const fav = await prisma.favorite.findUnique({
    where: { userId_entityType_entityId: { userId, entityType, entityId } },
  });
  return Boolean(fav);
}

export interface ResolvedFavorite {
  key: string;
  entityType: EntityType;
  entityId: string;
  name: string;
  subtitle?: string;
  href: string;
  image?: string | null;
}

/** Résout les entités favorites en cartes affichables (page /compte/favoris). */
export async function getResolvedFavorites(
  userId: string,
): Promise<ResolvedFavorite[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const byType = (t: EntityType) =>
    favorites.filter((f) => f.entityType === t).map((f) => f.entityId);

  const [countries, cities, places, hotels, restaurants, articles] =
    await Promise.all([
      prisma.country.findMany({
        where: { id: { in: byType("COUNTRY") } },
        include: { continent: true },
      }),
      prisma.city.findMany({
        where: { id: { in: byType("CITY") } },
        include: { country: { include: { continent: true } } },
      }),
      prisma.place.findMany({
        where: { id: { in: byType("PLACE") } },
        include: { city: { include: { country: { include: { continent: true } } } } },
      }),
      prisma.hotel.findMany({
        where: { id: { in: byType("HOTEL") } },
        include: { city: { include: { country: { include: { continent: true } } } } },
      }),
      prisma.restaurant.findMany({
        where: { id: { in: byType("RESTAURANT") } },
        include: { city: { include: { country: { include: { continent: true } } } } },
      }),
      prisma.article.findMany({ where: { id: { in: byType("ARTICLE") } } }),
    ]);

  const resolved: ResolvedFavorite[] = [
    ...countries.map((c) => ({
      key: `COUNTRY:${c.id}`,
      entityType: "COUNTRY" as const,
      entityId: c.id,
      name: c.name,
      subtitle: "Pays",
      href: paths.country(c.continent.slug, c.slug),
      image: c.heroImage,
    })),
    ...cities.map((c) => ({
      key: `CITY:${c.id}`,
      entityType: "CITY" as const,
      entityId: c.id,
      name: c.name,
      subtitle: c.country.name,
      href: paths.city(c.country.continent.slug, c.country.slug, c.slug),
      image: c.heroImage,
    })),
    ...places.map((p) => ({
      key: `PLACE:${p.id}`,
      entityType: "PLACE" as const,
      entityId: p.id,
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
    ...hotels.map((h) => ({
      key: `HOTEL:${h.id}`,
      entityType: "HOTEL" as const,
      entityId: h.id,
      name: h.name,
      subtitle: h.city.name,
      href: paths.hotel(
        h.city.country.continent.slug,
        h.city.country.slug,
        h.city.slug,
        h.slug,
      ),
      image: h.heroImage,
    })),
    ...restaurants.map((r) => ({
      key: `RESTAURANT:${r.id}`,
      entityType: "RESTAURANT" as const,
      entityId: r.id,
      name: r.name,
      subtitle: r.city.name,
      href: paths.restaurant(
        r.city.country.continent.slug,
        r.city.country.slug,
        r.city.slug,
        r.slug,
      ),
      image: r.heroImage,
    })),
    ...articles.map((a) => ({
      key: `ARTICLE:${a.id}`,
      entityType: "ARTICLE" as const,
      entityId: a.id,
      name: a.title,
      subtitle: a.type === "BLOG" ? "Article" : "Guide",
      href: a.type === "BLOG" ? paths.article(a.slug) : paths.guide(a.slug),
      image: a.coverImage,
    })),
  ];

  return resolved;
}

export async function getUserComments(userId: string) {
  return prisma.comment.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
