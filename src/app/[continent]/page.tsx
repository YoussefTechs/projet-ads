import { notFound } from "next/navigation";
import { Globe2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getContinentBySlug, getContinents } from "@/server/destinations";
import { PageHero } from "@/components/content/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityCard } from "@/components/cards/entity-card";
import { InfoTile, InfoTileGrid } from "@/components/content/info-tile";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  itemListSchema,
  touristDestinationSchema,
} from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const continents = await getContinents();
  return continents.map((c) => ({ continent: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ continent: string }>;
}) {
  const { continent } = await params;
  const data = await getContinentBySlug(continent);
  if (!data) return {};
  return buildMetadata({
    title: `Voyage en ${data.name} : destinations & guides`,
    description:
      data.metaDescription ??
      `Découvrez les meilleures destinations d'${data.name} : pays, villes et lieux incontournables. Conseils et guides de voyage Atlas.`,
    path: paths.continent(data.slug),
    image: data.heroImage ?? undefined,
  });
}

export default async function ContinentPage({
  params,
}: {
  params: Promise<{ continent: string }>;
}) {
  const { continent } = await params;
  const data = await getContinentBySlug(continent);
  if (!data) notFound();

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Destinations", path: paths.destinations() },
    { name: data.name, path: paths.continent(data.slug) },
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
            path: paths.continent(data.slug),
          }),
          itemListSchema(
            data.countries.map((c) => ({
              name: c.name,
              path: paths.country(data.slug, c.slug),
            })),
          ),
        ]}
      />

      <PageHero
        title={`Voyage en ${data.name}`}
        subtitle={data.summary ?? undefined}
        image={data.heroImage}
        breadcrumb={crumbs.map((c) => ({ name: c.name, href: c.path }))}
      />

      <div className="container-page">
        <InfoTileGrid>
          <InfoTile icon={Globe2} label="Pays" value={data.countries.length} />
        </InfoTileGrid>

        {data.description && (
          <p className="mt-8 max-w-prose text-lg leading-relaxed text-ink-700 dark:text-ink-300">
            {data.description}
          </p>
        )}

        <AdSlot format="leaderboard" />

        <section className="mt-6">
          <SectionHeader title={`Pays à visiter en ${data.name}`} as="h2" />
          {data.countries.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.countries.map((country) => (
                <EntityCard
                  key={country.id}
                  href={paths.country(data.slug, country.slug)}
                  title={`${country.flagEmoji ?? ""} ${country.name}`.trim()}
                  image={country.heroImage}
                  rating={country.rating}
                  meta={`${country._count.cities} villes`}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Bientôt de nouvelles destinations dans cette région.
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
