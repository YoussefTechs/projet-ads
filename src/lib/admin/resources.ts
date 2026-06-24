/**
 * Registre des ressources administrables (CRUD piloté par configuration).
 * Permet de gérer tout le contenu depuis le dashboard, sans toucher au code.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "slug"
  | "image"
  | "gallery"
  | "stringlist"
  | "select"
  | "boolean"
  | "belongsTo"
  | "categories"
  | "tags"
  | "faq";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Modèle Prisma source pour un champ `belongsTo`. */
  relationModel?: "continent" | "country" | "city";
  group?: "main" | "details" | "media" | "seo";
  help?: string;
  fullWidth?: boolean;
}

export interface Resource {
  key: string; // segment d'URL (ex. "countries")
  model: string; // accesseur Prisma (ex. "country")
  label: string; // pluriel
  singular: string;
  titleField: "name" | "title";
  /** Champ slug → sert à générer l'URL publique. */
  fields: Field[];
  /** Valeurs imposées à la création (ex. type=BLOG). */
  fixedValues?: Record<string, unknown>;
  /** Filtre de liste (ex. articles de type blog uniquement). */
  listFilter?: Record<string, unknown>;
  /** Le contenu de cette ressource a-t-il un statut publiable ? */
  publishable?: boolean;
}

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Brouillon" },
  { value: "PREVIEW", label: "Préversion" },
  { value: "PUBLISHED", label: "Publié" },
  { value: "UNPUBLISHED", label: "Dépublié" },
];

const PRICE_OPTIONS = [
  { value: "BUDGET", label: "€ (économique)" },
  { value: "MODERATE", label: "€€ (modéré)" },
  { value: "EXPENSIVE", label: "€€€ (cher)" },
  { value: "LUXURY", label: "€€€€ (luxe)" },
];

const ARTICLE_TYPE_OPTIONS = [
  { value: "GUIDE", label: "Guide" },
  { value: "ITINERARY", label: "Itinéraire" },
  { value: "LISTICLE", label: "Top / Liste" },
  { value: "PRACTICAL", label: "Guide pratique" },
  { value: "COMPARISON", label: "Comparatif" },
  { value: "WHEN_TO_GO", label: "Quand partir" },
];

// Champs SEO communs.
const seoFields: Field[] = [
  { name: "metaTitle", label: "Meta Title", type: "text", group: "seo", help: "Laisser vide pour générer automatiquement." },
  { name: "metaDescription", label: "Meta Description", type: "textarea", group: "seo", fullWidth: true },
  { name: "ogImage", label: "Image Open Graph (URL)", type: "image", group: "seo" },
];

const faqField: Field = {
  name: "faq",
  label: "FAQ (questions / réponses)",
  type: "faq",
  group: "details",
  fullWidth: true,
};

