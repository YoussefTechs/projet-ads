import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { paths } from "@/lib/url";
import type { Resource } from "@/lib/admin/resources";

/* Accès aux données pour l'administration (lecture). */

// Accès dynamique générique au client Prisma (CRUD piloté par configuration).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/** Garde d'accès admin. `fullAdmin` = réservé au rôle ADMIN. */
export async function requireAdminAccess(fullAdmin = false) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
    redirect("/403");
  }
  if (fullAdmin && role !== "ADMIN") {
    redirect("/403");
  }
  return session!;
}

/** Include des relations parentes selon le modèle (pour construire l'URL). */
function parentInclude(model: string) {
  switch (model) {
    case "country":
      return { continent: { select: { slug: true } } };
    case "city":
      return { country: { select: { slug: true, continent: { select: { slug: true } } } } };
    case "activity":
    case "hotel":
    case "restaurant":
      return {
        city: {
          select: {
            slug: true,
            country: { select: { slug: true, continent: { select: { slug: true } } } },
          },
        },
      };
    default:
      return undefined;
  }
}

/** Construit l'URL publique d'un enregistrement. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function recordPublicPath(model: string, r: any): string | null {
  try {
    switch (model) {
      case "country":
        return paths.country(r.continent.slug, r.slug);
      case "city":
        return paths.city(r.country.continent.slug, r.country.slug, r.slug);
      case "activity":
        return paths.activity(r.city.country.continent.slug, r.city.country.slug, r.city.slug, r.slug);
      case "hotel":
        return paths.hotel(r.city.country.continent.slug, r.city.country.slug, r.city.slug, r.slug);
      case "restaurant":
        return paths.restaurant(r.city.country.continent.slug, r.city.country.slug, r.city.slug, r.slug);
      case "article":
        return r.type === "BLOG" ? paths.article(r.slug) : paths.guide(r.slug);
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export async function listResource(resource: Resource) {
  return db[resource.model].findMany({
    where: resource.listFilter ?? {},
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: parentInclude(resource.model),
  });
}

function relationIncludeForForm(resource: Resource) {
  const include: Record<string, boolean> = {};
  if (resource.fields.some((f) => f.type === "categories")) include.categories = true;
  if (resource.fields.some((f) => f.type === "tags")) include.tags = true;
  return Object.keys(include).length ? include : undefined;
}

export async function getRecord(resource: Resource, id: string) {
  const include = {
    ...(relationIncludeForForm(resource) ?? {}),
    ...(parentInclude(resource.model) ?? {}),
  };
  return db[resource.model].findUnique({
    where: { id },
    include: Object.keys(include).length ? include : undefined,
  });
}

export interface ResourceOptions {
  belongsTo: Record<string, { value: string; label: string }[]>;
  categories: { value: string; label: string }[];
}

/** Charge les options des champs relationnels (selects). */
export async function loadResourceOptions(
  resource: Resource,
): Promise<ResourceOptions> {
  const belongsTo: ResourceOptions["belongsTo"] = {};

  for (const field of resource.fields) {
    if (field.type !== "belongsTo" || !field.relationModel) continue;
    if (field.relationModel === "city") {
      const cities = await prisma.city.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, country: { select: { name: true } } },
      });
      belongsTo[field.name] = cities.map((c) => ({
        value: c.id,
        label: `${c.name} (${c.country.name})`,
      }));
    } else if (field.relationModel === "country") {
      const countries = await prisma.country.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      });
      belongsTo[field.name] = countries.map((c) => ({ value: c.id, label: c.name }));
    } else if (field.relationModel === "continent") {
      const continents = await prisma.continent.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
      });
      belongsTo[field.name] = continents.map((c) => ({ value: c.id, label: c.name }));
    }
  }

  let categories: ResourceOptions["categories"] = [];
  if (resource.fields.some((f) => f.type === "categories")) {
    const cats = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    categories = cats.map((c) => ({ value: c.id, label: c.name }));
  }

  return { belongsTo, categories };
}

export async function getAdminStats() {
  const [countries, cities, activities, hotels, restaurants, articles, pending, users] =
    await Promise.all([
      prisma.country.count(),
      prisma.city.count(),
      prisma.activity.count(),
      prisma.hotel.count(),
      prisma.restaurant.count(),
      prisma.article.count(),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
    ]);
  return { countries, cities, activities, hotels, restaurants, articles, pending, users };
}
