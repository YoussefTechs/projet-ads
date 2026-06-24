import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const updateSchema = z.object({ name: z.string().min(2).max(80).trim() });

/** Met à jour le profil (nom). */
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
  }
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: parsed.data.name },
  });
  return NextResponse.json({ ok: true });
}

/** Supprime le compte (RGPD) — cascade favoris & commentaires. */
export async function DELETE() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  await prisma.user.delete({ where: { id: session.user.id } });
  return NextResponse.json({ ok: true });
}
