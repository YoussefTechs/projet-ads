import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getContinents, getPopularCities } from "@/server/destinations";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionHeader } from "@/components/ui/section-header";
import { CategoryCard } from "@/components/cards/category-card";
import { EntityCard } from "@/components/cards/entity-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/json-ld";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Toutes nos destinations de voyage",
  description:
    "Explorez le monde par continent : pays, villes et lieux incontournables. Trouvez votre prochaine destination avec Atlas.",
  path: paths.destinations(),
});

export default async function DestinationsPage() {
  const [continents, cities] = await Promise.all([
    getContinents(),
    getPopularCities(12),
  ]);

  const crumbs = [
    { name: "Accueil", href: "/" },
    { name: "Destinations" },
  ];

  return (
    <div className="container-page">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Accueil", path: "/" },
            { name: "Destinations", path: paths.destinations() },
          ]),
          itemListSchema(
            continents.map((c) => ({
              name: c.name,
              path: paths.continent(c.slug),
            })),
          ),
        ]}
      />
      <Breadcrumb items={crumbs} />

      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">
          Explorez le monde
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Choisissez un continent pour découvrir ses pays, ses villes et ses
          lieux incontournables.
        </p>
      </header>

      <section className="mb-14">
        <SectionHeader title="Par continent" as="h2" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {continents.map((c) => (
            <CategoryCard
              key={c.id}
              href={paths.continent(c.slug)}
              title={c.name}
              image={c.heroImage}
              count={`${c._count.countries} pays`}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="Villes les plus consultées"
          subtitle="Une sélection des destinations préférées des voyageurs."
          as="h2"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((city) => (
            <EntityCard
              key={city.id}
              href={paths.city(
                city.country.continent.slug,
                city.country.slug,
                city.slug,
              )}
              title={city.name}
              subtitle={city.country.name}
              image={city.heroImage}
              rating={city.rating}
              meta={`${city._count.places} lieux`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
