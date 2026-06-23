import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { commentSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rate-limit";

/** Crée un commentaire (statut PENDING → modération). Auth requise. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { success } = rateLimit(`comment:${session.user.id}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!success) {
    return NextResponse.json(
      { error: "Trop de commentaires. Réessayez dans une minute." },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Requête invalide" },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const comment = await prisma.comment.create({
    data: {
      body: data.body,
      entityType: data.entityType,
      entityId: data.entityId,
      parentId: data.parentId,
      authorId: session.user.id,
      status: "PENDING",
    },
  });

  return NextResponse.json({ id: comment.id, status: "PENDING" });
}