export const resources: Resource[] = [
  {
    key: "countries",
    model: "country",
    label: "Pays",
    singular: "Pays",
    titleField: "name",
    publishable: true,
    fields: [
      { name: "name", label: "Nom du pays", type: "text", required: true, group: "main" },
      { name: "slug", label: "Slug", type: "slug", group: "main", help: "Généré depuis le nom si vide." },
      { name: "continentId", label: "Continent", type: "belongsTo", relationModel: "continent", required: true, group: "main" },
      { name: "flagEmoji", label: "Drapeau (emoji)", type: "text", group: "details" },
      { name: "capital", label: "Capitale", type: "text", group: "details" },
      { name: "currency", label: "Monnaie", type: "text", group: "details" },
      { name: "languages", label: "Langues (une par ligne)", type: "stringlist", group: "details" },
      { name: "bestSeason", label: "Meilleure période", type: "text", group: "details" },
      { name: "avgBudgetPerDay", label: "Budget moyen / jour (€)", type: "number", group: "details" },
      { name: "safetyLevel", label: "Niveau de sécurité", type: "text", group: "details" },
      { name: "powerPlug", label: "Type de prise", type: "text", group: "details" },
      { name: "visaSummary", label: "Visa (résumé)", type: "textarea", group: "details", fullWidth: true },
      { name: "summary", label: "Description courte", type: "textarea", group: "main", fullWidth: true },
      { name: "description", label: "Description complète", type: "richtext", group: "main", fullWidth: true },
      { name: "heroImage", label: "Image principale (URL)", type: "image", group: "media" },
      { name: "gallery", label: "Galerie (une URL par ligne)", type: "gallery", group: "media", fullWidth: true },
      { name: "categories", label: "Catégories", type: "categories", group: "details", fullWidth: true },
      faqField,
      { name: "featured", label: "Mettre en avant", type: "boolean", group: "details" },
      ...seoFields,
    ],
  },
  {
    key: "cities",
    model: "city",
    label: "Villes",
    singular: "Ville",
    titleField: "name",
    publishable: true,
    fields: [
      { name: "name", label: "Nom de la ville", type: "text", required: true, group: "main" },
      { name: "slug", label: "Slug", type: "slug", group: "main" },
      { name: "countryId", label: "Pays", type: "belongsTo", relationModel: "country", required: true, group: "main" },
      { name: "bestSeason", label: "Meilleure période", type: "text", group: "details" },
      { name: "avgBudgetPerDay", label: "Budget moyen / jour (€)", type: "number", group: "details" },
      { name: "recommendedDays", label: "Durée conseillée (jours)", type: "number", group: "details" },
      { name: "summary", label: "Description courte", type: "textarea", group: "main", fullWidth: true },
      { name: "description", label: "Guide complet", type: "richtext", group: "main", fullWidth: true },
      { name: "heroImage", label: "Image principale (URL)", type: "image", group: "media" },
      { name: "gallery", label: "Galerie (une URL par ligne)", type: "gallery", group: "media", fullWidth: true },
      { name: "categories", label: "Catégories", type: "categories", group: "details", fullWidth: true },
      faqField,
      { name: "featured", label: "Mettre en avant", type: "boolean", group: "details" },
      ...seoFields,
    ],
  },
  {
    key: "activities",
    model: "activity",
    label: "Activités",
    singular: "Activité",
    titleField: "name",
    publishable: true,
    fields: [
      { name: "name", label: "Nom de l'activité", type: "text", required: true, group: "main" },
      { name: "slug", label: "Slug", type: "slug", group: "main" },
      { name: "cityId", label: "Ville", type: "belongsTo", relationModel: "city", required: true, group: "main" },
      { name: "category", label: "Catégorie (visite, excursion…)", type: "text", group: "details" },
      { name: "duration", label: "Durée", type: "text", group: "details" },
      { name: "priceInfo", label: "Tarif indicatif", type: "text", group: "details" },
      { name: "summary", label: "Description courte", type: "textarea", group: "main", fullWidth: true },
      { name: "description", label: "Description complète", type: "richtext", group: "main", fullWidth: true },
      { name: "heroImage", label: "Image principale (URL)", type: "image", group: "media" },
      { name: "gallery", label: "Galerie (une URL par ligne)", type: "gallery", group: "media", fullWidth: true },
      faqField,
      { name: "featured", label: "Mettre en avant", type: "boolean", group: "details" },
      ...seoFields,
    ],
  },
  {
    key: "hotels",
    model: "hotel",
    label: "Hôtels",
    singular: "Hôtel",
    titleField: "name",
    publishable: true,
    fields: [
      { name: "name", label: "Nom de l'hôtel", type: "text", required: true, group: "main" },
      { name: "slug", label: "Slug", type: "slug", group: "main" },
      { name: "cityId", label: "Ville", type: "belongsTo", relationModel: "city", required: true, group: "main" },
      { name: "stars", label: "Étoiles", type: "number", group: "details" },
      { name: "priceRange", label: "Gamme de prix", type: "select", options: PRICE_OPTIONS, group: "details" },
      { name: "neighborhood", label: "Quartier", type: "text", group: "details" },
      { name: "amenities", label: "Équipements (un par ligne)", type: "stringlist", group: "details", fullWidth: true },
      { name: "affiliateUrl", label: "Lien de réservation", type: "text", group: "details", fullWidth: true },
      { name: "summary", label: "Description courte", type: "textarea", group: "main", fullWidth: true },
      { name: "description", label: "Description complète", type: "richtext", group: "main", fullWidth: true },
      { name: "heroImage", label: "Image principale (URL)", type: "image", group: "media" },
      { name: "gallery", label: "Galerie (une URL par ligne)", type: "gallery", group: "media", fullWidth: true },
      faqField,
      ...seoFields,
    ],
  },
  {
    key: "restaurants",
    model: "restaurant",
    label: "Restaurants",
    singular: "Restaurant",
    titleField: "name",
    publishable: true,
    fields: [
      { name: "name", label: "Nom du restaurant", type: "text", required: true, group: "main" },
      { name: "slug", label: "Slug", type: "slug", group: "main" },
      { name: "cityId", label: "Ville", type: "belongsTo", relationModel: "city", required: true, group: "main" },
      { name: "priceRange", label: "Gamme de prix", type: "select", options: PRICE_OPTIONS, group: "details" },
      { name: "neighborhood", label: "Quartier", type: "text", group: "details" },
      { name: "cuisines", label: "Types de cuisine (un par ligne)", type: "stringlist", group: "details" },
      { name: "specialties", label: "Spécialités (une par ligne)", type: "stringlist", group: "details" },
      { name: "summary", label: "Description courte", type: "textarea", group: "main", fullWidth: true },
      { name: "description", label: "Description complète", type: "richtext", group: "main", fullWidth: true },
      { name: "heroImage", label: "Image principale (URL)", type: "image", group: "media" },
      { name: "gallery", label: "Galerie (une URL par ligne)", type: "gallery", group: "media", fullWidth: true },
      faqField,
      ...seoFields,
    ],
  },
  {
    key: "guides",
    model: "article",
    label: "Guides de voyage",
    singular: "Guide",
    titleField: "title",
    publishable: true,
    fixedValues: {},
    listFilter: { type: { not: "BLOG" } },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, group: "main" },
      { name: "slug", label: "Slug", type: "slug", group: "main" },
      { name: "type", label: "Type de guide", type: "select", options: ARTICLE_TYPE_OPTIONS, group: "main" },
      { name: "excerpt", label: "Extrait", type: "textarea", group: "main", fullWidth: true },
      { name: "content", label: "Contenu (Markdown)", type: "richtext", group: "main", fullWidth: true },
      { name: "coverImage", label: "Image de couverture (URL)", type: "image", group: "media" },
      { name: "readingTime", label: "Temps de lecture (min)", type: "number", group: "details" },
      { name: "categories", label: "Catégories", type: "categories", group: "details", fullWidth: true },
      { name: "tags", label: "Tags (séparés par des virgules)", type: "tags", group: "details", fullWidth: true },
      faqField,
      { name: "featured", label: "Mettre en avant", type: "boolean", group: "details" },
      ...seoFields,
    ],
  },
  {
    key: "blog",
    model: "article",
    label: "Articles de blog",
    singular: "Article",
    titleField: "title",
    publishable: true,
    fixedValues: { type: "BLOG" },
    listFilter: { type: "BLOG" },
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, group: "main" },
      { name: "slug", label: "Slug", type: "slug", group: "main" },
      { name: "excerpt", label: "Extrait", type: "textarea", group: "main", fullWidth: true },
      { name: "content", label: "Contenu (Markdown)", type: "richtext", group: "main", fullWidth: true },
      { name: "coverImage", label: "Image de couverture (URL)", type: "image", group: "media" },
      { name: "readingTime", label: "Temps de lecture (min)", type: "number", group: "details" },
      { name: "categories", label: "Catégories", type: "categories", group: "details", fullWidth: true },
      { name: "tags", label: "Tags (séparés par des virgules)", type: "tags", group: "details", fullWidth: true },
      faqField,
      { name: "featured", label: "Mettre en avant", type: "boolean", group: "details" },
      ...seoFields,
    ],
  },
];

export function getResource(key: string): Resource | undefined {
  return resources.find((r) => r.key === key);
}

export { STATUS_OPTIONS };
