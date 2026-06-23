import { notFound } from "next/navigation";
import {
  Building2,
  Coins,
  Globe,
  CalendarDays,
  ShieldCheck,
  Plug,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { formatNumber } from "@/lib/utils";
import {
  getAllCountryParams,
  getCountry,
  getTopPlacesByCountry,
} from "@/server/destinations";
import { getArticlesByCountry } from "@/server/content";
import { PageHero } from "@/components/content/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityCard } from "@/components/cards/entity-card";
import { ArticleCard } from "@/components/cards/article-card";
import { InfoTile, InfoTileGrid } from "@/components/content/info-tile";
import { Faq } from "@/components/ui/faq";
import { AdSlot } from "@/components/ads/ad-slot";
import { FavoriteButton } from "@/components/engagement/favorite-button";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  touristDestinationSchema,
} from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCountryParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ continent: string; country: string }>;
}) {
  const { continent, country } = await params;
  const data = await getCountry(continent, country);
  if (!data) return {};
  const year = new Date().getFullYear();
  return buildMetadata({
    title: `Voyage en ${data.name} : que faire, quand partir, guide ${year}`,
    description:
      data.metaDescription ??
      `Préparez votre voyage en ${data.name} : que faire, quand partir, budget, visa et ${data.cities.length} villes incontournables.`,
    path: paths.country(continent, country),
    image: data.heroImage ?? undefined,
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ continent: string; country: string }>;
}) {
  const { continent, country } = await params;
  const data = await getCountry(continent, country);
  if (!data) notFound();

  const [topPlaces, relatedArticles] = await Promise.all([
    getTopPlacesByCountry(data.id, 8),
    getArticlesByCountry(data.id, 3),
  ]);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: data.continent.name, path: paths.continent(continent) },
    { name: data.name, path: paths.country(continent, country) },
  ];

  const faqItems = [
    {
      question: `Quelle est la meilleure période pour visiter ${data.name} ?`,
      answer: `La meilleure période pour visiter ${data.name} est ${(data.bestSeason ?? "le printemps et l'automne").toLowerCase()}.`,
    },
    {
      question: `Quel budget prévoir pour un voyage en ${data.name} ?`,
      answer: `Comptez en moyenne ${formatNumber(data.avgBudgetPerDay)} € par jour et par personne, hébergement, repas et activités compris.`,
    },
    {
      question: `Faut-il un visa pour ${data.name} ?`,
      answer: data.visaSummary ?? "Vérifiez les conditions de visa selon votre nationalité avant le départ.",
    },
  ];

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          touristDestinationSchema({
            name: data.name,
            description: data.summary ?? undefined,
            image: data.heroImage ?? undefined,
            path: paths.country(continent, country),
            latitude: data.latitude,
            longitude: data.longitude,
            containedIn: data.continent.name,
          }),
          faqSchema(faqItems),
          itemListSchema(
            data.cities.map((c) => ({
              name: c.name,
              path: paths.city(continent, country, c.slug),
            })),
          ),
        ]}
      />

      <PageHero
        title={`${data.flagEmoji ?? ""} ${data.name}`.trim()}
        subtitle={data.summary ?? undefined}
        image={data.heroImage}
        breadcrumb={crumbs.map((c) => ({ name: c.name, href: c.path }))}
        actions={
          <FavoriteButton
            entityType="COUNTRY"
            entityId={data.id}
            variant="inline"
          />
        }
      />

      <div className="container-page">
        {/* Faits clés */}
        <InfoTileGrid>
          <InfoTile icon={Building2} label="Capitale" value={data.capital} />
          <InfoTile icon={Coins} label="Monnaie" value={data.currency} />
          <InfoTile icon={Globe} label="Langue" value={data.languages.join(", ")} />
          <InfoTile
            icon={CalendarDays}
            label="Quand partir"
            value={data.bestSeason}
          />
          <InfoTile
            icon={Coins}
            label="Budget / jour"
            value={data.avgBudgetPerDay ? `${data.avgBudgetPerDay} €` : "—"}
          />
          <InfoTile icon={ShieldCheck} label="Sécurité" value={data.safetyLevel} />
          <InfoTile icon={Plug} label="Prises" value={data.powerPlug} />
          <InfoTile
            icon={Globe}
            label="Population"
            value={formatNumber(data.population)}
          />
        </InfoTileGrid>

        {data.description && (
          <p className="mt-8 max-w-prose text-lg leading-relaxed text-ink-700 dark:text-ink-300">
            {data.description}
          </p>
        )}

        <AdSlot format="leaderboard" />

        {/* Villes */}
        <section className="mt-6">
          <SectionHeader title={`Villes à visiter en ${data.name}`} as="h2" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.cities.map((city) => (
              <EntityCard
                key={city.id}
                href={paths.city(continent, country, city.slug)}
                title={city.name}
                image={city.heroImage}
                rating={city.rating}
                meta={`${city._count.places} lieux`}
                action={
                  <FavoriteButton entityType="CITY" entityId={city.id} />
                }
              />
            ))}
          </div>
        </section>

        {/* Lieux phares */}
        {topPlaces.length > 0 && (
          <section className="mt-14">
            <SectionHeader title="Lieux incontournables" as="h2" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {topPlaces.map((place) => (
                <EntityCard
                  key={place.id}
                  href={paths.place(continent, country, place.city.slug, place.slug)}
                  title={place.name}
                  subtitle={place.city.name}
                  image={place.heroImage}
                  rating={place.rating}
                />
              ))}
            </div>
          </section>
        )}

        <AdSlot format="in-article" />

        {/* Guides liés */}
        {relatedArticles.length > 0 && (
          <section className="mt-14">
            <SectionHeader title={`Guides sur ${data.name}`} as="h2" href={paths.guides()} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-14">
          <SectionHeader title="Questions fréquentes" as="h2" />
          <Faq items={faqItems} />
        </section>
      </div>
    </article>
  );
}
