import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Génération de contenu assistée par IA pour le dashboard.
 * - Si ANTHROPIC_API_KEY est défini : appelle l'API Claude (Messages).
 * - Sinon : génère un brouillon structuré à partir d'un gabarit (fallback).
 * Le contenu est toujours révisé/édité par l'admin avant publication.
 */

interface AiResult {
  summary?: string;
  description?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  faq?: { question: string; answer: string }[];
}

function templateContent(name: string, resource: string): AiResult {
  const subject = name || "cette destination";
  const isArticle = resource === "guides" || resource === "blog";
  const body = `## Présentation

${subject} séduit les voyageurs par sa richesse culturelle, ses paysages et son atmosphère unique. Que vous voyagiez en famille, en couple ou en solo, vous y trouverez de quoi vous émerveiller.

## À ne pas manquer

- Les sites incontournables et monuments emblématiques
- La gastronomie locale et ses spécialités
- Les quartiers authentiques à explorer à pied

## Conseils pratiques

Prévoyez quelques jours pour profiter pleinement de ${subject}. Réservez vos hébergements à l'avance en haute saison et privilégiez les transports en commun pour vous déplacer.`;

  return {
    summary: `Découvrez ${subject} : que voir, que faire, conseils pratiques et bons plans pour préparer votre voyage.`,
    description: body,
    content: isArticle ? body : undefined,
    metaTitle: `${subject} : guide complet, conseils & incontournables`,
    metaDescription: `Préparez votre voyage à ${subject} : incontournables, conseils pratiques, budget et bonnes adresses.`,
    faq: [
      {
        question: `Quelle est la meilleure période pour visiter ${subject} ?`,
        answer: `Le printemps et l'automne offrent généralement le meilleur compromis entre météo agréable et affluence modérée.`,
      },
      {
        question: `Combien de jours prévoir pour ${subject} ?`,
        answer: `Comptez 3 à 5 jours pour découvrir l'essentiel et profiter de l'ambiance.`,
      },
    ],
  };
}

async function generateWithClaude(
  name: string,
  resource: string,
): Promise<AiResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const model = process.env.AI_MODEL ?? "claude-sonnet-4-6";
  const prompt = `Tu es un rédacteur de voyage expert. Génère du contenu en français pour « ${name} » (type: ${resource}).
Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, au format :
{"summary": "...", "description": "markdown avec ## titres", "content": "markdown", "metaTitle": "...", "metaDescription": "...", "faq": [{"question": "...", "answer": "..."}]}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    return JSON.parse(json) as AiResult;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user || (role !== "ADMIN" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { success } = rateLimit(`ai:${session.user.id}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!success) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").slice(0, 120);
  const resource = String(body.resource ?? "");

  const result =
    (await generateWithClaude(name, resource)) ?? templateContent(name, resource);

  return NextResponse.json(result);
}
