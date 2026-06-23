# Phase 2 — Stratégie SEO opérationnelle

> **Statut : EN ATTENTE DE VALIDATION**
> Spécification SEO concrète (patterns, schémas, règles). Aucun code applicatif — les blocs JSON/exemples sont des **gabarits de spécification** destinés à la Phase 3.
> Document jumeau : **[PHASE-2-DESIGN.md](PHASE-2-DESIGN.md)**.

**Projet : `Atlas`** · **Version : 1.0** · **Date : 2026-06-23**

---

## Sommaire
1. [Principes & conventions](#1-principes--conventions)
2. [Meta Title (par type de page)](#2-meta-title-par-type-de-page)
3. [Meta Description](#3-meta-description)
4. [Open Graph](#4-open-graph)
5. [Twitter Cards](#5-twitter-cards)
6. [Canonical](#6-canonical)
7. [Robots & indexation](#7-robots--indexation)
8. [Données structurées (JSON-LD)](#8-données-structurées-json-ld)
9. [Breadcrumb](#9-breadcrumb)
10. [FAQ Schema](#10-faq-schema)
11. [Article Schema](#11-article-schema)
12. [Destination Schema](#12-destination-schema)
13. [Autres schémas (Place, Hotel, Restaurant, Review, ItemList, HowTo)](#13-autres-schémas)
14. [Maillage interne](#14-maillage-interne)
15. [Sitemap XML](#15-sitemap-xml)
16. [Robots.txt](#16-robotstxt)
17. [URLs optimisées](#17-urls-optimisées)
18. [Optimisation Core Web Vitals](#18-optimisation-core-web-vitals)
19. [Tableau récapitulatif SEO par type de page](#19-tableau-récapitulatif-seo-par-type-de-page)
20. [Mesure & pilotage](#20-mesure--pilotage)
21. [Critères de validation](#21-critères-de-validation)

---

## 1. Principes & conventions

- **Une page = une intention = une URL canonique.**
- Métas générées **dynamiquement** par gabarit (via l'API `Metadata`/`generateMetadata` de Next.js en Phase 3) à partir des données de l'entité.
- **JSON-LD** centralisé via un composant `<JsonLd>` réutilisable, un schéma adapté par type de page.
- **Cohérence** : title, H1, OG, canonical et breadcrumb racontent la même chose.
- **Garde-fous qualité** : pas de métas dupliquées, pas de pages indexables sans valeur (§7).
- Variables de gabarit notées `{ville}`, `{pays}`, `{annee}`, `{count}`, etc.
- `{annee}` = année courante injectée dynamiquement (fraîcheur des titres).

---

## 2. Meta Title (par type de page)

**Règles** : 50–60 caractères, mot-clé principal en tête, marque en suffixe (` | Atlas`), unique par page, lisible (pas de bourrage).

| Type de page | Gabarit de title | Exemple |
|---|---|---|
| Accueil | `Atlas — Guide de voyage : destinations, conseils & comparateurs` | — |
| Continent | `Voyage en {continent} : destinations & guides \| Atlas` | Voyage en Asie : destinations & guides \| Atlas |
| Pays | `Voyage en {pays} : que faire, quand partir, guide {annee} \| Atlas` | Voyage au Japon : que faire, quand partir, guide 2026 \| Atlas |
| Ville | `Que faire à {ville} ? Top lieux, conseils & guide \| Atlas` | Que faire à Tokyo ? Top lieux, conseils & guide \| Atlas |
| Lieu/Monument | `{lieu} ({ville}) : horaires, tarifs & visite \| Atlas` | Tour Eiffel (Paris) : horaires, tarifs & visite \| Atlas |
| Hôtel | `{hotel}, {ville} : avis, prix & équipements \| Atlas` | — |
| Restaurant | `{resto}, {ville} : cuisine, prix & avis \| Atlas` | — |
| Que faire (intent) | `Que faire à {ville} : {count} incontournables \| Atlas` | Que faire à Rome : 20 incontournables \| Atlas |
| Quand partir (intent) | `Quand partir à {ville} ? Meilleure période & météo \| Atlas` | Quand partir à Bali ? Meilleure période & météo \| Atlas |
| Budget (intent) | `Budget voyage {pays} : combien ça coûte ? \| Atlas` | — |
| Itinéraire | `{ville/pays} en {n} jours : itinéraire idéal \| Atlas` | Le Japon en 15 jours : itinéraire idéal \| Atlas |
| Guide | `{titre du guide} \| Atlas` | — |
| Article blog | `{titre de l'article} \| Atlas` | — |
| Catégorie | `{categorie} : nos meilleures destinations \| Atlas` | Voyage en famille : nos meilleures destinations \| Atlas |
| Comparateur | `{A} ou {B} : quelle destination choisir ? \| Atlas` | Lisbonne ou Porto : quelle destination choisir ? \| Atlas |
| Hub (destinations/guides/blog) | `Toutes nos {entités} \| Atlas` | Toutes nos destinations \| Atlas |

> **Garde-fou** : title tronqué proprement si dépassement ; jamais de title vide → fallback sur le nom de l'entité + marque.

---

## 3. Meta Description

**Règles** : 140–160 caractères, incitative (bénéfice + appel à l'action implicite), inclut le mot-clé naturellement, unique. Non utilisée comme facteur de classement direct mais **influence le CTR** (donc le SEO).

| Type | Gabarit |
|---|---|
| Pays | `Préparez votre voyage en {pays} : que faire, quand partir, budget, visa et nos {count} villes incontournables. Conseils à jour {annee}.` |
| Ville | `Découvrez {ville} : {count} lieux à visiter, où dormir, où manger, météo et conseils pratiques pour un séjour réussi.` |
| Lieu | `{lieu} à {ville} : horaires, tarifs, temps de visite, accès et conseils pour préparer votre visite.` |
| Quand partir | `Quelle est la meilleure période pour visiter {ville} ? Météo mois par mois, affluence et conseils pour bien choisir.` |
| Itinéraire | `Suivez notre itinéraire de {n} jours à {destination} : étapes, lieux à voir et conseils pratiques jour par jour.` |
| Comparateur | `{A} ou {B} ? On compare budget, météo, activités et ambiance pour vous aider à choisir votre prochaine destination.` |
| Catégorie | `Nos meilleures idées de {categorie} : destinations triées sur le volet, guides et conseils pour s'inspirer.` |

> **Garde-fou** : si pas de description éditoriale, génération depuis le chapô de l'entité (tronqué à ~155 car., sans couper un mot).

---

## 4. Open Graph

Balises `og:*` sur **toutes** les pages (partage social → trafic + signaux indirects).

| Balise | Valeur |
|---|---|
| `og:type` | `website` (hubs), `article` (guides/blog), `place`/`website` (destinations) |
| `og:title` | = meta title (sans suffixe marque si trop long) |
| `og:description` | = meta description |
| `og:url` | URL canonique absolue |
| `og:site_name` | `Atlas` |
| `og:locale` | `fr_FR` (puis `en_US`… en V2) |
| `og:image` | **1200×630**, < 200 Ko ; image éditoriale de l'entité, ou **image OG dynamique** générée (`/api/og`) avec titre + photo + marque |
| `og:image:alt` | description de l'image |
| `article:published_time` / `article:modified_time` | pour les articles/guides |
| `article:author` | URL de l'auteur |

> **OG dynamique** (`/api/og` via `@vercel/og`/Satori en Phase 3) : génère une image de partage cohérente (photo + titre + logo) pour chaque page, même sans visuel dédié.

---

## 5. Twitter Cards

| Balise | Valeur |
|---|---|
| `twitter:card` | `summary_large_image` |
| `twitter:title` | = og:title |
| `twitter:description` | = og:description |
| `twitter:image` | = og:image (1200×630) |
| `twitter:site` / `twitter:creator` | `@atlas` (à créer) / auteur |

---

## 6. Canonical

- **Chaque page** déclare une `<link rel="canonical">` **absolue** vers sa version de référence.
- **Auto-référente** par défaut (la page pointe vers elle-même, sans paramètres).
- **Filtres/tri/recherche** (`?q=`, `?sort=`, `?page=`) : canonical vers la version propre **ou** `noindex` selon utilité (résultats de recherche = `noindex`).
- **Pagination** : chaque page paginée est **auto-canonique** (Google a déprécié `rel=prev/next` comme signal, mais on garde une pagination crawlable via liens + on ne canonicalise PAS vers la page 1 — sinon les pages 2+ ne sont pas indexées).
- **Comparateurs** : ordre alphabétique forcé ; `lisbonne-vs-porto` canonique, `porto-vs-lisbonne` → **301** vers le canonique.
- **Hôte unique** : `https://www.atlas.xxx` (ou apex) — l'autre forme → 301. **HTTPS** forcé. **Sans trailing slash** (cohérence + 301 de l'autre forme).
- **i18n (V2)** : canonical par langue + `hreflang` réciproques (`fr`, `en`, … + `x-default`).

---

## 7. Robots & indexation

Directive `robots` par page (balise meta + en-tête `X-Robots-Tag` si besoin) :

| Indexable (`index, follow`) | Non indexable (`noindex, follow`) |
|---|---|
| Accueil, hubs, continents, pays, villes | `/recherche` (résultats filtrés) |
| Lieux, hôtels, restaurants | `/compte/*`, `/admin/*` |
| Guides, articles, catégories, comparateurs | `/connexion`, `/inscription`, `/mot-de-passe-oublie` |
| Pages d'intention **complètes** | Pages d'intention **incomplètes/vides** (jusqu'à enrichissement) |
| Pages légales (confiance) | Pages de tri/filtre redondantes, `?utm=*` |
| Auteurs | Panier/checkout (V3+), aperçus admin |

- **`noindex` dynamique** sur entité « brouillon » ou contenu sous un seuil de complétude (anti-thin-content).
- `max-image-preview:large`, `max-snippet:-1` sur le contenu éditorial (rich results).

---

## 8. Données structurées (JSON-LD)

Format **JSON-LD** (recommandé Google) injecté via `<script type="application/ld+json">`. Un composant `<JsonLd data={…} />` par schéma. Schémas globaux dans le layout, schémas spécifiques par page.

**Schémas globaux (layout racine)** :

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Atlas",
  "url": "https://www.atlas.xxx",
  "logo": "https://www.atlas.xxx/logo.png",
  "sameAs": ["https://twitter.com/atlas", "https://www.instagram.com/atlas"]
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Atlas",
  "url": "https://www.atlas.xxx",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.atlas.xxx/recherche?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```
*(active la « sitelinks searchbox » dans Google.)*

Le détail par type suit (§9–§13). **Règle d'or** : le JSON-LD doit refléter **exactement** le contenu visible (sinon pénalité « structured data spam »).

---

## 9. Breadcrumb

Sur **toutes** les pages profondes (UI + `BreadcrumbList`). Améliore l'affichage du fil d'Ariane dans les SERP et le maillage.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://www.atlas.xxx" },
    { "@type": "ListItem", "position": 2, "name": "Asie", "item": "https://www.atlas.xxx/asie" },
    { "@type": "ListItem", "position": 3, "name": "Japon", "item": "https://www.atlas.xxx/asie/japon" },
    { "@type": "ListItem", "position": 4, "name": "Tokyo", "item": "https://www.atlas.xxx/asie/japon/tokyo" }
  ]
}
```

---

## 10. FAQ Schema

Sur les pages avec une vraie section FAQ visible (pays, ville, intentions, guides, comparateurs). **Les questions/réponses doivent être réellement affichées.**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quelle est la meilleure période pour visiter Tokyo ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Le printemps (mars-avril) pour les cerisiers et l'automne (octobre-novembre) pour les couleurs offrent le meilleur climat."
      }
    },
    {
      "@type": "Question",
      "name": "Combien de jours pour visiter Tokyo ?",
      "acceptedAnswer": { "@type": "Answer", "text": "Comptez 3 à 4 jours pour les incontournables, 5+ pour explorer en profondeur." }
    }
  ]
}
```

---

## 11. Article Schema

Pour guides & articles de blog (`Article` / `BlogPosting`).

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Le Japon en 15 jours : itinéraire idéal",
  "description": "Notre itinéraire complet de 15 jours au Japon, étape par étape.",
  "image": ["https://www.atlas.xxx/img/japon-itineraire-1200x630.jpg"],
  "datePublished": "2026-01-12T08:00:00+01:00",
  "dateModified": "2026-06-20T10:00:00+02:00",
  "author": {
    "@type": "Person",
    "name": "Marie Dubois",
    "url": "https://www.atlas.xxx/auteurs/marie-dubois"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Atlas",
    "logo": { "@type": "ImageObject", "url": "https://www.atlas.xxx/logo.png" }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://www.atlas.xxx/guides/itineraire-japon-15-jours" }
}
```
- **E-E-A-T** : `author` lié à une vraie page auteur ; `dateModified` reflète les mises à jour (fraîcheur).

---

## 12. Destination Schema

Pays / Ville / Continent : `TouristDestination` (+ `geo`, `containedInPlace` pour la hiérarchie).

```json
{
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  "name": "Tokyo",
  "description": "Capitale du Japon, mégapole entre tradition et modernité.",
  "url": "https://www.atlas.xxx/asie/japon/tokyo",
  "image": "https://www.atlas.xxx/img/tokyo.jpg",
  "geo": { "@type": "GeoCoordinates", "latitude": 35.6762, "longitude": 139.6503 },
  "containedInPlace": { "@type": "Country", "name": "Japon" },
  "touristType": ["Culture", "Gastronomie", "Ville"],
  "includesAttraction": [
    { "@type": "TouristAttraction", "name": "Temple Senso-ji", "url": "https://www.atlas.xxx/asie/japon/tokyo/lieux/senso-ji" }
  ]
}
```
- Combiné avec `BreadcrumbList` + `FAQPage` sur la même page.

---

## 13. Autres schémas

**Lieu / Monument** → `TouristAttraction` (+ horaires/tarifs) :
```json
{
  "@context": "https://schema.org",
  "@type": "TouristAttraction",
  "name": "Tour Eiffel",
  "image": "https://www.atlas.xxx/img/tour-eiffel.jpg",
  "address": { "@type": "PostalAddress", "addressLocality": "Paris", "addressCountry": "FR" },
  "geo": { "@type": "GeoCoordinates", "latitude": 48.8584, "longitude": 2.2945 },
  "openingHours": "Mo-Su 09:30-23:45",
  "isAccessibleForFree": false,
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.7", "reviewCount": "1280" }
}
```

**Hôtel** → `LodgingBusiness` / `Hotel` (`priceRange`, `amenityFeature`, `aggregateRating`).
**Restaurant** → `Restaurant` (`servesCuisine`, `priceRange`, `aggregateRating`).
**Avis** → `Review` + `AggregateRating` (uniquement si avis réels affichés).
**Listes** (« Top 10 ») → `ItemList` (+ `ListItem` ordonnés) — favorise les carrousels SERP.
**Guides pratiques** (visa, transport) → `HowTo` (étapes) ou `FAQPage` selon le format.

> **Validation** : tester chaque type avec le *Rich Results Test* et *Schema Markup Validator* avant déploiement (Phase 4).

---

## 14. Maillage interne

Pilier du SEO de volume. **Règles automatisées** (composants qui génèrent les liens depuis les données) :

### 14.1 Liens contextuels obligatoires
- **Ville** → pays parent, continent, top lieux/hôtels/restos (enfants), pages d'intention (que faire/quand partir/budget…), 3–6 villes proches, guides liés, comparateurs (« {ville} vs … »).
- **Pays** (pilier) → toutes ses villes, pages d'intention pays (visa/budget), pays voisins, guides du cluster.
- **Lieu** → ville parente, lieux à proximité, catégorie de lieu.
- **Guide/Article** → destinations citées (liens contextuels dans le texte) + 3–6 articles/guides liés en fin.
- **Catégorie** → destinations & guides correspondants.

### 14.2 Blocs automatiques
- « À lire aussi » (articles liés), « Destinations proches », « Comparez {X} », « Continuez votre exploration ».
- **MegaMenu** & **Footer** : maillage transversal massif (continents → pays).
- **Breadcrumb** : maillage ascendant systématique.

### 14.3 Architecture en silos
- Page **pilier** (pays/thème) reçoit des liens de **tout son cluster** ; chaque page du cluster lie le pilier + ses sœurs pertinentes.
- **Profondeur ≤ 3–4 clics** depuis l'accueil pour le contenu clé.
- **Ancres descriptives** (jamais « cliquez ici ») contenant le mot-clé cible.

### 14.4 Règles d'hygiène
- Pas de lien cassé (vérif CI + monitoring) ; 404 → 301 quand pertinent.
- Pas de sur-optimisation d'ancre (variété naturelle).
- `nofollow`/`sponsored` sur liens d'affiliation (V3) ; `ugc` sur liens des commentaires.
- Liens sortants pertinents (sources officielles) en `noopener`.

---

## 15. Sitemap XML

Génération **automatique** (Next.js `sitemap.ts`) + **régénération à la publication** (ISR/webhook).

### 15.1 Architecture (sitemap index + sous-sitemaps)
Limite : 50 000 URLs / 50 Mo par fichier → segmentation par type :
```
/sitemap.xml                 (index)
 ├── /sitemaps/pages.xml      (pages statiques/hubs)
 ├── /sitemaps/countries.xml
 ├── /sitemaps/cities.xml
 ├── /sitemaps/places.xml     (paginé si > 50k : places-1.xml, places-2.xml…)
 ├── /sitemaps/hotels.xml
 ├── /sitemaps/restaurants.xml
 ├── /sitemaps/guides.xml
 ├── /sitemaps/articles.xml
 ├── /sitemaps/categories.xml
 └── /sitemaps/comparateurs.xml
```
- Chaque entrée : `<loc>` (URL absolue canonique), `<lastmod>` (date réelle de mise à jour), éventuellement `<changefreq>`/`<priority>` (indicatifs).
- **Exclus** : pages `noindex`, privées, filtrées, brouillons.
- **Images** : extension *image sitemap* possible pour les pages riches en photos.
- Soumission via **Google Search Console** + référence dans `robots.txt`.

---

## 16. Robots.txt

Généré dynamiquement (`robots.ts`). Contenu cible :

```
User-agent: *
Allow: /

# Zones privées / utilitaires
Disallow: /admin
Disallow: /compte
Disallow: /api/
Disallow: /connexion
Disallow: /inscription
Disallow: /mot-de-passe-oublie
Disallow: /recherche

# Paramètres de filtre/tracking
Disallow: /*?sort=
Disallow: /*?page=
Disallow: /*?utm_

# Sitemap
Sitemap: https://www.atlas.xxx/sitemap.xml
```
- **Ne pas** bloquer le CSS/JS (Google doit rendre la page).
- En **préproduction** : `Disallow: /` total + `noindex` (jamais indexer le staging).
- Bloquer éventuellement des bots agressifs/IA selon politique (décision business).

---

## 17. URLs optimisées

(Rappel & précisions Phase 1 §14.)
- **Slugs** : minuscules, tirets, sans accents/translittérés (`asie/japon/tokyo`), courts et descriptifs.
- **Hiérarchie géographique** dans le chemin (`/{continent}/{pays}/{ville}/…`).
- **Pas** de paramètres dans les URLs indexables ; filtres en query (`noindex`).
- **Stabilité** : table `Redirect` (301) pour tout changement de slug.
- **Mots-clés** dans le chemin, sans bourrage.
- **i18n (V2)** : préfixe de langue (`/en/asia/japan/tokyo`) + `hreflang`.

Exemples canoniques :
```
/asie/japon                         (pays, pilier)
/asie/japon/tokyo                   (ville)
/asie/japon/tokyo/que-faire         (intention)
/asie/japon/tokyo/quand-partir
/asie/japon/tokyo/lieux/senso-ji
/guides/itineraire-japon-15-jours
/comparateurs/kyoto-vs-tokyo        (ordre alpha)
/categories/voyage-en-famille
```

---

## 18. Optimisation Core Web Vitals

Objectif : **LCP < 2,5 s · INP < 200 ms · CLS < 0,1** sur > 90 % des URLs → condition du SEO et du Lighthouse > 95 (Phase 4). La **publicité** étant le principal risque, l'architecture la neutralise.

### 18.1 LCP (Largest Contentful Paint)
- **Rendu serveur** (Server Components/SSG/ISR) → HTML utile immédiat.
- **next/image** : héros en `priority`, AVIF/WebP, `sizes` exacts, dimensions fixes, `placeholder=blur`.
- **Préchargement** de la police critique + image héros ; `font-display: swap`.
- **CDN edge** + cache agressif (ISR) → TTFB minimal.
- Pas de JS bloquant avant le héros ; **script Ads chargé après le LCP**.

### 18.2 INP (Interaction to Next Paint)
- **Server Components par défaut**, JS client minimal (hydratation réduite).
- Code-splitting + imports dynamiques (carte, éditeur, lightbox) ; `next/dynamic`.
- Debounce de la recherche ; travaux lourds hors du thread principal si besoin.
- Éviter les gros bundles tiers ; auditer le coût JS (budget de perf en CI).

### 18.3 CLS (Cumulative Layout Shift)
- **Dimensions réservées** pour images, embeds, **AdSlots** (`min-height` par format) → la pub ne décale rien.
- Polices avec `size-adjust`/`swap` pour limiter le reflow ; `next/font`.
- Pas d'insertion de contenu au-dessus de l'existant après chargement (bannières, consentement non bloquant).
- Skeletons aux dimensions finales.

### 18.4 Stratégie de cache & rendu
- **SSG/ISR** pour destinations & contenu (revalidation périodique + on-demand à la publication).
- **SSR** seulement pour le dynamique (recherche, espace compte).
- Cache HTTP/CDN (`s-maxage`, `stale-while-revalidate`), Data Cache Next.
- Compression (Brotli/gzip) au niveau plateforme/CDN.

### 18.5 Monitoring
- **CrUX / PageSpeed Insights** (terrain), **Lighthouse CI** (labo) à chaque PR, **Web Vitals** envoyés à l'analytics (RUM réel). Détail en Phase 4.

---

## 19. Tableau récapitulatif SEO par type de page

| Page | Index | Schémas JSON-LD | OG type | Canonical |
|---|---|---|---|---|
| Accueil | ✅ | Organization, WebSite+SearchAction | website | auto |
| Continent | ✅ | Breadcrumb, TouristDestination, ItemList | website | auto |
| Pays (pilier) | ✅ | Breadcrumb, TouristDestination, FAQPage | website | auto |
| Ville | ✅ | Breadcrumb, TouristDestination, ItemList, FAQPage | website | auto |
| Lieu | ✅ | Breadcrumb, TouristAttraction, (Review) | website | auto |
| Hôtel | ✅ | Breadcrumb, LodgingBusiness, AggregateRating | website | auto |
| Restaurant | ✅ | Breadcrumb, Restaurant, AggregateRating | website | auto |
| Intent (que faire/quand partir) | ✅* | Breadcrumb, FAQPage, Article/HowTo, ItemList | article | auto |
| Guide / Article | ✅ | Breadcrumb, Article/BlogPosting, FAQPage | article | auto |
| Catégorie | ✅ | Breadcrumb, CollectionPage, ItemList, FAQPage | website | auto |
| Comparateur | ✅ | Breadcrumb, Article, FAQPage | article | ordre alpha |
| Hubs (destinations/guides/blog) | ✅ | Breadcrumb, CollectionPage, ItemList | website | auto |
| Recherche | ❌ noindex | — | — | — |
| Compte / Admin / Auth | ❌ noindex | — | — | — |
| Légales | ✅ | Breadcrumb | website | auto |

*\* uniquement si la page est complète (anti-thin-content).*

---

## 20. Mesure & pilotage

- **Google Search Console** : indexation, performances, Core Web Vitals, rich results, sitemaps (config Phase 4).
- **Google Analytics 4** : audience, comportement, conversions (favoris, newsletter), avec **Consent Mode v2**.
- **Suivi de positions** (outil tiers) par cluster.
- **Monitoring CWV** (RUM + CrUX) en continu.
- **Logs d'indexation** (couverture GSC) → repérer thin content / erreurs.
- **Revue éditoriale** : refresh des pages clés (dateModified) selon performance.

---

## 21. Critères de validation

À valider avant la **Phase 3** :
1. **Patterns de title/description** (§2–§3) — ton & format OK ?
2. **Choix des schémas** par page (§19) — complet ?
3. **Stratégie de canonical/pagination** (§6) — validée ?
4. **Architecture du sitemap** (§15) & **robots.txt** (§16) — OK ?
5. **Approche Core Web Vitals** (§18), notamment **pub à espace réservé + lazy** — validée ?
6. **Domaine définitif** (remplace `atlas.xxx`) — à fournir (sinon placeholder en Phase 3).

> Design (PHASE-2-DESIGN.md) + SEO (ce document) validés ⇒ démarrage **Phase 3 : développement**.
