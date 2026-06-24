import { notFound } from "next/navigation";
import { Coins, Bed, Utensils, Bus, Ticket } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { CITY_INTENTS } from "@/config/site";
import { priceRangeLabel } from "@/lib/utils";
import { getCity } from "@/server/destinations";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityCard } from "@/components/cards/entity-card";
import { InfoTile, InfoTileGrid } from "@/components/content/info-tile";
import { AnswerBox } from "@/components/content/answer-box";
import { ClimateChart, type ClimateData } from "@/components/content/climate-chart";
import { Faq } from "@/components/ui/faq";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/json-ld";

export const revalidate = 3600;

type Params = Promise<{
  continent: string;
  country: string;
  city: string;
  intent: string;
}>;

const INTENT_SLUGS = CITY_INTENTS.map((i) => i.slug);

const titles: Record<string, (city: string) => string> = {
  "que-faire": (c) => `Que faire à ${c} : les incontournables`,
  "quand-partir": (c) => `Quand partir à ${c} ? Meilleure période & météo`,
  "ou-dormir": (c) => `Où dormir à ${c} : meilleurs quartiers & hôtels`,
  budget: (c) => `Budget voyage à ${c} : combien prévoir ?`,
  transport: (c) => `Se déplacer à ${c} : transports & conseils`,
};

export async function generateMetadata({ params }: { params: Params }) {
  const { continent, country, city, intent } = await params;
  if (!INTENT_SLUGS.includes(intent as never)) return {};
  const data = await getCity(continent, country, city);
  if (!data) return {};
  const title = titles[intent](data.name);
  return buildMetadata({
    title,
    description: `${title}. Conseils pratiques, sélection et informations à jour par Atlas.`,
    path: paths.cityIntent(continent, country, city, intent),
    image: data.heroImage ?? undefined,
    type: "article",
  });
}

export default async function IntentPage({ params }: { params: Params }) {
  const { continent, country, city, intent } = await params;
  if (!INTENT_SLUGS.includes(intent as never)) notFound();

  const data = await getCity(continent, country, city);
  if (!data) notFound();

  const climate = data.climate as unknown as ClimateData | null;
  const title = titles[intent](data.name);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: data.country.continent.name, path: paths.continent(continent) },
    { name: data.country.name, path: paths.country(continent, country) },
    { name: data.name, path: paths.city(continent, country, city) },
    {
      name: CITY_INTENTS.find((i) => i.slug === intent)!.label,
      path: paths.cityIntent(continent, country, city, intent),
    },
  ];

  const faqItems = [
    {
      question: title,
      answer: `Retrouvez tous nos conseils sur le thème « ${CITY_INTENTS.find((i) => i.slug === intent)!.label.toLowerCase()} » à ${data.name}.`,
    },
  ];

  return (
    <div className="container py-8">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            title,
            description: `${title} — guide Atlas.`,
            image: data.heroImage ?? undefined,
            path: paths.cityIntent(continent, country, city, intent),
            datePublished: data.publishedAt,
            dateModified: data.updatedAt,
          }),
          faqSchema(faqItems),
        ]}
      />

      <Breadcrumb items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

      <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>

      {/* ─── Que faire ─── */}
      {intent === "que-faire" && (
        <>
          <AnswerBox>
            À {data.name}, ne manquez pas les {data._count.places} lieux
            incontournables sélectionnés ci-dessous. Comptez environ{" "}
            {data.recommendedDays ?? 3} jours pour tout visiter sereinement.
          </AnswerBox>
          <AdSlot format="leaderboard" />
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.places.map((p) => (
              <EntityCard
                key={p.id}
                href={paths.place(continent, country, city, p.slug)}
                title={p.name}
                image={p.heroImage}
                rating={p.rating}
                meta={p.visitDuration ?? undefined}
              />
            ))}
          </div>
        </>
      )}

      {/* ─── Quand partir ─── */}
      {intent === "quand-partir" && (
        <>
          <AnswerBox>
            La meilleure période pour visiter {data.name} est{" "}
            <strong>{(data.bestSeason ?? "le printemps et l'automne").toLowerCase()}</strong>.
          </AnswerBox>
          {climate?.months && (
            <div className="mt-4">
              <ClimateChart data={climate} />
            </div>
          )}
          <AdSlot format="in-article" />
        </>
      )}

      {/* ─── Où dormir ─── */}
      {intent === "ou-dormir" && (
        <>
          <AnswerBox>
            Pour dormir à {data.name}, privilégiez le centre-ville pour être à
            proximité des principaux sites. Voici notre sélection d'hébergements.
          </AnswerBox>
          <AdSlot format="leaderboard" />
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.hotels.map((h) => (
              <EntityCard
                key={h.id}
                href={paths.hotel(continent, country, city, h.slug)}
                title={h.name}
                subtitle={h.neighborhood ?? undefined}
                image={h.heroImage}
                rating={h.rating}
                badge={priceRangeLabel(h.priceRange)}
              />
            ))}
          </div>
        </>
      )}

      {/* ─── Budget ─── */}
      {intent === "budget" && (
        <>
          <AnswerBox>
            Comptez en moyenne{" "}
            <strong>{data.avgBudgetPerDay ?? 80} € par jour</strong> et par
            personne à {data.name} (hébergement, repas et activités).
          </AnswerBox>
          <div className="mt-6">
            <InfoTileGrid>
              <InfoTile icon={Bed} label="Nuit (hôtel)" value={`${Math.round((data.avgBudgetPerDay ?? 80) * 0.5)} €`} />
              <InfoTile icon={Utensils} label="Repas" value={`${Math.round((data.avgBudgetPerDay ?? 80) * 0.25)} €`} />
              <InfoTile icon={Bus} label="Transport" value={`${Math.round((data.avgBudgetPerDay ?? 80) * 0.15)} €`} />
              <InfoTile icon={Ticket} label="Activités" value={`${Math.round((data.avgBudgetPerDay ?? 80) * 0.1)} €`} />
            </InfoTileGrid>
          </div>
          <AdSlot format="in-article" />
        </>
      )}

      {/* ─── Transport ─── */}
      {intent === "transport" && (
        <>
          <AnswerBox>
            À {data.name}, les transports en commun sont le moyen le plus
            pratique et économique de se déplacer. Pensez aux pass journée.
          </AnswerBox>
          <div className="prose mt-6">
            <h2>Depuis l'aéroport</h2>
            <p>
              Des navettes et transports en commun relient l'aéroport au centre
              de {data.name}. Comparez les options selon votre budget.
            </p>
            <h2>Sur place</h2>
            <ul>
              <li>Transports en commun : métro, bus, tramway</li>
              <li>À pied pour le centre historique</li>
              <li>Vélos et trottinettes en libre-service</li>
            </ul>
          </div>
          <AdSlot format="in-article" />
        </>
      )}

      <section className="mt-12">
        <SectionHeader title="Questions fréquentes" as="h2" />
        <Faq items={faqItems} />
      </section>
    </div>
  );
}
