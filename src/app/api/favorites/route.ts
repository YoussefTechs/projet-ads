import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { favoriteSchema } from "@/lib/validation";

/** Ajoute un favori (idempotent). Auth requise. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const { entityType, entityId } = parsed.data;

  await prisma.favorite.upsert({
    where: {
      userId_entityType_entityId: {
        userId: session.user.id,
        entityType,
        entityId,
      },
    },
    create: { userId: session.user.id, entityType, entityId },
    update: {},
  });

  return NextResponse.json({ favorited: true });
}

/** Retire un favori. Auth requise. */
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = favoriteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const { entityType, entityId } = parsed.data;

  await prisma.favorite.deleteMany({
    where: { userId: session.user.id, entityType, entityId },
  });

  return NextResponse.json({ favorited: false });
}
