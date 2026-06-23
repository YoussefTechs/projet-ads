# Phase 2 — Design premium & expérience utilisateur

> **Statut : EN ATTENTE DE VALIDATION**
> Toujours aucun code applicatif. Ce document spécifie et **justifie** le design system et chaque page. Le développement (Phase 3) attend votre accord.
> Document jumeau : **[PHASE-2-SEO.md](PHASE-2-SEO.md)** (stratégie SEO opérationnelle).

**Projet : `Atlas`** · **Version : 1.0** · **Date : 2026-06-23**

---

## Sommaire

**Partie A — Fondations (Design System)**
1. [Philosophie & inspirations](#1-philosophie--inspirations)
2. [Principes de design](#2-principes-de-design)
3. [Couleurs](#3-couleurs)
4. [Typographie](#4-typographie)
5. [Espacements & rythme](#5-espacements--rythme)
6. [Grille & layout responsive](#6-grille--layout-responsive)
7. [Élévation, rayons, bordures](#7-élévation-rayons-bordures)
8. [Iconographie & imagerie](#8-iconographie--imagerie)
9. [Animations & transitions](#9-animations--transitions)
10. [Accessibilité (fondations)](#10-accessibilité-fondations)
11. [Bibliothèque de composants](#11-bibliothèque-de-composants)

**Partie B — Spécification page par page**
12. [Modèle de spécification](#12-modèle-de-spécification)
13. [Accueil](#13-accueil)
14. [Hub Destinations](#14-hub-destinations)
15. [Fiche Continent](#15-fiche-continent)
16. [Fiche Pays](#16-fiche-pays)
17. [Fiche Ville (page phare)](#17-fiche-ville-page-phare)
18. [Fiche Lieu / Monument](#18-fiche-lieu--monument)
19. [Fiche Hôtel & Restaurant](#19-fiche-hôtel--restaurant)
20. [Pages d'intention SEO](#20-pages-dintention-seo)
21. [Guide & Article (blog)](#21-guide--article-blog)
22. [Hub Blog & Hub Guides](#22-hub-blog--hub-guides)
23. [Page Catégorie](#23-page-catégorie)
24. [Comparateur](#24-comparateur)
25. [Recherche](#25-recherche)
26. [Authentification](#26-authentification)
27. [Espace compte](#27-espace-compte)
28. [Tableau de bord administrateur](#28-tableau-de-bord-administrateur)
29. [Pages légales & système (404/500)](#29-pages-légales--système)
30. [Header & Footer (global)](#30-header--footer-global)
31. [Emplacements publicitaires (design)](#31-emplacements-publicitaires-design)

**Partie C**
32. [Justification globale des choix](#32-justification-globale-des-choix)
33. [Critères de validation Phase 2](#33-critères-de-validation-phase-2)

---

# Partie A — Fondations (Design System)

## 1. Philosophie & inspirations

Atlas vise un design **éditorial premium et minimaliste**, où la photographie respire et où l'information est immédiatement lisible. Nous empruntons délibérément à cinq références, chacune pour une qualité précise :

| Référence | Ce qu'on en prend | Ce qu'on évite |
|---|---|---|
| **Airbnb** | Découverte par **cartes** chaleureuses, imagerie généreuse, ombres douces, ton accueillant | Surcharge de badges |
| **Booking** | **Clarté de conversion** : CTA évidents, signaux de confiance (notes, avis), densité utile | Le côté « cluttered », l'urgence agressive |
| **Apple** | **Espaces blancs** généreux, typographie soignée, héros pleine largeur, retenue | Froideur, manque de chaleur |
| **Notion** | **Calme**, lisibilité, contenu d'abord, hiérarchie typographique nette | Monotonie monochrome |
| **Linear** | **Vitesse** ressentie, micro-interactions précises, palette ⌘K, dark mode maîtrisé, dégradés subtils | Esthétique trop « SaaS/tech » |

**Synthèse Atlas** : *contenu d'abord (Notion) + respiration et typographie (Apple) + découverte par cartes chaleureuses (Airbnb) + clarté de conversion et confiance (Booking) + vitesse et finition des micro-interactions (Linear).*

**Mood** : voyage haut de gamme, lumineux, optimiste, fiable — entre le **magazine de voyage** et l'**outil rapide**.

---

## 2. Principes de design

1. **Content-first** — la photo et la réponse priment ; l'UI s'efface.
2. **Réponse en < 3 s** — l'info clé est au-dessus de la ligne de flottaison (idéal pour le persona « Marc » et les featured snippets).
3. **Cohérence par tokens** — couleurs, espacements, rayons, ombres = variables réutilisables (jamais de valeurs « en dur »).
4. **Minimalisme fonctionnel** — chaque élément justifie sa présence ; beaucoup de blanc.
5. **Hiérarchie claire** — une seule action primaire par écran ; contraste de taille/poids/couleur guide l'œil.
6. **Mobile-first** — conçu d'abord pour le pouce, puis enrichi en desktop.
7. **Accessible par défaut** — contraste, focus, clavier, sémantique (pas une option).
8. **Performance = design** — pas d'effet qui dégrade le LCP/CLS/INP ; la pub a un espace réservé.
9. **Mouvement utile** — l'animation guide ou récompense, jamais ne ralentit (respecte `prefers-reduced-motion`).

---

## 3. Couleurs

Palette **neutre dominante + une couleur de marque (Océan/Teal) + un accent chaud (Coucher de soleil/Ambre)**. Le teal nous distingue du bleu omniprésent des concurrents (Booking, Expedia) tout en évoquant mer & horizon.

### 3.1 Neutres (Slate)
| Token | Hex | Usage |
|---|---|---|
| `ink-950` | `#0A0A0B` | Texte principal, titres |
| `ink-900` | `#18181B` | Texte fort |
| `ink-700` | `#3F3F46` | Texte secondaire |
| `ink-500` | `#71717A` | Texte atténué, légendes |
| `ink-300` | `#D4D4D8` | Bordures |
| `ink-200` | `#E4E4E7` | Séparateurs |
| `ink-100` | `#F4F4F5` | Fond de section subtil |
| `ink-50` | `#FAFAFA` | Fond de page |
| `white` | `#FFFFFF` | Surfaces, cartes |

### 3.2 Marque — Océan (Teal)
| Token | Hex | Usage |
|---|---|---|
| `brand-50` | `#F0FDFA` | Fonds très clairs, survol |
| `brand-100` | `#CCFBF1` | Badges, surbrillances |
| `brand-300` | `#5EEAD4` | Accents en dark mode |
| `brand-500` | `#14B8A6` | Illustrations, graphes |
| `brand-600` | `#0D9488` | **Couleur d'action primaire** |
| `brand-700` | `#0F766E` | Survol/pressé, liens |
| `brand-900` | `#134E4A` | Texte sur fond clair de marque |

### 3.3 Accent — Coucher de soleil (Ambre) & favori (Rose)
| Token | Hex | Usage |
|---|---|---|
| `accent-400` | `#FBBF24` | Étoiles de note, surbrillances |
| `accent-500` | `#F59E0B` | Accent chaud, badges « coup de cœur » |
| `accent-600` | `#D97706` | Survol accent |
| `favorite` | `#F43F5E` | Cœur « favori » (rempli) |

### 3.4 Sémantique
| Rôle | Texte/Icône | Fond |
|---|---|---|
| Succès | `#15803D` | `#DCFCE7` |
| Avertissement | `#B45309` | `#FEF3C7` |
| Erreur | `#DC2626` | `#FEE2E2` |
| Info | `brand-700` | `brand-50` |

### 3.5 Dark mode (Linear-like)
| Token | Hex |
|---|---|
| `bg` (page) | `#0A0C0D` |
| `surface` | `#131719` |
| `elevated` | `#1B2123` |
| `border` | `rgba(255,255,255,0.08)` |
| `text` | `#E7E7EA` |
| `text-muted` | `#9CA3AF` |
| `brand` (dark) | `#2DD4BF` (brand-400, pour le contraste) |

### 3.6 Dégradés (subtils)
- **Overlay héros** : `linear-gradient(180deg, transparent 40%, rgba(10,10,11,0.65) 100%)` — lisibilité du texte sur photo.
- **Accent de marque** : `linear-gradient(135deg, brand-600, brand-500)` — rares CTA/illustrations.

### 3.7 Règles de contraste
- Texte normal ≥ **4.5:1**, texte large ≥ **3:1** (WCAG AA).
- `brand-600` sur blanc = OK pour gros texte/boutons ; pour le **texte de lien** sur fond clair, utiliser `brand-700`.
- Jamais de texte gris clair (`ink-400`) sur blanc pour du contenu lisible.

---

## 4. Typographie

Couple **serif éditorial (titres héros) + sans-serif (UI/corps)** = signature « magazine premium » tout en restant rapide (variables, self-hosted, sous-ensemblées).

### 4.1 Familles
- **Display (serif)** : **Fraunces** (variable, optical sizing) — H1 héros & titres éditoriaux. *Donne le caractère « voyage haut de gamme ».*
- **Sans (UI & corps)** : **Inter** (variable) — navigation, corps, cartes, formulaires. *Lisibilité et neutralité.*
- **Mono** : `ui-monospace` (système) — petites données (coordonnées, codes).

> **Option performance** : si un seul fichier de police est préféré, ship **Inter seul** (titres en Inter 600/700) et activer Fraunces plus tard. *Recommandation : garder Fraunces, mais uniquement pour les gros titres (peu d'octets, fort impact).*

### 4.2 Échelle typographique (base 16px)
| Token | Taille | Interligne | Usage |
|---|---|---|---|
| `display` | 60–72px | 1.05 | H1 héros (desktop) |
| `h1` | 36–48px | 1.1 | Titres de page |
| `h2` | 30px | 1.2 | Sections |
| `h3` | 24px | 1.3 | Sous-sections |
| `h4` | 20px | 1.4 | Titres de carte |
| `body-lg` | 18px | 1.7 | Chapô, corps d'article |
| `body` | 16px | 1.6 | Corps standard |
| `sm` | 14px | 1.5 | Légendes, méta |
| `xs` | 12px | 1.4 | Labels, badges |

### 4.3 Graisses & règles
- Inter : **400** (corps), **500** (UI/emphase), **600** (titres), **700** (rare).
- Fraunces : 400/500/600 avec *optical sizing* activé.
- **Mesure de lecture** : 65–75 caractères max pour le corps d'article (confort).
- Titres en `ink-950`, corps en `ink-900/700`, méta en `ink-500`.
- `font-display: swap` + **preload** des graisses critiques + subsetting latin.

---

## 5. Espacements & rythme

Base **4px**, rythme **8px**. Échelle : `2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128`.

- **Padding cartes** : 16–20px.
- **Gouttière de grille** : 16 (mobile) / 24 (tablette) / 32 (desktop).
- **Rythme vertical de section** : 40–56px (mobile) / 64–96px (desktop).
- **Espace titre↔contenu** : 12–16px ; **section↔section** : 48–96px.
- Cohérence absolue : aucune valeur hors échelle.

---

## 6. Grille & layout responsive

### 6.1 Points de rupture
| Nom | Largeur | Cible |
|---|---|---|
| `sm` | 640 | Grand mobile |
| `md` | 768 | Tablette |
| `lg` | 1024 | Petit desktop |
| `xl` | 1280 | Desktop |
| `2xl` | 1536 | Grand écran |

### 6.2 Conteneur & colonnes
- **Conteneur** : max-width **1280px**, centré, gouttières latérales 16/24/32.
- **Grille** : 12 colonnes (desktop) / 6 (tablette) / 4 (mobile).
- **Lecture article** : colonne de contenu **720px** + colonne latérale (TOC/pub) 300px sur ≥ lg.
- **Grilles de cartes** : 1 (mobile) → 2 (sm/md) → 3 (lg) → 4 (xl).

### 6.3 Densité
Aérée par défaut (Apple/Notion) ; densité « utile » seulement dans l'admin et les tableaux comparatifs (Booking).

---

## 7. Élévation, rayons, bordures

### 7.1 Rayons
`xs 4 · sm 6 · md 8 · lg 12 · xl 16 · 2xl 24 · full`.
- Cartes : **16px** (lg/xl) — douceur Airbnb.
- Boutons/inputs : **10px**. Pills/chips : `full`. Images héros : 0 (pleine largeur) ou 24 (encadrées).

### 7.2 Ombres (élévation)
| Token | Valeur | Usage |
|---|---|---|
| `xs` | `0 1px 2px rgba(0,0,0,.04)` | Bordure douce |
| `sm` | `0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)` | Carte au repos |
| `md` | `0 4px 12px rgba(0,0,0,.08)` | Dropdown, popover |
| `lg` | `0 12px 28px rgba(0,0,0,.10)` | Carte au survol, modale |
| `xl` | `0 24px 48px rgba(0,0,0,.14)` | Command palette |

- **Cartes** : repos `sm` → survol `lg` + `translateY(-4px)`.
- Dark mode : ombres remplacées par bordures lumineuses subtiles (`border` token) + léger fond `elevated`.

### 7.3 Bordures
1px `ink-200/300` ; en dark, `rgba(255,255,255,.08)`. Préférer **fond + ombre** aux bordures dures (esthétique douce).

---

## 8. Iconographie & imagerie

### 8.1 Icônes
- **Lucide** (open-source, trait 1.5–2px, cohérent, léger). Taille 16/20/24. Couleur = courante (héritée du texte). Toujours `aria-hidden` si décoratives, `aria-label` si actionnables.

### 8.2 Imagerie (cœur du produit voyage)
- **Photos plein cadre**, ratio **16:9** (héros), **4:3** (cartes), **1:1** (vignettes), **3:2** (galeries).
- **next/image** systématique : formats AVIF/WebP, `sizes` corrects, `priority` sur le héros LCP, `placeholder=blur` (`blurDataURL`).
- **Overlay dégradé** sur les héros pour la lisibilité du texte.
- `alt` descriptif obligatoire (a11y + SEO).
- Crédit photo discret en légende (droits).

---

## 9. Animations & transitions

Inspiration **Linear** : rapide, précis, jamais gratuit.

### 9.1 Durées & courbes
| Token | Durée | Usage |
|---|---|---|
| `instant` | 75ms | Pressions, états actifs |
| `fast` | 150ms | Survols, focus |
| `base` | 200ms | Transitions standard, cartes |
| `slow` | 300ms | Modales, drawers |
| `slower` | 500ms | Zoom image, héros |

- **Courbe standard** : `cubic-bezier(0.2, 0, 0, 1)` (ease-out franc, ressenti « instantané »).
- Entrée = ease-out ; sortie = ease-in.

### 9.2 Micro-interactions
- **Carte** : survol → `translateY(-4px)` + ombre `lg` (200ms) ; **image** zoom `scale(1.04)` (500ms).
- **Bouton** : survol → assombrissement 8 % ; pressé → `scale(0.98)` (75ms).
- **Lien texte** : soulignement qui s'étend de gauche à droite (150ms).
- **Favori (cœur)** : « pop » `scale(1 → 1.25 → 1)` + passage au rose (250ms, spring léger).
- **Skeletons** : shimmer doux pendant le chargement (listes, cartes).
- **⌘K / recherche** : ouverture fade + `scale(0.98 → 1)` (200ms) ; résultats en stagger léger.
- **Apparition au scroll** : fade + `translateY(8px)` (sections éditoriales), désactivé si reduced-motion.

### 9.3 Transitions de page
Transition douce (fade 150–200ms, léger slide-up 8px) via les conventions App Router. Indicateur de navigation **top-progress bar** fine (brand-600) pour la perception de vitesse.

### 9.4 Reduced motion
`@media (prefers-reduced-motion: reduce)` : suppression des translations/zoom, conservation des fondus simples. Aucune info véhiculée uniquement par le mouvement.

---

## 10. Accessibilité (fondations)

- **WCAG 2.2 AA** comme socle.
- **Focus visible** : anneau 2px `brand-600` + offset 2px sur tout élément focusable.
- **Cibles tactiles** ≥ 44×44px.
- **Navigation clavier** complète + **skip-link** « Aller au contenu ».
- **Sémantique** : landmarks (`header/nav/main/aside/footer`), un seul `h1`, ordre logique des titres.
- **ARIA** sur composants custom (combobox, dialog, tabs, accordion).
- **Contraste** conforme (§3.7) ; états (erreur, succès) non véhiculés par la couleur seule (icône + texte).
- **Mouvement** respectueux (§9.4). **Formulaires** : `label` lié, messages d'erreur explicites.

---

## 11. Bibliothèque de composants

Design system isolé (`components/ui`), réutilisable, testé, documenté. Liste des primitives & molécules :

### 11.1 Primitives
`Button` (primary/secondary/ghost/outline/danger · sm/md/lg · icône optionnelle · état loading), `IconButton`, `Link`, `Input`, `Textarea`, `Select`, `Combobox` (recherche), `Checkbox`, `Radio`, `Switch`, `Badge`/`Tag`/`Pill`, `Chip` (filtre togglable), `Avatar`, `Tooltip`, `Skeleton`, `Spinner`, `Divider`, `RatingStars`.

### 11.2 Molécules / organismes
- **Cartes** : `DestinationCard` (pays/ville), `PlaceCard`, `HotelCard`, `RestaurantCard`, `ArticleCard`, `GuideCard`, `CategoryCard`, `ComparePickCard`.
- **Navigation** : `Header`, `MegaMenu`, `MobileNav` (drawer), `Footer`, `Breadcrumb`, `Pagination`, `Tabs`, `TableOfContents`.
- **Recherche** : `SearchBar`, `CommandPalette` (⌘K), `SearchResults`, `FiltersBar`, `FiltersDrawer` (mobile), `SortMenu`, `ActiveFilters`.
- **Contenu** : `Hero`, `SectionHeader`, `Gallery`/`Lightbox`, `Map`, `InfoTile`/`StatTile`, `FactBox`, `Accordion`/`FAQ`, `AuthorBox`, `UpdatedAtBadge`, `Callout`.
- **Engagement** : `FavoriteButton`, `ShareButton`, `CommentThread`, `CommentForm`, `ReviewCard`, `NewsletterForm`, `RatingInput`.
- **Comparateur** : `ComparisonTable`, `MetricBar`, `WinnerBadge`.
- **Feedback** : `Modal`/`Dialog`, `Drawer`/`Sheet`, `Toast`, `EmptyState`, `ErrorState`, `ConsentBanner` (CMP).
- **Pub** : `AdSlot` (espace réservé, lazy — §31).
- **SEO** : `JsonLd`, `MetaTags` (helpers, non visuels).

> Chaque composant : variants typés, états (hover/focus/active/disabled/loading), responsive, accessible, documenté (props + exemple).

---

# Partie B — Spécification page par page

## 12. Modèle de spécification

Chaque page est décrite selon : **Rôle · Hiérarchie visuelle · Blocs de contenu · Composants · Boutons/CTA · Cartes · Filtres · Couleurs · Espacements · Animations/Transitions · Responsive · Accroches SEO**. Les détails SEO (métas, JSON-LD) sont dans **PHASE-2-SEO.md**.

---

## 13. Accueil

**Rôle** : inspirer + orienter rapidement (recherche, entrées par continent/catégorie). Vitrine de marque ; ce n'est PAS la principale porte d'entrée SEO (le contenu profond l'est), mais c'est la page de confiance et de navigation.

**Hiérarchie visuelle** : Héros immersif → recherche → entrées thématiques → preuves de valeur → contenu éditorial → conversion.

**Blocs de contenu (de haut en bas)**
1. **Header** transparent sur le héros (devient opaque au scroll).
2. **Héros plein écran** : grande photo (LCP), `display` H1 (« Le monde, à portée de clic »), sous-titre, **SearchBar** centrale proéminente.
3. **Continents** : rangée de `CategoryCard` rondes/imagées (Europe, Asie…).
4. **Destinations populaires** : grille de `DestinationCard` (3–4 col).
5. **Explorer par envie** : `CategoryCard` (famille, couple, budget, aventure…).
6. **Guides à la une** : `GuideCard` (carrousel).
7. **Comparateurs populaires** : `ComparePickCard` (« Lisbonne vs Porto »).
8. **Bloc confiance/E-E-A-T** : « Pourquoi Atlas » (sources vérifiées, mis à jour, sans bla-bla).
9. **Derniers articles** (blog) : `ArticleCard`.
10. **Newsletter** : `NewsletterForm` pleine largeur (fond `brand-50`).
11. **Footer** riche.

**Composants** : Hero, SearchBar, CategoryCard, DestinationCard, GuideCard, ComparePickCard, ArticleCard, NewsletterForm.
**Boutons/CTA** : primaire « Explorer les destinations » (`brand-600`) ; secondaires « Voir tous les guides », chips de catégories ; CTA newsletter.
**Cartes** : imagées, ratio 4:3, titre + méta (pays, « 12 lieux »), `FavoriteButton` au survol.
**Filtres** : aucun (page d'entrée) ; la SearchBar mène à `/recherche`.
**Couleurs** : héros sombre (overlay) + texte blanc ; corps sur `ink-50/white` ; accents `brand-600` ; newsletter `brand-50`.
**Espacements** : sections 80–96px desktop ; héros pleine hauteur (min 70vh).
**Animations** : héros fade-in léger ; cartes en stagger au scroll ; header opacity au scroll ; SearchBar focus → légère élévation.
**Responsive** : héros texte réduit ; carrousels swipe ; grilles 1–2 col.
**SEO** : `WebSite` + `SearchAction` (sitelinks searchbox), `Organization`.

---

## 14. Hub Destinations

**Rôle** : porte d'entrée de l'exploration géographique mondiale.
**Hiérarchie** : titre + intro courte → (option carte du monde) → continents → pays populaires → A→Z.
**Blocs** : SectionHeader ; **carte du monde interactive** (cliquable par continent, chargée en différé) ; grille de continents (`CategoryCard`) ; « Pays les plus consultés » (`DestinationCard`) ; index alphabétique des pays (colonnes de liens — fort maillage interne).
**Composants** : Map (lazy), CategoryCard, DestinationCard, liste A→Z, Breadcrumb.
**CTA** : entrée par continent ; recherche.
**Filtres** : tri (popularité / A→Z), filtre continent.
**Couleurs/Espacements** : neutres, sections 64–80px.
**Animations** : survol continent (zoom léger sur la carte/region) ; cartes lift.
**Responsive** : carte remplacée par liste de continents en mobile.
**SEO** : `BreadcrumbList`, `ItemList` (continents), maillage A→Z massif.

---

## 15. Fiche Continent

**Rôle** : hub du continent ; vue d'ensemble + accès aux pays.
**Hiérarchie** : Héros (photo + nom + 1 phrase) → faits clés → pays → idées de voyage → guides liés.
**Blocs** : Hero ; **InfoTiles** (nb de pays, meilleure période globale, fuseaux) ; **grille des pays** (`DestinationCard` triables) ; « Que faire en {continent} » (liens d'intention) ; guides & articles liés ; FAQ ; AdSlot in-article.
**Composants** : Hero, Breadcrumb, InfoTile, DestinationCard, FiltersBar (région/sous-zone), FAQ Accordion, ArticleCard.
**CTA** : « Explorer {pays} » ; favoris.
**Filtres** : sous-région, budget, type (plage/montagne/ville), saison.
**Couleurs** : héros overlay ; accents brand ; InfoTiles `ink-100`.
**Espacements** : 64–80px.
**Animations** : cartes lift + image zoom ; FAQ accordéon (hauteur animée).
**Responsive** : InfoTiles 2 col mobile ; grille 1–2 col.
**SEO** : `BreadcrumbList`, `ItemList`, `FAQPage`.

---

## 16. Fiche Pays

**Rôle** : hub pays — inspiration + infos pratiques + accès villes. Page pilier d'un cluster (§SEO).
**Hiérarchie** : Héros → réponse rapide (résumé) → infos pratiques → villes → que faire → quand partir/budget/visa → guides → FAQ.
**Blocs**
1. **Hero** (photo + nom + drapeau + 1 phrase + `FavoriteButton`/`ShareButton`).
2. **Barre de faits** sticky discrète : capitale · monnaie · langue · meilleure période · budget/jour.
3. **Résumé** (chapô `body-lg`) — la « réponse rapide ».
4. **InfoTiles pratiques** : visa, sécurité, prise élec., fuseau, santé.
5. **Villes principales** : grille `DestinationCard`.
6. **Que faire** : `PlaceCard` (top lieux du pays) + lien « tout voir ».
7. **Quand partir** : mini-graphe climat mensuel (composant `ClimateChart`).
8. **Budget** : InfoTiles (repas, nuit, transport).
9. **Guides liés** : `GuideCard`.
10. **FAQ** (Accordion) + **AdSlot** in-article (après §4 et §7).
11. **Maillage** : pays voisins, comparateurs (« {Pays} vs … »).
**Composants** : Hero, FactsBar (sticky), InfoTile, DestinationCard, PlaceCard, ClimateChart, GuideCard, FAQ, Breadcrumb, JsonLd.
**CTA** : « Découvrir {capitale} » ; « Comparer » ; favoris ; partage.
**Cartes** : villes (4:3, note, nb de lieux), lieux (photo, type, note).
**Filtres** : sur la grille de villes (région, taille, type).
**Couleurs** : héros overlay ; FactsBar `white`/`surface` + ombre `sm` ; accents brand ; notes en `accent-400`.
**Espacements** : sections 56–80px ; FactsBar haut 56px.
**Animations** : FactsBar apparaît au scroll (sticky) ; cartes lift ; ClimateChart barres qui montent à l'entrée ; FAQ accordéon.
**Responsive** : FactsBar devient scroll horizontal de pills ; grilles 1–2 col ; chart compact.
**SEO** : `TouristDestination`, `BreadcrumbList`, `FAQPage` ; maillage pilier→cluster.

---

## 17. Fiche Ville (page phare)

> **La page la plus importante du site** (volume de recherche + monétisation). Doit servir « Marc » (réponse immédiate) et « Léa » (exploration).

**Rôle** : hub local complet — que faire, où dormir, où manger, quand partir, transport.
**Hiérarchie** : Héros → réponse rapide + faits → navigation par ancres → sections (lieux, hôtels, restos, pratique) → guides → FAQ.

**Blocs**
1. **Hero** : photo signature (LCP), H1 « {Ville} », fil d'Ariane, `FavoriteButton`/`ShareButton`, note moyenne.
2. **Résumé rapide** (`body-lg`, 2–3 phrases) : pourquoi venir + durée conseillée.
3. **InfoTiles** : meilleure période · budget/jour · durée idéale · aéroport.
4. **Sous-nav ancrée** sticky (Tabs scrollspy) : Que faire · Où dormir · Où manger · Pratique · Carte.
5. **Que faire** : grille `PlaceCard` (top 10–12) + « tout voir » → page d'intention.
6. **Carte** interactive (`Map`, lazy) avec clusters de POI.
7. **Où dormir** : `HotelCard` (par quartier) + lien.
8. **Où manger** : `RestaurantCard` + lien.
9. **Quand partir** : `ClimateChart` + 1 paragraphe.
10. **Pratique** : transport (aéroport, métro), sécurité, conseils (`FactBox`).
11. **Guides liés** + **comparateurs** (« {Ville} vs … »).
12. **FAQ** (Accordion).
13. **Commentaires** (`CommentThread`).
14. **AdSlots** : 1 après le résumé/InfoTiles, 1 entre sections longues, 1 en sidebar desktop (sticky), 1 avant les commentaires.

**Composants** : Hero, Breadcrumb, InfoTile, Tabs(scrollspy), PlaceCard, Map, HotelCard, RestaurantCard, ClimateChart, FactBox, GuideCard, ComparePickCard, FAQ, CommentThread, AdSlot, FavoriteButton, ShareButton, JsonLd.
**Boutons/CTA** : favoris (cœur), partage, « Voir tous les lieux », « Réserver » (V3 affiliation), ancres de la sous-nav.
**Cartes** : PlaceCard (photo 4:3, type, note `accent-400`, durée de visite, favori) ; HotelCard (photo, étoiles, gamme prix, quartier, note) ; RestaurantCard (cuisine, gamme prix, note).
**Filtres** : dans les sous-sections (type de lieu, quartier, budget) via `Chip` + `FiltersDrawer` mobile.
**Couleurs** : héros overlay ; sous-nav sticky `white`/blur + ombre `sm` ; accents brand ; notes ambre.
**Espacements** : sections 48–72px ; sous-nav 48px ; cartes gap 16–24.
**Animations** : sous-nav scrollspy (indicateur glissant) ; cartes lift+zoom ; carte POI : popover au survol ; ancrage défilement *smooth* ; FAQ accordéon ; cœur « pop ».
**Responsive** : sous-nav = pills scrollables ; carte plein écran modale ; filtres en drawer ; grilles 1–2 col ; AdSlot sidebar → in-flow.
**SEO** : `TouristDestination` + `BreadcrumbList` + `FAQPage` ; `ItemList` pour les lieux ; maillage dense (pays parent, intentions, villes proches, guides, comparateurs).

---

## 18. Fiche Lieu / Monument

**Rôle** : répondre précisément (horaires, tarif, accès) + inciter à explorer la ville.
**Hiérarchie** : Héros/galerie → faits pratiques (au-dessus du pli) → description → carte/accès → conseils → à proximité.
**Blocs** : Galerie (Lightbox) ; H1 + type + note + favoris/partage ; **InfoTiles pratiques** (horaires, tarif, durée, accessibilité) très visibles ; description ; carte + comment s'y rendre ; conseils (`FactBox`) ; **lieux à proximité** (`PlaceCard`) ; FAQ ; commentaires ; AdSlot après les faits + avant commentaires.
**Composants** : Gallery/Lightbox, InfoTile, Map, FactBox, PlaceCard, FAQ, CommentThread, FavoriteButton, AdSlot.
**CTA** : « Site officiel » (outbound `rel` adéquat), favoris, partage, « Voir {Ville} ».
**Filtres** : aucun (page feuille).
**Couleurs/espacements** : galerie dominante ; InfoTiles `ink-100` ; sections 48–64px.
**Animations** : galerie (Lightbox fade+zoom, swipe) ; InfoTiles fade-in ; cartes proximité lift.
**Responsive** : galerie carrousel ; InfoTiles 2 col ; carte modale.
**SEO** : `TouristAttraction` (+ horaires/tarifs), `BreadcrumbList`, `FAQPage`.

---

## 19. Fiche Hôtel & Restaurant

**Rôle** : informer (gamme, équipements, quartier) et préparer l'affiliation (V3).
**Hiérarchie** : Galerie → nom + note + gamme prix → équipements/cuisine → emplacement (carte) → avis → similaires.
**Blocs** : Gallery ; H1 + étoiles/cuisine + `RatingStars` + gamme prix (`€–€€€€`) + quartier ; **chips équipements** (wifi, piscine…) ou **type de cuisine** ; carte + quartier ; description ; **ReviewCard** (avis) ; **similaires** à proximité ; AdSlot ; (V3) bloc « Réserver » (CTA affiliation `accent-500`).
**Composants** : Gallery, RatingStars, Chip, Map, ReviewCard, RatingInput, HotelCard/RestaurantCard (similaires), AdSlot, FavoriteButton.
**CTA** : « Voir les disponibilités » (V3, accent), favoris, partage.
**Cartes** : similaires (même type).
**Couleurs** : note ambre ; gamme prix en `ink-700` ; CTA réservation accent.
**Espacements** : 48–64px.
**Animations** : galerie ; chips hover ; CTA accent hover.
**Responsive** : galerie carrousel ; CTA réservation **sticky en bas** mobile (V3).
**SEO** : `LodgingBusiness` / `Restaurant` + `AggregateRating` + `BreadcrumbList`.

---

## 20. Pages d'intention SEO

(« Que faire à X », « Quand partir à X », « Budget X », « Itinéraire X », « Où dormir à X ».)

**Rôle** : capter une intention précise (longue/moyenne traîne) avec **réponse immédiate** puis détail. Pages à fort potentiel AdSense (contenu long, engageant).
**Hiérarchie** : H1 = la question → **réponse synthétique encadrée** (TL;DR) → table des matières → détail structuré → FAQ → maillage.
**Blocs (ex. « Quand partir »)** : Hero compact ; **AnswerBox** (« La meilleure période est… ») ; `ClimateChart` mensuel ; tableau mois par mois ; événements/saison ; conseils ; FAQ ; lieux/guides liés ; AdSlots (après l'AnswerBox, mi-contenu, avant FAQ).
**Composants** : AnswerBox (Callout brand-50), TableOfContents, ClimateChart/Table, FAQ, ArticleBody, PlaceCard, AdSlot, Breadcrumb.
**CTA** : ancres ; « Voir la fiche {Ville} » ; favoris.
**Filtres** : pour « Que faire » : chips par type d'activité.
**Couleurs** : AnswerBox `brand-50` + bordure gauche `brand-600` ; reste neutre.
**Espacements** : confort de lecture (mesure 70ch) ; sections 40–56px.
**Animations** : chart à l'entrée ; FAQ accordéon ; scroll spy TOC.
**Responsive** : tableau scrollable ; TOC repliée en haut (mobile).
**SEO** : `FAQPage` + `Article`/`HowTo` selon le type ; ciblage featured snippet via AnswerBox + structure Q/R.

---

## 21. Guide & Article (blog)

**Rôle** : contenu éditorial long-form (inspiration, expertise, E-E-A-T) ; pilier du maillage et du temps passé (AdSense).
**Hiérarchie** : Titre éditorial (Fraunces) → méta auteur/date/temps de lecture → image de couverture → chapô → corps (H2/H3) → encadrés/galeries → FAQ → auteur → liés → commentaires.

**Blocs**
1. **En-tête éditorial** : H1 `display`, sous-titre, **AuthorBox** (avatar, nom, expertise), date « Mis à jour le… » (`UpdatedAtBadge`), temps de lecture, partage.
2. **Image de couverture** (16:9, LCP, crédit).
3. **TableOfContents** sticky (sidebar desktop, repliée mobile) + **AdSlot** sticky sous la TOC.
4. **Corps** : typographie soignée (mesure 65–75ch), `Callout`/`FactBox`, images inline, citations, listes, tableaux, **GalleryGrid**.
5. **AdSlots** in-article (toutes 3–4 sections, espace réservé).
6. **FAQ** (Accordion).
7. **AuthorBox** détaillée en fin (E-E-A-T) + sources/références.
8. **Articles & destinations liés** (`ArticleCard`/`DestinationCard`).
9. **Commentaires** (`CommentThread`).

**Composants** : ArticleBody, AuthorBox, UpdatedAtBadge, TableOfContents, ShareButton, Callout, FactBox, Gallery, FAQ, ArticleCard, CommentThread, AdSlot, JsonLd.
**CTA** : partage, favoris, newsletter inline, liens internes.
**Cartes** : liés en fin d'article.
**Filtres** : aucun.
**Couleurs** : fond `white`, texte `ink-900`, liens `brand-700`, callouts `brand-50`/`accent`.
**Espacements** : rythme de lecture généreux (paragraphes 16–24px, sections 40–48px).
**Animations** : progress bar de lecture en haut ; TOC scrollspy ; images fade-in ; FAQ accordéon.
**Responsive** : TOC en haut repliable ; pleine largeur de lecture ; AdSlots in-flow.
**SEO** : `Article`/`BlogPosting` + `author` + `datePublished/Modified` + `BreadcrumbList` + `FAQPage`.

---

## 22. Hub Blog & Hub Guides

**Rôle** : lister/filtrer le contenu éditorial, fraîcheur, maillage.
**Hiérarchie** : Titre + intro → mise en avant (featured) → filtres → grille → pagination.
**Blocs** : SectionHeader ; **article/guide vedette** (grande carte) ; `FiltersBar` (catégorie, destination, type) ; grille `ArticleCard`/`GuideCard` ; **In-feed AdSlot** (tous les 6–8 items) ; `Pagination` ; newsletter.
**Composants** : ArticleCard, GuideCard, FiltersBar, Chip, Pagination, NewsletterForm, AdSlot.
**CTA** : chips de filtre, « charger plus » / pagination.
**Filtres** : catégorie, destination, type d'article, tri (récent/populaire).
**Couleurs/espacements** : neutre, grille gap 24, sections 56px.
**Animations** : cartes lift+zoom ; filtres → re-layout doux ; skeletons au chargement.
**Responsive** : grille 1–2–3 col ; filtres en drawer.
**SEO** : `ItemList` (CollectionPage) ; pagination SEO (canonical auto-référent + maillage), `noindex` si page filtrée non pertinente.

---

## 23. Page Catégorie

**Rôle** : point d'entrée thématique (« Voyage en famille ») — inspiration + maillage + AdSense.
**Hiérarchie** : Hero thématique → intro éditoriale (utile SEO) → destinations recommandées → guides liés → FAQ.
**Blocs** : Hero (photo + titre + intro) ; **paragraphe éditorial** introductif ; grille `DestinationCard` filtrables ; `GuideCard` liés ; FAQ ; AdSlots.
**Composants** : Hero, DestinationCard, GuideCard, FiltersBar, FAQ, AdSlot, Breadcrumb.
**CTA** : explorer destination ; affiner (filtres).
**Filtres** : continent, budget, saison.
**Couleurs/espacements** : héros thématique ; sections 56–72px.
**Animations** : cartes ; FAQ ; filtres.
**Responsive** : grilles 1–2 col ; filtres drawer.
**SEO** : `CollectionPage` + `ItemList` + `BreadcrumbList` + `FAQPage` ; contenu éditorial pour éviter le thin content.

---

## 24. Comparateur

**Rôle** : aider à décider (A vs B) ; très engageant (temps passé), excellent pour AdSense.
**Hiérarchie** : H1 « A vs B » → verdict rapide → tableau comparatif → analyse par critère → recommandation par profil → FAQ.
**Blocs**
1. **En-tête** : deux `ComparePickCard` côte à côte (photos A | B) + sélecteur pour changer.
2. **Verdict rapide** (`AnswerBox`) : « Choisissez A si… / B si… ».
3. **ComparisonTable** responsive (sticky header) : critères en lignes (budget, météo, ambiance, durée, sécurité, activités) ; `MetricBar`/jauges ; `WinnerBadge` par ligne.
4. **Analyse éditoriale** par critère.
5. **Recommandation par persona** (famille/budget/couple).
6. **FAQ** + maillage (fiches A et B, autres comparateurs).
7. **AdSlots** après le verdict et mi-tableau.
**Composants** : ComparePickCard, Combobox (changer la destination), AnswerBox, ComparisonTable, MetricBar, WinnerBadge, FAQ, AdSlot, JsonLd.
**CTA** : « Voir la fiche A / B » ; changer les destinations ; favoris.
**Cartes** : les deux entités comparées.
**Filtres** : sélecteurs A/B (Combobox) ; choix des critères (optionnel).
**Couleurs** : colonne A vs B différenciées subtilement (brand vs accent en accents légers) ; `WinnerBadge` succès ; jauges brand.
**Espacements** : tableau aéré ; sections 48–64px.
**Animations** : jauges qui se remplissent à l'entrée ; bascule A/B animée ; sticky header ; FAQ.
**Responsive** : tableau → format empilé par critère (A au-dessus de B) ; sélecteurs full width.
**SEO** : `Article` + `FAQPage` ; URL normalisée (ordre alpha) → canonical ; maillage vers fiches.

---

## 25. Recherche

**Rôle** : trouver vite (instantané) + explorer avec filtres.
**Deux surfaces** : (1) **CommandPalette ⌘K** globale (rapide, multi-entités, partout) ; (2) **page `/recherche`** (résultats filtrables, paginés).

**CommandPalette (⌘K)** : overlay centré, input large, résultats groupés (Destinations · Lieux · Guides · Articles) avec icône/vignette, navigation clavier (↑↓ Enter), « voir tous les résultats » → `/recherche`. Debounce ~150ms, états loading (skeleton), empty state.

**Page Recherche** : 
- **Hiérarchie** : barre de recherche en haut → filtres (sidebar desktop / drawer mobile) → résultats → pagination.
- **Blocs** : SearchBar (persistante), `FiltersBar`/`FiltersDrawer`, `ActiveFilters` (chips removables), `SortMenu`, grille de résultats mixtes (`DestinationCard`/`PlaceCard`/`ArticleCard`), `Pagination`, `EmptyState`.
- **Filtres avancés** : type (pays/ville/lieu/hôtel/resto/guide), continent, budget, saison, note min, durée, public (famille/couple…).
- **Composants** : SearchBar, Combobox, FiltersBar/Drawer, Chip, SortMenu, cartes, Pagination, Skeleton, EmptyState.
- **CTA** : appliquer/réinitialiser filtres ; carte.
- **Couleurs/espacements** : neutre, focus brand ; sidebar 280px.
- **Animations** : résultats en stagger ; filtres → transition douce ; skeletons ; chips removable (fade).
- **Responsive** : filtres en `Drawer` (bouton « Filtres (n) ») ; 1–2 col.
- **SEO** : page de résultats filtrés en **`noindex, follow`** (évite le contenu dupliqué/infini) ; URLs partageables (`?q=&type=`).

---

## 26. Authentification

(Connexion, inscription, mot de passe oublié.)
**Rôle** : créer/retrouver un compte sans friction (favoris = déclencheur).
**Hiérarchie** : carte centrée, minimaliste, sur fond doux (split-screen image en desktop).
**Blocs** : panneau gauche (image inspirante + slogan) | panneau droit (formulaire) ; **bouton OAuth Google** en premier ; séparateur « ou » ; champs email/mot de passe ; lien « mot de passe oublié » ; bascule connexion/inscription ; mention RGPD + lien légales.
**Composants** : Card, Input, Button (OAuth + primaire), Divider, Toast (erreurs), liens.
**CTA** : « Continuer avec Google » (outline), « Se connecter / S'inscrire » (primaire brand).
**Couleurs** : carte `white`, fond `ink-50`, image héros à gauche ; erreurs sémantiques.
**Espacements** : carte max 420px, padding 32 ; champs gap 16.
**Animations** : focus champs ; bouton loading (spinner) ; shake léger sur erreur ; transition connexion↔inscription (fade/slide).
**Responsive** : image masquée, formulaire plein écran.
**Accessibilité** : labels liés, messages d'erreur explicites, focus géré.
**SEO** : `noindex`.

---

## 27. Espace compte

**Rôle** : gérer favoris, itinéraires (V2), commentaires, paramètres.
**Hiérarchie** : layout avec **sidebar de navigation** (desktop) / tabs (mobile) → contenu de section.
**Blocs / sections** :
- **Favoris** : grille de cartes sauvegardées, filtrables par type, action retirer ; `EmptyState` motivant.
- **Mes itinéraires** (V2) : liste de carnets, création, partage.
- **Mes commentaires** : liste + statut (publié/en modération).
- **Paramètres** : profil (nom, avatar), email, mot de passe, préférences (langue, newsletter, thème clair/sombre), suppression de compte (RGPD).
**Composants** : SidebarNav/Tabs, cartes, Switch, Input, Button, EmptyState, ConfirmDialog.
**CTA** : retirer favori, modifier profil, supprimer compte (danger).
**Couleurs/espacements** : neutre, sidebar 240px, contenu 32 padding.
**Animations** : retrait de carte (fade+collapse) ; toggle thème transition.
**Responsive** : sidebar → tabs/drawer ; grilles 1–2 col.
**SEO** : `noindex` (espace privé).

---

## 28. Tableau de bord administrateur

**Rôle** : gérer contenu, modération, médias, SEO, utilisateurs (rôles ADMIN/EDITOR). Densité « outil » (Linear/Booking) plutôt qu'éditoriale.
**Hiérarchie** : sidebar persistante (sections) + topbar (recherche, profil) + zone de travail (tables/forms).
**Blocs / sections** :
- **Dashboard** : KPIs (pages publiées, brouillons, commentaires en attente, trafic via GA), raccourcis, activité récente (`AuditLog`).
- **Destinations / Lieux / Hôtels / Restaurants** : `DataTable` (recherche, tri, filtres, pagination, statut), CRUD via Drawer/forme, upload médias, **panneau SEO par entité** (title/description/OG/canonical/robots).
- **Contenus (guides/articles)** : éditeur riche (MDX/WYSIWYG), brouillon/planifié/publié, catégories/tags, destinations liées, prévisualisation.
- **Médias** : bibliothèque (grille), upload, alt obligatoire, recadrage.
- **Modération** : file des commentaires/avis (approuver/rejeter/spam), filtres.
- **Utilisateurs** : liste, rôles, bannissement.
- **SEO** : redirections (CRUD `Redirect`), réglages globaux, état sitemap, vérif données structurées.
- **Réglages** : identité, social, IDs Analytics/AdSense, AdSlots on/off.
**Composants** : SidebarNav, DataTable, Drawer/Form, RichEditor, MediaPicker, StatCard, Badge (statut), Toast, ConfirmDialog, SeoPanel.
**CTA** : « Nouveau », « Publier », « Enregistrer brouillon », « Approuver », « Supprimer » (danger).
**Filtres** : statut, type, date, auteur, recherche.
**Couleurs** : interface plus dense, neutre, accents brand pour actions ; statuts sémantiques (brouillon=gris, publié=succès, en attente=warning).
**Espacements** : compacts (tables denses), 8–16px.
**Animations** : Drawer slide ; sauvegarde (toast succès) ; états de table (skeleton) ; mises à jour optimistes.
**Responsive** : sidebar repliable ; tables scrollables (admin surtout desktop).
**Accessibilité** : tables sémantiques, raccourcis clavier.
**SEO** : `noindex` + accès protégé (RBAC + middleware).

---

## 29. Pages légales & système

**Légales** (mentions, confidentialité, cookies, CGU, charte) : gabarit **lecture** simple — colonne unique 720px, TOC latérale, titres clairs, « Dernière mise à jour ». Fond `white`, typographie soignée, liens brand. `noindex`? Non — **indexables** (confiance/E-E-A-T), mais sans pub.

**404** : illustration légère + message amical + **SearchBar** + liens utiles (destinations populaires, accueil). Garde le visiteur (réduit le rebond). `noindex` implicite (statut 404).

**500 / error** : message rassurant + bouton « réessayer » + retour accueil. Loggé (Sentry).

**Maintenance** : page minimale de marque.

**Consentement (CMP)** : bandeau bas non bloquant le LCP, boutons « Tout accepter / Refuser / Personnaliser », lien politique cookies — conforme RGPD/Consent Mode v2 (préalable AdSense).

---

## 30. Header & Footer (global)

**Header** : logo (gauche), **MegaMenu** « Destinations » (par continent → pays populaires), liens « Guides », « Catégories », « Comparateurs », **bouton recherche (⌘K)**, **toggle thème**, avatar/connexion (droite). Transparent sur les héros, devient `white`/blur + ombre `sm` au scroll (sticky). Mobile : burger → `Drawer` plein écran (nav + recherche).
**MegaMenu** : panneau large, colonnes par continent, vignettes de pays populaires, lien « Tout voir » — fort maillage interne.
**Footer** : 4–5 colonnes (Destinations par continent · Guides/Blog · À propos/Auteurs/Contact · Légales · Newsletter), sélecteur de langue (V2), réseaux sociaux, mention copyright. Fond `ink-950`/`surface` dark, texte clair — ancrage de maillage et de confiance.
**Animations** : MegaMenu fade+slide (150ms) ; header opacity au scroll ; drawer mobile slide.
**Accessibilité** : nav au clavier, `aria-expanded`, focus trap dans le drawer/menu.

---

## 31. Emplacements publicitaires (design)

Le composant **`AdSlot`** est conçu pour **ne jamais nuire aux Core Web Vitals** :
- **Espace réservé** : `min-height` fixe par format → **CLS = 0** (la zone existe avant le chargement de l'annonce).
- **Lazy-load** : chargement quand le slot approche du viewport (IntersectionObserver) ; script Ads chargé **après le LCP** (idle/post-interaction).
- **Intégration visuelle discrète** : libellé « Publicité » (`xs`, `ink-500`), marges cohérentes, jamais collé aux boutons/liens (pas de clic accidentel — conformité AdSense).
- **Densité maîtrisée** : 3–5 max par page longue ; aucun sur pages fines/utilitaires.
- **Emplacements** (rappel §17 Phase 1) : sous l'intro, entre sections, sidebar sticky (desktop), avant commentaires, in-feed (listes). Skeleton neutre pendant le chargement.
- **États** : si bloqueur/refus de consentement → l'espace se **collapse proprement** (pas de trou) ou affiche un contenu interne (maillage).

---

# Partie C

## 32. Justification globale des choix

- **Serif + sans** : différencie Atlas du « tout-sans-serif » des concurrents et installe une image **éditoriale premium**, sans sacrifier la performance (variables, subset, self-host).
- **Teal/Océan + ambre** : palette **distinctive** (vs bleu Booking/Expedia), chaleureuse et fiable ; neutres dominants pour le calme (Notion/Apple).
- **Cartes + imagerie généreuse** : la découverte voyage passe par l'émotion visuelle (Airbnb), tout en gardant des **signaux de confiance** (notes, « mis à jour le », auteurs) pour la conversion et l'E-E-A-T (Booking).
- **AnswerBox / réponse rapide** : sert le persona dominant (Marc), capte les featured snippets, et **augmente le temps passé** (bon pour AdSense) en proposant l'approfondissement juste après.
- **⌘K + scrollspy + micro-interactions** : sensation de **vitesse et de précision** (Linear) — perçue comme « pro ».
- **AdSlot à espace réservé + lazy** : résout la tension structurelle **pub ↔ Core Web Vitals**, condition de l'objectif Lighthouse > 95 et du SEO.
- **Dark mode** : attendu sur un produit moderne, valorisé par les nomades/lecteurs, maîtrisé via tokens.
- **Accessibilité native** : élargit l'audience, requis WCAG, et bénéfique au SEO (sémantique).

## 33. Critères de validation Phase 2

À valider avant la **Phase 3 (développement)** :
1. **Direction artistique** : couple typographique (Fraunces + Inter) et palette (Teal + Ambre) — OK ou ajustements ?
2. **Dark mode** dès le MVP — confirmé ?
3. **Pages phares** : la spec de la **Fiche Ville** (§17) correspond-elle à votre vision ?
4. **Densité publicitaire** (3–5 slots, emplacements §31) — acceptable ?
5. **⌘K** (command palette) dès le MVP — souhaité ?
6. Le **détail SEO** est dans **[PHASE-2-SEO.md](PHASE-2-SEO.md)** — à valider également.

> Une fois la Phase 2 (design + SEO) validée, je démarre la **Phase 3 : développement** selon la stack imposée.
