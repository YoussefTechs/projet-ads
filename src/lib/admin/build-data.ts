import { slugify, truncate } from "@/lib/utils";
import type { Resource } from "@/lib/admin/resources";

/**
 * Construit le payload Prisma à partir des valeurs d'un formulaire (objet JSON
 * envoyé par le client). Pur (testable), partagé par les API admin.
 */

function statusFromIntent(intent: string) {
  switch (intent) {
    case "publish":
      return "PUBLISHED";
    case "unpublish":
      return "UNPUBLISHED";
    case "preview":
      return "PREVIEW";
    default:
      return "DRAFT";
  }
}

function parseList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export function buildResourceData(
  resource: Resource,
  values: Record<string, unknown>,
  intent: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};
  const titleVal = String(values[resource.titleField] ?? "").trim();
  let categoryIds: string[] | null = null;
  let tagNames: string[] | null = null;

  for (const field of resource.fields) {
    const raw = values[field.name];
    switch (field.type) {
      case "text":
      case "textarea":
      case "richtext":
      case "image":
        data[field.name] = raw ? String(raw) : null;
        break;
      case "select":
      case "belongsTo":
        if (raw) data[field.name] = String(raw);
        break;
      case "slug":
        data[field.name] = slugify(String(raw || titleVal));
        break;
      case "number": {
        const n = Number(raw);
        data[field.name] =
          raw === "" || raw === undefined || raw === null || !Number.isFinite(n)
            ? null
            : n;
        break;
      }
      case "boolean":
        data[field.name] = raw === true || raw === "true" || raw === "on";
        break;
      case "gallery":
      case "stringlist":
        data[field.name] = parseList(raw);
        break;
      case "faq":
        data[field.name] = Array.isArray(raw)
          ? raw.filter(
              (r) =>
                r &&
                typeof r === "object" &&
                String((r as { question?: string }).question ?? "").trim(),
            )
          : null;
        break;
      case "categories":
        categoryIds = parseList(raw);
        break;
      case "tags":
        tagNames = parseList(raw);
        break;
    }
  }

  Object.assign(data, resource.fixedValues ?? {});
  if (resource.model === "article" && !data.type) data.type = "GUIDE";
  if (resource.model === "article" && !data.content) {
    data.content = "Contenu à compléter.";
  }

  if (resource.publishable) {
    data.status = statusFromIntent(intent);
    if (data.status === "PUBLISHED") data.publishedAt = new Date();
  }

  if ("metaTitle" in data && !data.metaTitle) {
    data.metaTitle = String(data[resource.titleField] ?? titleVal);
  }
  if ("metaDescription" in data && !data.metaDescription) {
    const src = String(data.summary ?? data.excerpt ?? "");
    data.metaDescription = src ? truncate(src, 155) : null;
  }

  return { data, categoryIds, tagNames };
}

export function buildRelations(
  id: string | null,
  categoryIds: string[] | null,
  tagNames: string[] | null,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relations: Record<string, any> = {};
  if (categoryIds) {
    relations.categories = id
      ? { set: categoryIds.map((cid) => ({ id: cid })) }
      : { connect: categoryIds.map((cid) => ({ id: cid })) };
  }
  if (tagNames) {
    const ops = tagNames.map((n) => ({
      where: { slug: slugify(n) },
      create: { name: n, slug: slugify(n) },
    }));
    relations.tags = id
      ? { set: [], connectOrCreate: ops }
      : { connectOrCreate: ops };
  }
  return relations;
}
