import { notFound } from "next/navigation";
import { Coins, MapPin, UtensilsCrossed, ExternalLink } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { priceRangeLabel } from "@/lib/utils";
import { getRestaurant } from "@/server/destinations";
import { getApprovedComments } from "@/server/engagement";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RatingStars } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { InfoTile, InfoTileGrid } from "@/components/content/info-tile";
import { Gallery } from "@/components/content/gallery";
import { AdSlot } from "@/components/ads/ad-slot";
import { FavoriteButton } from "@/components/engagement/favorite-button";
import { Comments } from "@/components/engagement/comments";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, restaurantSchema } from "@/lib/json-ld";

export const revalidate = 3600;

type Params = Promise<{
  continent: string;
  country: string;
  city: string;
  restaurant: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {
  const { continent, country, city, restaurant } = await params;
  const data = await getRestaurant(continent, country, city, restaurant);
  if (!data) return {};
  return buildMetadata({
    title: `${data.name}, ${data.city.name} : cuisine, prix & avis`,
    description:
      data.metaDescription ??
      `${data.name} à ${data.city.name} : type de cuisine, gamme de prix, spécialités et avis.`,
    path: paths.restaurant(continent, country, city, restaurant),
    image: data.heroImage ?? undefined,
  });
}

export default async function RestaurantPage({ params }: { params: Params }) {
  const { continent, country, city, restaurant } = await params;
  const data = await getRestaurant(continent, country, city, restaurant);
  if (!data) notFound();

  const comments = await getApprovedComments("RESTAURANT", data.id);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: data.city.country.continent.name, path: paths.continent(continent) },
    { name: data.city.country.name, path: paths.country(continent, country) },
    { name: data.city.name, path: paths.city(continent, country, city) },
    { name: data.name, path: paths.restaurant(continent, country, city, restaurant) },
  ];

  return (
    <div className="container py-8">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          restaurantSchema({
            name: data.name,
            description: data.summary ?? undefined,
            image: data.heroImage ?? undefined,
            path: paths.restaurant(continent, country, city, restaurant),
            priceRange: priceRangeLabel(data.priceRange),
            servesCuisine: data.cuisines,
            rating: data.rating,
            city: data.city.name,
          }),
        ]}
      />

      <Breadcrumb items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">
            {data.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
            <span>{data.cuisines.join(", ")}</span>
            <Badge variant="muted">{priceRangeLabel(data.priceRange)}</Badge>
            {data.rating ? <RatingStars value={data.rating} /> : null}
          </div>
        </div>
        <FavoriteButton
          entityType="RESTAURANT"
          entityId={data.id}
          variant="inline"
        />
      </header>

      <Gallery
        images={data.heroImage ? [data.heroImage, ...data.gallery] : data.gallery}
        alt={data.name}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {data.description && (
            <div className="prose">
              <p>{data.description}</p>
            </div>
          )}
          {data.specialties.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-xl font-semibold">Spécialités</h2>
              <div className="flex flex-wrap gap-2">
                {data.specialties.map((s) => (
                  <Badge key={s} variant="brand">
                    <UtensilsCrossed size={13} /> {s}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <InfoTileGrid>
            <InfoTile icon={Coins} label="Gamme de prix" value={priceRangeLabel(data.priceRange)} />
            <InfoTile icon={MapPin} label="Quartier" value={data.neighborhood} />
          </InfoTileGrid>
          {data.affiliateUrl && (
            <a
              href={data.affiliateUrl}
              target="_blank"
              rel="noopener nofollow sponsored"
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className: "w-full bg-accent-500 hover:bg-accent-600",
              })}
            >
              Réserver une table <ExternalLink size={16} />
            </a>
          )}
          <AdSlot format="sidebar" />
        </aside>
      </div>

      <Comments entityType="RESTAURANT" entityId={data.id} comments={comments} />
    </div>
  );
}
