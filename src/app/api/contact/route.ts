import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const { success } = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 60_000 });
  if (!success) {
    return NextResponse.json({ error: "Trop de tentatives." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide" }, { status: 400 });
  }

  // Honeypot anti-spam : si rempli, on simule un succès sans rien faire.
  if (parsed.data.website) {
    return NextResponse.json({ message: "Message envoyé." });
  }

  // L'envoi réel de l'e-mail sera branché sur le service transactionnel.
  return NextResponse.json({ message: "Message envoyé. Merci !" });
}
