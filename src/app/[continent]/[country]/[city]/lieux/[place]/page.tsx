import { notFound } from "next/navigation";
import { Clock, Ticket, Timer, Accessibility, ExternalLink } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getPlace, getNearbyPlaces } from "@/server/destinations";
import { getApprovedComments } from "@/server/engagement";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RatingStars } from "@/components/ui/rating";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityCard } from "@/components/cards/entity-card";
import { InfoTile, InfoTileGrid } from "@/components/content/info-tile";
import { Gallery } from "@/components/content/gallery";
import { AdSlot } from "@/components/ads/ad-slot";
import { FavoriteButton } from "@/components/engagement/favorite-button";
import { Comments } from "@/components/engagement/comments";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, touristAttractionSchema } from "@/lib/json-ld";

export const revalidate = 3600;

type Params = Promise<{
  continent: string;
  country: string;
  city: string;
  place: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {
  const { continent, country, city, place } = await params;
  const data = await getPlace(continent, country, city, place);
  if (!data) return {};
  return buildMetadata({
    title: `${data.name} (${data.city.name}) : horaires, tarifs & visite`,
    description:
      data.metaDescription ??
      `${data.name} à ${data.city.name} : horaires, tarifs, durée de visite, accès et conseils pour préparer votre visite.`,
    path: paths.place(continent, country, city, place),
    image: data.heroImage ?? undefined,
  });
}

export default async function PlacePage({ params }: { params: Params }) {
  const { continent, country, city, place } = await params;
  const data = await getPlace(continent, country, city, place);
  if (!data) notFound();

  const [nearby, comments] = await Promise.all([
    getNearbyPlaces(data.cityId, data.id, 4),
    getApprovedComments("PLACE", data.id),
  ]);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: data.city.country.continent.name, path: paths.continent(continent) },
    { name: data.city.country.name, path: paths.country(continent, country) },
    { name: data.city.name, path: paths.city(continent, country, city) },
    { name: data.name, path: paths.place(continent, country, city, place) },
  ];

  return (
    <div className="container py-8">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          touristAttractionSchema({
            name: data.name,
            description: data.summary ?? undefined,
            image: data.heroImage ?? undefined,
            path: paths.place(continent, country, city, place),
            latitude: data.latitude,
            longitude: data.longitude,
            rating: data.rating,
          }),
        ]}
      />

      <Breadcrumb items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">
            {data.name}
          </h1>
          <p className="mt-2 flex items-center gap-3 text-muted-foreground">
            {data.city.name}
            {data.rating ? <RatingStars value={data.rating} /> : null}
          </p>
        </div>
        <FavoriteButton entityType="PLACE" entityId={data.id} variant="inline" />
      </header>

      <Gallery
        images={data.heroImage ? [data.heroImage, ...data.gallery] : data.gallery}
        alt={data.name}
      />

      {/* Faits pratiques (au-dessus de la ligne de flottaison) */}
      <div className="mt-8">
        <InfoTileGrid>
          <InfoTile icon={Clock} label="Horaires" value={data.openingHours} />
          <InfoTile icon={Ticket} label="Tarif" value={data.priceInfo} />
          <InfoTile icon={Timer} label="Durée" value={data.visitDuration} />
          <InfoTile
            icon={Accessibility}
            label="Accessibilité"
            value={data.accessibility}
          />
        </InfoTileGrid>
      </div>

      {data.description && (
        <div className="prose mt-8">
          <p>{data.description}</p>
        </div>
      )}

      {data.officialUrl && (
        <a
          href={data.officialUrl}
          target="_blank"
          rel="noopener nofollow"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
        >
          Site officiel <ExternalLink size={14} />
        </a>
      )}

      <AdSlot format="in-article" />

      {nearby.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="À proximité" as="h2" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.map((p) => (
              <EntityCard
                key={p.id}
                href={paths.place(continent, country, city, p.slug)}
                title={p.name}
                image={p.heroImage}
                rating={p.rating}
              />
            ))}
          </div>
        </section>
      )}

      <Comments entityType="PLACE" entityId={data.id} comments={comments} />
    </div>
  );
}
