import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const schema = z.object({
  id: z.string().min(1),
  action: z.enum(["approve", "reject", "spam"]),
});

const statusMap = {
  approve: "APPROVED",
  reject: "REJECTED",
  spam: "SPAM",
} as const;

/** Modération d'un commentaire (ADMIN/EDITOR). */
export async function PATCH(req: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  await prisma.comment.update({
    where: { id: parsed.data.id },
    data: { status: statusMap[parsed.data.action] },
  });

  return NextResponse.json({ ok: true });
}
