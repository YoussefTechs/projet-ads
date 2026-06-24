import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { formatNumber } from "@/lib/utils";
import { getCityBySlug } from "@/server/destinations";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { AnswerBox } from "@/components/content/answer-box";
import { Faq } from "@/components/ui/faq";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/json-ld";

export const revalidate = 3600;

function parseSlug(slug: string): [string, string] | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};
  const [a, b] = await Promise.all([
    getCityBySlug(parsed[0]),
    getCityBySlug(parsed[1]),
  ]);
  if (!a || !b) return {};
  return buildMetadata({
    title: `${a.name} ou ${b.name} : quelle destination choisir ?`,
    description: `${a.name} ou ${b.name} ? On compare budget, météo, ambiance et activités pour vous aider à choisir votre prochaine destination.`,
    path: paths.comparator(a.slug, b.slug),
    type: "article",
  });
}

export default async function ComparatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const [a, b] = await Promise.all([
    getCityBySlug(parsed[0]),
    getCityBySlug(parsed[1]),
  ]);
  if (!a || !b) notFound();

  // URL canonique : ordre alphabétique forcé (évite le contenu dupliqué).
  const canonical = paths.comparator(a.slug, b.slug);
  if (`/comparateurs/${slug}` !== canonical) redirect(canonical);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Comparateurs", path: paths.comparators() },
    { name: `${a.name} vs ${b.name}`, path: canonical },
  ];

  const rows: {
    label: string;
    a: string | number;
    b: string | number;
    winner?: "a" | "b";
  }[] = [
    {
      label: "Note moyenne",
      a: a.rating ?? 0,
      b: b.rating ?? 0,
      winner: (a.rating ?? 0) >= (b.rating ?? 0) ? "a" : "b",
    },
    {
      label: "Budget / jour",
      a: `${a.avgBudgetPerDay ?? "—"} €`,
      b: `${b.avgBudgetPerDay ?? "—"} €`,
      winner:
        (a.avgBudgetPerDay ?? 9999) <= (b.avgBudgetPerDay ?? 9999) ? "a" : "b",
    },
    {
      label: "Durée conseillée",
      a: `${a.recommendedDays ?? "—"} j`,
      b: `${b.recommendedDays ?? "—"} j`,
    },
    { label: "Meilleure période", a: a.bestSeason ?? "—", b: b.bestSeason ?? "—" },
    { label: "Pays", a: a.country.name, b: b.country.name },
    {
      label: "Population",
      a: formatNumber(a.population),
      b: formatNumber(b.population),
    },
  ];

  const cheaper = (a.avgBudgetPerDay ?? 0) <= (b.avgBudgetPerDay ?? 0) ? a : b;
  const higher = (a.rating ?? 0) >= (b.rating ?? 0) ? a : b;

  const faqItems = [
    {
      question: `${a.name} ou ${b.name} : laquelle est la moins chère ?`,
      answer: `${cheaper.name} est en moyenne la destination la plus économique des deux.`,
    },
    {
      question: `${a.name} ou ${b.name} : laquelle choisir ?`,
      answer: `Choisissez ${a.name} pour ${a.summary ?? "son ambiance unique"}, ou ${b.name} pour ${b.summary ?? "son charme"}.`,
    },
  ];

  return (
    <div className="container py-8">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            title: `${a.name} ou ${b.name} : quelle destination choisir ?`,
            path: canonical,
          }),
          faqSchema(faqItems),
        ]}
      />
      <Breadcrumb items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

      <h1 className="font-display text-3xl font-semibold md:text-4xl">
        {a.name} ou {b.name} : quelle destination choisir ?
      </h1>

      {/* En-têtes visuels */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[a, b].map((city) => (
          <div key={city.id} className="overflow-hidden rounded-xl border border-border">
            <div className="relative aspect-[16/9] bg-muted">
              {city.heroImage && (
                <Image src={city.heroImage} alt={city.name} fill sizes="50vw" className="object-cover" priority />
              )}
            </div>
            <div className="p-3 text-center font-semibold">{city.name}</div>
          </div>
        ))}
      </div>

      <AnswerBox title="Notre verdict">
        Choisissez <strong>{cheaper.name}</strong> pour un voyage plus
        économique, ou <strong>{higher.name}</strong> pour la destination la
        mieux notée par les voyageurs.
      </AnswerBox>

      <AdSlot format="leaderboard" />

      {/* Tableau comparatif */}
      <div className="mt-4 overflow-hidden rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left font-medium">Critère</th>
              <th className="p-3 text-center font-semibold">{a.name}</th>
              <th className="p-3 text-center font-semibold">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-border">
                <td className="p-3 text-muted-foreground">{row.label}</td>
                <td className={`p-3 text-center ${row.winner === "a" ? "font-semibold text-brand-700" : ""}`}>
                  <span className="inline-flex items-center gap-1">
                    {row.a}
                    {row.winner === "a" && <Check size={14} className="text-brand-600" />}
                  </span>
                </td>
                <td className={`p-3 text-center ${row.winner === "b" ? "font-semibold text-brand-700" : ""}`}>
                  <span className="inline-flex items-center gap-1">
                    {row.b}
                    {row.winner === "b" && <Check size={14} className="text-brand-600" />}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Liens vers les fiches */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[a, b].map((city) => (
          <a
            key={city.id}
            href={paths.city(city.country.continent.slug, city.country.slug, city.slug)}
            className="rounded-lg border border-border bg-card p-4 text-center font-medium hover:border-brand-600"
          >
            Découvrir {city.name}
          </a>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-semibold">Questions fréquentes</h2>
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
