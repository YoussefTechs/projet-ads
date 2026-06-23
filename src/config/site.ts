/**
 * Configuration globale du site Atlas.
 * Centralise l'identité, la navigation, les réseaux et la pub.
 */

export const siteConfig = {
  name: "Atlas",
  tagline: "Le monde, à portée de clic",
  description:
    "Atlas est votre guide de voyage moderne : destinations, villes, monuments, hôtels, restaurants, guides et comparateurs pour préparer chaque voyage.",
  // L'URL publique est lue depuis l'environnement (fallback en dev).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr_FR",
  lang: "fr",
  twitter: "@atlas",
  social: {
    twitter: "https://twitter.com/atlas",
    instagram: "https://www.instagram.com/atlas",
  },
  ads: {
    client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
    enabled: Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
  },
} as const;

/** Navigation principale (header). */
export const mainNav = [
  { label: "Destinations", href: "/destinations" },
  { label: "Guides", href: "/guides" },
  { label: "Catégories", href: "/categories" },
  { label: "Comparateurs", href: "/comparateurs" },
  { label: "Blog", href: "/blog" },
] as const;

/** Liens du pied de page, regroupés par colonne. */
export const footerNav = [
  {
    title: "Explorer",
    links: [
      { label: "Toutes les destinations", href: "/destinations" },
      { label: "Guides de voyage", href: "/guides" },
      { label: "Catégories", href: "/categories" },
      { label: "Comparateurs", href: "/comparateurs" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "À propos",
    links: [
      { label: "Qui sommes-nous", href: "/a-propos" },
      { label: "Nos auteurs", href: "/auteurs" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
      { label: "Cookies", href: "/cookies" },
      { label: "CGU", href: "/conditions-generales" },
      { label: "Charte éditoriale", href: "/charte-editoriale" },
    ],
  },
] as const;

/** Intentions SEO disponibles au niveau ville. */
export const CITY_INTENTS = [
  { slug: "que-faire", label: "Que faire" },
  { slug: "quand-partir", label: "Quand partir" },
  { slug: "ou-dormir", label: "Où dormir" },
  { slug: "budget", label: "Budget" },
  { slug: "transport", label: "Transport" },
] as const;

export type CityIntent = (typeof CITY_INTENTS)[number]["slug"];
