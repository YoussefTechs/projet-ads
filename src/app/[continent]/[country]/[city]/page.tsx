import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { CalendarDays, Coins, Clock, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { priceRangeLabel } from "@/lib/utils";
import { CITY_INTENTS } from "@/config/site";
import {
  getAllCityParams,
  getCity,
  getNearbyCities,
} from "@/server/destinations";
import { getArticlesByCity } from "@/server/content";
import { getApprovedComments } from "@/server/engagement";
import { PageHero } from "@/components/content/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityCard } from "@/components/cards/entity-card";
import { ArticleCard } from "@/components/cards/article-card";
import { InfoTile, InfoTileGrid } from "@/components/content/info-tile";
import { ClimateChart, type ClimateData } from "@/components/content/climate-chart";
import { Faq } from "@/components/ui/faq";
import { AdSlot } from "@/components/ads/ad-slot";
import { FavoriteButton } from "@/components/engagement/favorite-button";
import { Comments } from "@/components/engagement/comments";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  touristDestinationSchema,
} from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllCityParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>;
}) {
  const { continent, country, city } = await params;
  const data = await getCity(continent, country, city);
  if (!data) return {};
  return buildMetadata({
    title: `Que faire à ${data.name} ? Top lieux, conseils & guide`,
    description:
      data.metaDescription ??
      `Découvrez ${data.name} : ${data._count.places} lieux à visiter, où dormir, où manger, météo et conseils pratiques.`,
    path: paths.city(continent, country, city),
    image: data.heroImage ?? undefined,
  });
}

const subNav = [
  { href: "#que-faire", label: "Que faire" },
  { href: "#ou-dormir", label: "Où dormir" },
  { href: "#ou-manger", label: "Où manger" },
  { href: "#quand-partir", label: "Quand partir" },
];

