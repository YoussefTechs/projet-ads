import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/** Modifie le rôle d'un utilisateur (ADMIN uniquement). */
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const userId = String(body?.userId ?? "");
  const role = String(body?.role ?? "");
  if (!userId || !["USER", "EDITOR", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { role: role as any },
  });
  revalidatePath("/admin/users");
  return NextResponse.json({ ok: true });
}
