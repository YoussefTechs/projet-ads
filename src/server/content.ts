import "server-only";
import { prisma } from "@/lib/db";
import type { ArticleType, Prisma } from "@prisma/client";

/**
 * Accès aux données « contenu éditorial » : guides, articles de blog,
 * catégories, auteurs.
 */

const PUBLISHED = { status: "PUBLISHED" as const };

// Types d'articles considérés comme « guides » (hub /guides).
const GUIDE_TYPES: ArticleType[] = [
  "GUIDE",
  "ITINERARY",
  "LISTICLE",
  "PRACTICAL",
  "COMPARISON",
  "WHEN_TO_GO",
];

const articleListInclude = {
  author: { select: { name: true, slug: true, image: true } },
  categories: { select: { name: true, slug: true } },
} satisfies Prisma.ArticleInclude;

interface ListOptions {
  page?: number;
  perPage?: number;
  categorySlug?: string;
}

/** Articles de blog paginés (type BLOG). */
export async function getBlogArticles({
  page = 1,
  perPage = 9,
  categorySlug,
}: ListOptions = {}) {
  const where: Prisma.ArticleWhereInput = {
    ...PUBLISHED,
    type: "BLOG",
    ...(categorySlug && { categories: { some: { slug: categorySlug } } }),
  };
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: articleListInclude,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total, page, perPage, pages: Math.ceil(total / perPage) };
}

/** Guides paginés (tous types sauf BLOG). */
export async function getGuides({
  page = 1,
  perPage = 9,
  categorySlug,
}: ListOptions = {}) {
  const where: Prisma.ArticleWhereInput = {
    ...PUBLISHED,
    type: { in: GUIDE_TYPES },
    ...(categorySlug && { categories: { some: { slug: categorySlug } } }),
  };
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: articleListInclude,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total, page, perPage, pages: Math.ceil(total / perPage) };
}

export function getFeaturedArticles(take = 4) {
  return prisma.article.findMany({
    where: { ...PUBLISHED, featured: true },
    orderBy: { publishedAt: "desc" },
    take,
    include: articleListInclude,
  });
}

export function getLatestArticles(take = 6) {
  return prisma.article.findMany({
    where: PUBLISHED,
    orderBy: { publishedAt: "desc" },
    take,
    include: articleListInclude,
  });
}

export async function getArticleBySlug(slug: string, preview = false) {
  return prisma.article.findFirst({
    where: { slug, ...(preview ? {} : PUBLISHED) },
    include: {
      author: true,
      categories: true,
      tags: true,
      countries: { include: { continent: true } },
      cities: { include: { country: { include: { continent: true } } } },
    },
  });
}

/** Articles liés (mêmes catégories), pour le maillage interne. */
export function getRelatedArticles(
  articleId: string,
  categoryIds: string[],
  take = 3,
) {
  return prisma.article.findMany({
    where: {
      ...PUBLISHED,
      id: { not: articleId },
      categories: { some: { id: { in: categoryIds } } },
    },
    orderBy: { publishedAt: "desc" },
    take,
    include: articleListInclude,
  });
}

/** Guides/articles liés à un pays (maillage interne). */
export function getArticlesByCountry(countryId: string, take = 3) {
  return prisma.article.findMany({
    where: { ...PUBLISHED, countries: { some: { id: countryId } } },
    orderBy: { publishedAt: "desc" },
    take,
    include: articleListInclude,
  });
}

/** Guides/articles liés à une ville (maillage interne). */
export function getArticlesByCity(cityId: string, take = 3) {
  return prisma.article.findMany({
    where: { ...PUBLISHED, cities: { some: { id: cityId } } },
    orderBy: { publishedAt: "desc" },
    take,
    include: articleListInclude,
  });
}

export async function getAllArticleParams(type: "blog" | "guide") {
  const articles = await prisma.article.findMany({
    where: {
      ...PUBLISHED,
      type: type === "blog" ? "BLOG" : { in: GUIDE_TYPES },
    },
    select: { slug: true },
  });
  return articles.map((a) => ({ slug: a.slug }));
}

// ─────────────────────────── Catégories ───────────────────────

export function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { countries: true, cities: true, articles: true } },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      countries: {
        where: PUBLISHED,
        include: { continent: true, _count: { select: { cities: true } } },
      },
      cities: {
        where: PUBLISHED,
        include: { country: { include: { continent: true } } },
      },
      articles: {
        where: PUBLISHED,
        orderBy: { publishedAt: "desc" },
        take: 6,
        include: articleListInclude,
      },
    },
  });
}

// ──────────────────────────── Auteurs ─────────────────────────

export function getAuthors() {
  return prisma.user.findMany({
    where: { slug: { not: null }, articles: { some: PUBLISHED } },
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });
}

export async function getAuthorBySlug(slug: string) {
  return prisma.user.findUnique({
    where: { slug },
    include: {
      articles: {
        where: PUBLISHED,
        orderBy: { publishedAt: "desc" },
        include: articleListInclude,
      },
    },
  });
}

export type ArticleListItem = Awaited<
  ReturnType<typeof getLatestArticles>
>[number];
