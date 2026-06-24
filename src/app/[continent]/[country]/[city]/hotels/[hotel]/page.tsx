import { notFound } from "next/navigation";
import { Star, Coins, MapPin, ExternalLink, Check } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { priceRangeLabel } from "@/lib/utils";
import { getHotel } from "@/server/destinations";
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
import { breadcrumbSchema, lodgingSchema } from "@/lib/json-ld";

export const revalidate = 3600;

type Params = Promise<{
  continent: string;
  country: string;
  city: string;
  hotel: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {
  const { continent, country, city, hotel } = await params;
  const data = await getHotel(continent, country, city, hotel);
  if (!data) return {};
  return buildMetadata({
    title: `${data.name}, ${data.city.name} : avis, prix & équipements`,
    description:
      data.metaDescription ??
      `${data.name} à ${data.city.name} : équipements, gamme de prix, quartier et avis pour bien choisir votre hébergement.`,
    path: paths.hotel(continent, country, city, hotel),
    image: data.heroImage ?? undefined,
  });
}

export default async function HotelPage({ params }: { params: Params }) {
  const { continent, country, city, hotel } = await params;
  const data = await getHotel(continent, country, city, hotel);
  if (!data) notFound();

  const comments = await getApprovedComments("HOTEL", data.id);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: data.city.country.continent.name, path: paths.continent(continent) },
    { name: data.city.country.name, path: paths.country(continent, country) },
    { name: data.city.name, path: paths.city(continent, country, city) },
    { name: data.name, path: paths.hotel(continent, country, city, hotel) },
  ];

  return (
    <div className="container py-8">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          lodgingSchema({
            name: data.name,
            description: data.summary ?? undefined,
            image: data.heroImage ?? undefined,
            path: paths.hotel(continent, country, city, hotel),
            priceRange: priceRangeLabel(data.priceRange),
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
            <span className="flex items-center gap-0.5">
              {Array.from({ length: data.stars ?? 0 }).map((_, i) => (
                <Star key={i} size={15} className="fill-accent-400 text-accent-400" />
              ))}
            </span>
            <Badge variant="muted">{priceRangeLabel(data.priceRange)}</Badge>
            {data.rating ? <RatingStars value={data.rating} /> : null}
          </div>
        </div>
        <FavoriteButton entityType="HOTEL" entityId={data.id} variant="inline" />
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

          {data.amenities.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-xl font-semibold">Équipements</h2>
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {data.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <Check size={16} className="text-brand-600" /> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <InfoTileGrid>
            <InfoTile icon={Coins} label="Gamme de prix" value={priceRangeLabel(data.priceRange)} />
            <InfoTile icon={MapPin} label="Quartier" value={data.neighborhood} />
          </InfoTileGrid>
          {/* Bloc réservation (affiliation — Phase V3) */}
          <a
            href={data.affiliateUrl ?? "#"}
            target="_blank"
            rel="noopener nofollow sponsored"
            className={buttonVariants({
              variant: "primary",
              size: "lg",
              className: "w-full bg-accent-500 hover:bg-accent-600",
            })}
          >
            Voir les disponibilités <ExternalLink size={16} />
          </a>
          <AdSlot format="sidebar" />
        </aside>
      </div>

      <Comments entityType="HOTEL" entityId={data.id} comments={comments} />
    </div>
  );
}
