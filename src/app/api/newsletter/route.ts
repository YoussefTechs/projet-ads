import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { newsletterSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = rateLimit(`newsletter:${ip}`, {
    limit: 5,
    windowMs: 60_000,
  });
  if (!success) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide" },
      { status: 400 },
    );
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email, status: "PENDING" },
    update: {},
  });

  // NB : l'envoi de l'e-mail de confirmation (double opt-in) sera branché
  // sur le service transactionnel en production (cf. Phase 1 §21.2).
  return NextResponse.json({
    message: "Merci ! Confirmez votre inscription par e-mail.",
  });
}
