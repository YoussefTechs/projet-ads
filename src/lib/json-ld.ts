import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/url";

/**
 * Générateurs de données structurées JSON-LD (schema.org).
 * Réf. : docs/PHASE-2-SEO.md §8–§13. Le contenu doit refléter exactement
 * ce qui est visible à l'écran (sinon risque de pénalité).
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    sameAs: [siteConfig.social.twitter, siteConfig.social.instagram],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/recherche?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

interface ArticleSchemaInput {
  title: string;
  description?: string;
  image?: string;
  path: string;
  datePublished?: string | Date | null;
  dateModified?: string | Date | null;
  authorName?: string;
  authorPath?: string;
}

export function articleSchema(a: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: a.image ? [a.image] : undefined,
    datePublished: a.datePublished
      ? new Date(a.datePublished).toISOString()
      : undefined,
    dateModified: a.dateModified
      ? new Date(a.dateModified).toISOString()
      : undefined,
    author: a.authorName
      ? {
          "@type": "Person",
          name: a.authorName,
          url: a.authorPath ? absoluteUrl(a.authorPath) : undefined,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(a.path) },
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

interface DestinationSchemaInput {
  name: string;
  description?: string;
  image?: string;
  path: string;
  latitude?: number | null;
  longitude?: number | null;
  containedIn?: string;
}

export function touristDestinationSchema(d: DestinationSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.description,
    url: absoluteUrl(d.path),
    image: d.image,
    geo:
      d.latitude && d.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: d.latitude,
            longitude: d.longitude,
          }
        : undefined,
    containedInPlace: d.containedIn
      ? { "@type": "Place", name: d.containedIn }
      : undefined,
  };
}

export function touristAttractionSchema(d: DestinationSchemaInput & {
  rating?: number | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: d.name,
    description: d.description,
    url: absoluteUrl(d.path),
    image: d.image,
    geo:
      d.latitude && d.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: d.latitude,
            longitude: d.longitude,
          }
        : undefined,
    aggregateRating: d.rating
      ? { "@type": "AggregateRating", ratingValue: d.rating, bestRating: 5 }
      : undefined,
  };
}

export function itemListSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}
