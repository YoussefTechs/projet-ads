import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Clock, Ticket, Tag, ExternalLink } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getActivity, getActivitiesByCity } from "@/server/destinations";
import { getApprovedComments } from "@/server/engagement";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { RatingStars } from "@/components/ui/rating";
import { SectionHeader } from "@/components/ui/section-header";
import { EntityCard } from "@/components/cards/entity-card";
import { InfoTile, InfoTileGrid } from "@/components/content/info-tile";
import { Gallery } from "@/components/content/gallery";
import { Faq } from "@/components/ui/faq";
import { AdSlot } from "@/components/ads/ad-slot";
import { FavoriteButton } from "@/components/engagement/favorite-button";
import { Comments } from "@/components/engagement/comments";
import { buttonVariants } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema, touristAttractionSchema } from "@/lib/json-ld";

export const revalidate = 3600;

type Params = Promise<{
  continent: string;
  country: string;
  city: string;
  slug: string;
}>;

export async function generateMetadata({ params }: { params: Params }) {
  const { continent, country, city, slug } = await params;
  const data = await getActivity(continent, country, city, slug);
  if (!data) return {};
  return buildMetadata({
    title: `${data.name} à ${data.city.name} : infos & réservation`,
    description:
      data.metaDescription ??
      data.summary ??
      `${data.name} à ${data.city.name} : durée, tarif et conseils pour cette activité.`,
    path: paths.activity(continent, country, city, slug),
    image: data.heroImage ?? undefined,
  });
}

export default async function ActivityPage({ params }: { params: Params }) {
  const { continent, country, city, slug } = await params;
  const { isEnabled: preview } = await draftMode();
  const data = await getActivity(continent, country, city, slug, preview);
  if (!data) notFound();

  const [others, comments] = await Promise.all([
    getActivitiesByCity(data.cityId, 5),
    getApprovedComments("ACTIVITY", data.id),
  ]);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: data.city.country.continent.name, path: paths.continent(continent) },
    { name: data.city.country.name, path: paths.country(continent, country) },
    { name: data.city.name, path: paths.city(continent, country, city) },
    { name: data.name, path: paths.activity(continent, country, city, slug) },
  ];

  const faqItems = (data.faq as { question: string; answer: string }[] | null) ?? [];

  return (
    <div className="container py-8">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          touristAttractionSchema({
            name: data.name,
            description: data.summary ?? undefined,
            image: data.heroImage ?? undefined,
            path: paths.activity(continent, country, city, slug),
            latitude: data.latitude,
            longitude: data.longitude,
            rating: data.rating,
          }),
          ...(faqItems.length ? [faqSchema(faqItems)] : []),
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
        <FavoriteButton entityType="ACTIVITY" entityId={data.id} variant="inline" />
      </header>

      <Gallery
        images={data.heroImage ? [data.heroImage, ...data.gallery] : data.gallery}
        alt={data.name}
      />

      <div className="mt-8">
        <InfoTileGrid>
          <InfoTile icon={Tag} label="Catégorie" value={data.category} />
          <InfoTile icon={Clock} label="Durée" value={data.duration} />
          <InfoTile icon={Ticket} label="Tarif" value={data.priceInfo} />
        </InfoTileGrid>
      </div>

      {data.description && (
        <div className="prose mt-8">
          <p>{data.description}</p>
        </div>
      )}

      {data.affiliateUrl && (
        <a
          href={data.affiliateUrl}
          target="_blank"
          rel="noopener nofollow sponsored"
          className={buttonVariants({ className: "mt-6 bg-accent-500 hover:bg-accent-600" })}
        >
          Réserver cette activité <ExternalLink size={16} />
        </a>
      )}

      <AdSlot format="in-article" />

      {faqItems.length > 0 && (
        <section className="mt-6">
          <SectionHeader title="Questions fréquentes" as="h2" />
          <Faq items={faqItems} />
        </section>
      )}

      {others.length > 1 && (
        <section className="mt-14">
          <SectionHeader title={`Autres activités à ${data.city.name}`} as="h2" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {others
              .filter((a) => a.id !== data.id)
              .slice(0, 4)
              .map((a) => (
                <EntityCard
                  key={a.id}
                  href={paths.activity(continent, country, city, a.slug)}
                  title={a.name}
                  image={a.heroImage}
                  rating={a.rating}
                />
              ))}
          </div>
        </section>
      )}

      <Comments entityType="ACTIVITY" entityId={data.id} comments={comments} />
    </div>
  );
}