export default async function CityPage({
  params,
}: {
  params: Promise<{ continent: string; country: string; city: string }>;
}) {
  const { continent, country, city } = await params;
  const { isEnabled: preview } = await draftMode();
  const data = await getCity(continent, country, city, preview);
  if (!data) notFound();

  const [nearby, articles, comments] = await Promise.all([
    getNearbyCities(data.countryId, data.id, 4),
    getArticlesByCity(data.id, 3),
    getApprovedComments("CITY", data.id),
  ]);

  const climate = data.climate as unknown as ClimateData | null;

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: data.country.continent.name, path: paths.continent(continent) },
    { name: data.country.name, path: paths.country(continent, country) },
    { name: data.name, path: paths.city(continent, country, city) },
  ];

  const storedFaq =
    (data.faq as { question: string; answer: string }[] | null) ?? [];
  const faqItems =
    storedFaq.length > 0
      ? storedFaq
      : [
          {
            question: `Combien de jours pour visiter ${data.name} ?`,
            answer: `Nous conseillons environ ${data.recommendedDays ?? 3} jours pour profiter de ${data.name} et de ses environs.`,
          },
          {
            question: `Quelle est la meilleure période pour visiter ${data.name} ?`,
            answer: `La meilleure période est ${(data.bestSeason ?? "le printemps et l'automne").toLowerCase()}.`,
          },
          {
            question: `Quel budget prévoir à ${data.name} ?`,
            answer: `Comptez environ ${data.avgBudgetPerDay ?? 80} € par jour et par personne.`,
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
            path: paths.city(continent, country, city),
            latitude: data.latitude,
            longitude: data.longitude,
            containedIn: data.country.name,
          }),
          itemListSchema(
            data.places.map((p) => ({
              name: p.name,
              path: paths.place(continent, country, city, p.slug),
            })),
          ),
          faqSchema(faqItems),
        ]}
      />

      <PageHero
        title={data.name}
        subtitle={data.summary ?? undefined}
        image={data.heroImage}
        breadcrumb={crumbs.map((c) => ({ name: c.name, href: c.path }))}
        actions={
          <FavoriteButton entityType="CITY" entityId={data.id} variant="inline" />
        }
      />

      {/* Sous-navigation ancrée (sticky) */}
      <nav className="sticky top-16 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex gap-1 overflow-x-auto py-2">
          {subNav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="container py-10">
        {/* Réponse rapide + faits */}
        {data.description && (
          <p className="max-w-prose text-lg leading-relaxed text-ink-700 dark:text-ink-300">
            {data.description}
          </p>
        )}

        <div className="mt-6">
          <InfoTileGrid>
            <InfoTile icon={CalendarDays} label="Quand partir" value={data.bestSeason} />
            <InfoTile
              icon={Coins}
              label="Budget / jour"
              value={data.avgBudgetPerDay ? `${data.avgBudgetPerDay} €` : "—"}
            />
            <InfoTile
              icon={Clock}
              label="Durée conseillée"
              value={data.recommendedDays ? `${data.recommendedDays} jours` : "—"}
            />
            <InfoTile icon={MapPin} label="Lieux" value={data._count.places} />
          </InfoTileGrid>
        </div>

        {/* Pages d'intention */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CITY_INTENTS.map((intent) => (
            <Link
              key={intent.slug}
              href={paths.cityIntent(continent, country, city, intent.slug)}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-brand-600 hover:text-brand-700"
            >
              {intent.label} à {data.name}
            </Link>
          ))}
        </div>

        <AdSlot format="leaderboard" />

        {/* Que faire */}
        <section id="que-faire" className="mt-6 scroll-mt-32">
          <SectionHeader
            title={`Que faire à ${data.name} ?`}
            href={paths.cityIntent(continent, country, city, "que-faire")}
            linkLabel="Tout voir"
            as="h2"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.places.map((place) => (
              <EntityCard
                key={place.id}
                href={paths.place(continent, country, city, place.slug)}
                title={place.name}
                image={place.heroImage}
                rating={place.rating}
                meta={place.visitDuration ?? undefined}
                action={<FavoriteButton entityType="PLACE" entityId={place.id} />}
              />
            ))}
          </div>
        </section>

        {/* Activités */}
        {data.activities.length > 0 && (
          <section id="activites" className="mt-14 scroll-mt-32">
            <SectionHeader title={`Activités à ${data.name}`} as="h2" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {data.activities.map((activity) => (
                <EntityCard
                  key={activity.id}
                  href={paths.activity(continent, country, city, activity.slug)}
                  title={activity.name}
                  image={activity.heroImage}
                  rating={activity.rating}
                  meta={activity.duration ?? undefined}
                  action={
                    <FavoriteButton entityType="ACTIVITY" entityId={activity.id} />
                  }
                />
              ))}
            </div>
          </section>
        )}

        <AdSlot format="in-article" />

        {/* Où dormir */}
        {data.hotels.length > 0 && (
          <section id="ou-dormir" className="mt-6 scroll-mt-32">
            <SectionHeader title="Où dormir" as="h2" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.hotels.map((hotel) => (
                <EntityCard
                  key={hotel.id}
                  href={paths.hotel(continent, country, city, hotel.slug)}
                  title={hotel.name}
                  subtitle={hotel.neighborhood ?? undefined}
                  image={hotel.heroImage}
                  rating={hotel.rating}
                  badge={priceRangeLabel(hotel.priceRange)}
                  meta={hotel.amenities.slice(0, 3).join(" · ")}
                />
              ))}
            </div>
          </section>
        )}

        {/* Où manger */}
        {data.restaurants.length > 0 && (
          <section id="ou-manger" className="mt-14 scroll-mt-32">
            <SectionHeader title="Où manger" as="h2" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.restaurants.map((resto) => (
                <EntityCard
                  key={resto.id}
                  href={paths.restaurant(continent, country, city, resto.slug)}
                  title={resto.name}
                  subtitle={resto.neighborhood ?? undefined}
                  image={resto.heroImage}
                  rating={resto.rating}
                  badge={priceRangeLabel(resto.priceRange)}
                  meta={resto.cuisines.join(" · ")}
                />
              ))}
            </div>
          </section>
        )}

        {/* Quand partir */}
        {climate?.months && (
          <section id="quand-partir" className="mt-14 scroll-mt-32">
            <SectionHeader
              title={`Quand partir à ${data.name} ?`}
              href={paths.cityIntent(continent, country, city, "quand-partir")}
              linkLabel="En savoir plus"
              as="h2"
            />
            <ClimateChart data={climate} />
          </section>
        )}

        {/* Guides liés */}
        {articles.length > 0 && (
          <section className="mt-14">
            <SectionHeader title={`Guides sur ${data.name}`} as="h2" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* Villes proches */}
        {nearby.length > 0 && (
          <section className="mt-14">
            <SectionHeader title="À proximité" as="h2" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {nearby.map((c) => (
                <EntityCard
                  key={c.id}
                  href={paths.city(continent, country, c.slug)}
                  title={c.name}
                  image={c.heroImage}
                  rating={c.rating}
                />
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-14">
          <SectionHeader title="Questions fréquentes" as="h2" />
          <Faq items={faqItems} />
        </section>

        <AdSlot format="in-article" />

        {/* Commentaires */}
        <Comments entityType="CITY" entityId={data.id} comments={comments} />
      </div>
    </article>
  );
}
