import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getCategories, getCategoryBySlug } from "@/server/content";
import { PageHero } from "@/components/content/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityCard } from "@/components/cards/entity-card";
import { ArticleCard } from "@/components/cards/article-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} : nos meilleures destinations`,
    description:
      cat.metaDescription ??
      cat.intro ??
      `Nos meilleures idées de ${cat.name.toLowerCase()} : destinations triées sur le volet et guides dédiés.`,
    path: paths.category(slug),
    image: cat.heroImage ?? undefined,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Catégories", path: paths.categories() },
    { name: cat.name, path: paths.category(slug) },
  ];

  return (
    <article>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          itemListSchema([
            ...cat.countries.map((c) => ({
              name: c.name,
              path: paths.country(c.continent.slug, c.slug),
            })),
            ...cat.cities.map((c) => ({
              name: c.name,
              path: paths.city(c.country.continent.slug, c.country.slug, c.slug),
            })),
          ]),
        ]}
      />

      <PageHero
        title={cat.name}
        subtitle={cat.intro ?? undefined}
        image={cat.heroImage}
        breadcrumb={crumbs.map((c) => ({ name: c.name, href: c.path }))}
      />

      <div className="container-page">
        {cat.description && (
          <p className="max-w-prose text-lg leading-relaxed text-ink-700 dark:text-ink-300">
            {cat.description}
          </p>
        )}

        <AdSlot format="leaderboard" />

        {(cat.cities.length > 0 || cat.countries.length > 0) && (
          <section className="mt-6">
            <SectionHeader title="Destinations recommandées" as="h2" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {cat.countries.map((c) => (
                <EntityCard
                  key={c.id}
                  href={paths.country(c.continent.slug, c.slug)}
                  title={`${c.flagEmoji ?? ""} ${c.name}`.trim()}
                  image={c.heroImage}
                  rating={c.rating}
                  meta={`${c._count.cities} villes`}
                />
              ))}
              {cat.cities.map((c) => (
                <EntityCard
                  key={c.id}
                  href={paths.city(c.country.continent.slug, c.country.slug, c.slug)}
                  title={c.name}
                  subtitle={c.country.name}
                  image={c.heroImage}
                  rating={c.rating}
                />
              ))}
            </div>
          </section>
        )}

        {cat.articles.length > 0 && (
          <section className="mt-14">
            <SectionHeader title="Guides & articles" as="h2" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {cat.articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
