import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

/**
 * Accès aux données « destinations » (continents → pays → villes → lieux).
 * Toutes les fonctions publiques ne renvoient que le contenu PUBLISHED.
 */

const PUBLISHED = { status: "PUBLISHED" as const };

// ───────────────────────── Continents ─────────────────────────

export function getContinents() {
  return prisma.continent.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { countries: true } } },
  });
}

export async function getContinentBySlug(slug: string) {
  return prisma.continent.findUnique({
    where: { slug },
    include: {
      countries: {
        where: PUBLISHED,
        orderBy: [{ featured: "desc" }, { name: "asc" }],
        include: { _count: { select: { cities: true } } },
      },
    },
  });
}

// ─────────────────────────── Pays ─────────────────────────────

export async function getCountry(
  continentSlug: string,
  countrySlug: string,
  preview = false,
) {
  return prisma.country.findFirst({
    where: {
      slug: countrySlug,
      continent: { slug: continentSlug },
      ...(preview ? {} : PUBLISHED),
    },
    include: {
      continent: true,
      cities: {
        where: PUBLISHED,
        orderBy: [{ featured: "desc" }, { rating: "desc" }],
        include: { _count: { select: { places: true } } },
      },
    },
  });
}

/** Lieux phares d'un pays (toutes villes confondues). */
export function getTopPlacesByCountry(countryId: string, take = 8) {
  return prisma.place.findMany({
    where: { city: { countryId }, ...PUBLISHED },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    take,
    include: { city: { select: { slug: true, name: true } } },
  });
}

// ─────────────────────────── Villes ───────────────────────────

export async function getCity(
  continentSlug: string,
  countrySlug: string,
  citySlug: string,
  preview = false,
) {
  return prisma.city.findFirst({
    where: {
      slug: citySlug,
      country: { slug: countrySlug, continent: { slug: continentSlug } },
      ...(preview ? {} : PUBLISHED),
    },
    include: {
      country: { include: { continent: true } },
      region: true,
      places: {
        where: PUBLISHED,
        orderBy: [{ featured: "desc" }, { rating: "desc" }],
        take: 12,
      },
      activities: {
        where: PUBLISHED,
        orderBy: [{ featured: "desc" }, { rating: "desc" }],
        take: 8,
      },
      hotels: {
        where: PUBLISHED,
        orderBy: { rating: "desc" },
        take: 6,
      },
      restaurants: {
        where: PUBLISHED,
        orderBy: { rating: "desc" },
        take: 6,
      },
      _count: {
        select: { places: true, activities: true, hotels: true, restaurants: true },
      },
    },
  });
}

/** Villes proches (même pays), pour le maillage interne. */
export function getNearbyCities(
  countryId: string,
  excludeCityId: string,
  take = 4,
) {
  return prisma.city.findMany({
    where: { countryId, id: { not: excludeCityId }, ...PUBLISHED },
    orderBy: { rating: "desc" },
    take,
  });
}

// ───────────────────── Lieux / Hôtels / Restos ────────────────

export async function getPlace(
  continentSlug: string,
  countrySlug: string,
  citySlug: string,
  placeSlug: string,
) {
  return prisma.place.findFirst({
    where: {
      slug: placeSlug,
      city: {
        slug: citySlug,
        country: { slug: countrySlug, continent: { slug: continentSlug } },
      },
      ...PUBLISHED,
    },
    include: { city: { include: { country: { include: { continent: true } } } } },
  });
}

export function getNearbyPlaces(
  cityId: string,
  excludePlaceId: string,
  take = 4,
) {
  return prisma.place.findMany({
    where: { cityId, id: { not: excludePlaceId }, ...PUBLISHED },
    orderBy: { rating: "desc" },
    take,
  });
}

export async function getHotel(
  continentSlug: string,
  countrySlug: string,
  citySlug: string,
  hotelSlug: string,
) {
  return prisma.hotel.findFirst({
    where: {
      slug: hotelSlug,
      city: {
        slug: citySlug,
        country: { slug: countrySlug, continent: { slug: continentSlug } },
      },
      ...PUBLISHED,
    },
    include: { city: { include: { country: { include: { continent: true } } } } },
  });
}

export async function getRestaurant(
  continentSlug: string,
  countrySlug: string,
  citySlug: string,
  restaurantSlug: string,
) {
  return prisma.restaurant.findFirst({
    where: {
      slug: restaurantSlug,
      city: {
        slug: citySlug,
        country: { slug: countrySlug, continent: { slug: continentSlug } },
      },
      ...PUBLISHED,
    },
    include: { city: { include: { country: { include: { continent: true } } } } },
  });
}

// ─────────────────── Sélections (accueil, etc.) ───────────────

// ─────────────────────────── Activités ────────────────────────

export function getActivitiesByCity(cityId: string, take = 8) {
  return prisma.activity.findMany({
    where: { cityId, ...PUBLISHED },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    take,
  });
}

export async function getActivity(
  continentSlug: string,
  countrySlug: string,
  citySlug: string,
  activitySlug: string,
  preview = false,
) {
  return prisma.activity.findFirst({
    where: {
      slug: activitySlug,
      city: {
        slug: citySlug,
        country: { slug: countrySlug, continent: { slug: continentSlug } },
      },
      ...(preview ? {} : PUBLISHED),
    },
    include: { city: { include: { country: { include: { continent: true } } } } },
  });
}

export function getFeaturedCountries(take = 8) {
  return prisma.country.findMany({
    where: PUBLISHED,
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    take,
    include: { continent: true, _count: { select: { cities: true } } },
  });
}

export function getPopularCities(take = 8) {
  return prisma.city.findMany({
    where: PUBLISHED,
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    take,
    include: {
      country: { include: { continent: true } },
      _count: { select: { places: true } },
    },
  });
}

/** Paramètres statiques pour le pré-rendu (generateStaticParams). */
export async function getAllCountryParams() {
  const countries = await prisma.country.findMany({
    where: PUBLISHED,
    select: { slug: true, continent: { select: { slug: true } } },
  });
  return countries.map((c) => ({
    continent: c.continent.slug,
    country: c.slug,
  }));
}

export async function getAllCityParams() {
  const cities = await prisma.city.findMany({
    where: PUBLISHED,
    select: {
      slug: true,
      country: { select: { slug: true, continent: { select: { slug: true } } } },
    },
  });
  return cities.map((c) => ({
    continent: c.country.continent.slug,
    country: c.country.slug,
    city: c.slug,
  }));
}

export type CityWithRelations = Prisma.PromiseReturnType<typeof getCity>;
export type CountryWithRelations = Prisma.PromiseReturnType<typeof getCountry>;

// ─────────────────────── Comparateurs ─────────────────────────

/** Récupère une ville par son seul slug (pour les comparateurs). */
export function getCityBySlug(slug: string) {
  return prisma.city.findFirst({
    where: { slug, ...PUBLISHED },
    include: { country: { include: { continent: true } } },
  });
}

/** Villes les mieux notées (suggestions de comparateurs). */
export function getComparableCities(take = 10) {
  return prisma.city.findMany({
    where: PUBLISHED,
    orderBy: { rating: "desc" },
    take,
    include: { country: { include: { continent: true } } },
  });
}
