"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getResource, type Resource } from "@/lib/admin/resources";
import { requireAdminAccess } from "@/server/admin-data";
import { slugify, truncate } from "@/lib/utils";

// Accès générique au client Prisma (CRUD piloté par configuration).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

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

function parseList(v: FormDataEntryValue | null): string[] {
  if (!v) return [];
  return String(v)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildData(resource: Resource, formData: FormData, intent: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};
  const titleVal = String(formData.get(resource.titleField) ?? "").trim();
  let categoryIds: string[] | null = null;
  let tagNames: string[] | null = null;

  for (const field of resource.fields) {
    const raw = formData.get(field.name);
    switch (field.type) {
      case "text":
      case "textarea":
      case "richtext":
      case "image":
        data[field.name] = raw ? String(raw) : null;
        break;
      case "select":
        if (raw) data[field.name] = String(raw);
        break;
      case "slug": {
        const v = raw ? String(raw).trim() : "";
        data[field.name] = slugify(v || titleVal);
        break;
      }
      case "number": {
        const v = raw ? String(raw).trim() : "";
        const n = Number(v);
        data[field.name] = v === "" || !Number.isFinite(n) ? null : n;
        break;
      }
      case "boolean":
        data[field.name] = raw === "on" || raw === "true";
        break;
      case "belongsTo":
        if (raw) data[field.name] = String(raw);
        break;
      case "gallery":
      case "stringlist":
        data[field.name] = parseList(raw);
        break;
      case "faq":
        try {
          data[field.name] = raw ? JSON.parse(String(raw)) : null;
        } catch {
          data[field.name] = null;
        }
        break;
      case "categories":
        categoryIds = formData.getAll(field.name).map(String).filter(Boolean);
        break;
      case "tags":
        tagNames = parseList(raw);
        break;
    }
  }

  // Valeurs imposées (ex. type=BLOG) + défauts.
  Object.assign(data, resource.fixedValues ?? {});
  if (resource.model === "article" && !data.type) data.type = "GUIDE";
  if (resource.model === "article" && !data.content) {
    data.content = "Contenu à compléter.";
  }

  // Statut + date de publication.
  if (resource.publishable) {
    data.status = statusFromIntent(intent);
    if (data.status === "PUBLISHED") data.publishedAt = new Date();
  }

  // SEO généré automatiquement si laissé vide (modifiable ensuite).
  if ("metaTitle" in data && !data.metaTitle) {
    data.metaTitle = String(data[resource.titleField] ?? titleVal);
  }
  if ("metaDescription" in data && !data.metaDescription) {
    const src = String(data.summary ?? data.excerpt ?? "");
    data.metaDescription = src ? truncate(src, 155) : null;
  }

  return { data, categoryIds, tagNames };
}

/** Crée ou met à jour un enregistrement. */
export async function saveResource(
  resourceKey: string,
  id: string | null,
  formData: FormData,
) {
  await requireAdminAccess();
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("Ressource inconnue");

  const intent = String(formData.get("intent") ?? "draft");
  const { data, categoryIds, tagNames } = buildData(resource, formData, intent);

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
    relations.tags = id ? { set: [], connectOrCreate: ops } : { connectOrCreate: ops };
  }

  const payload = { ...data, ...relations };

  if (id) {
    await db[resource.model].update({ where: { id }, data: payload });
  } else {
    await db[resource.model].create({ data: payload });
  }

  revalidatePath(`/admin/${resourceKey}`);
  revalidatePath("/", "layout"); // rafraîchit le contenu public (ISR)
  redirect(`/admin/${resourceKey}`);
}

/** Supprime un enregistrement. */
export async function deleteResource(
  resourceKey: string,
  id: string,
  _formData?: FormData,
) {
  await requireAdminAccess();
  const resource = getResource(resourceKey);
  if (!resource) throw new Error("Ressource inconnue");

  await db[resource.model].delete({ where: { id } });
  revalidatePath(`/admin/${resourceKey}`);
  revalidatePath("/", "layout");
  redirect(`/admin/${resourceKey}`);
}

/** Modifie le rôle d'un utilisateur (ADMIN uniquement). */
export async function updateUserRole(userId: string, formData: FormData) {
  await requireAdminAccess(true);
  const role = String(formData.get("role"));
  if (!["USER", "EDITOR", "ADMIN"].includes(role)) return;
  await prisma.user.update({
    where: { id: userId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { role: role as any },
  });
  revalidatePath("/admin/users");
}
