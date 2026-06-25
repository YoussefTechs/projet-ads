import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getResource } from "@/lib/admin/resources";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

/** Supprime un contenu (ADMIN/EDITOR). */
export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const resource = getResource(String(body?.resource));
  if (!resource || !body?.id) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  try {
    await db[resource.model].delete({ where: { id: String(body.id) } });
    revalidatePath(`/admin/${resource.key}`);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, redirect: `/admin/${resource.key}` });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur de suppression" },
      { status: 400 },
    );
  }
}
