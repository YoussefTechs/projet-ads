import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getResource } from "@/lib/admin/resources";
import { buildResourceData, buildRelations } from "@/lib/admin/build-data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/** Crée ou met à jour un contenu (ADMIN/EDITOR). */
export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const resource = getResource(String(body.resource));
  if (!resource) {
    return NextResponse.json({ error: "Ressource inconnue" }, { status: 404 });
  }

  const id: string | null = body.id ?? null;
  const intent = String(body.intent ?? "draft");
  const { data, categoryIds, tagNames } = buildResourceData(
    resource,
    body.values ?? {},
    intent,
  );
  const payload = { ...data, ...buildRelations(id, categoryIds, tagNames) };

  try {
    const record = id
      ? await db[resource.model].update({ where: { id }, data: payload })
      : await db[resource.model].create({ data: payload });

    revalidatePath(`/admin/${resource.key}`);
    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      id: record.id,
      redirect: `/admin/${resource.key}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur d'enregistrement" },
      { status: 400 },
    );
  }
}
