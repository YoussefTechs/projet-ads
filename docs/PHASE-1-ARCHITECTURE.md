# Phase 1 — Analyse & Architecture complète

> **Statut : EN ATTENTE DE VALIDATION**
> Aucune ligne de code applicatif n'est produite dans cette phase. Ce document est l'unique livrable. Le développement (Phase 3) ne commencera qu'après votre validation explicite.

**Nom de code du projet : `Atlas`** *(marque définitive à choisir — voir §1.5)*
**Auteur : Software Architect Senior**
**Date : 2026-06-23**
**Version : 1.0**

---

## Sommaire

1. [Vision & objectifs du site](#1-vision--objectifs-du-site)
2. [Personas](#2-personas)
3. [Parcours utilisateur](#3-parcours-utilisateur)
4. [Fonctionnalités indispensables (MVP)](#4-fonctionnalités-indispensables-mvp)
5. [Fonctionnalités futures](#5-fonctionnalités-futures)
6. [Arborescence complète](#6-arborescence-complète)
7. [Toutes les pages](#7-toutes-les-pages)
8. [Catégories](#8-catégories)
9. [Destinations](#9-destinations)
10. [Types d'articles](#10-types-darticles)
11. [Comparateurs](#11-comparateurs)
12. [Pages SEO](#12-pages-seo)
13. [Pages légales](#13-pages-légales)
14. [Structure des URLs](#14-structure-des-urls)
15. [Stratégie SEO](#15-stratégie-seo)
16. [Stratégie de contenu](#16-stratégie-de-contenu)
17. [Stratégie Google AdSense](#17-stratégie-google-adsense)
18. [Modèle économique](#18-modèle-économique)
19. [Plan d'évolution pluriannuel](#19-plan-dévolution-pluriannuel)
20. [Structure de la base de données](#20-structure-de-la-base-de-données)
21. [API nécessaires](#21-api-nécessaires)
22. [Structure des dossiers](#22-structure-des-dossiers)
23. [Bonnes pratiques](#23-bonnes-pratiques)
24. [Stack technique & décisions d'architecture](#24-stack-technique--décisions-darchitecture)
25. [Risques & points de vigilance](#25-risques--points-de-vigilance)
26. [Critères de validation de la Phase 1](#26-critères-de-validation-de-la-phase-1)

---

## 1. Vision & objectifs du site

### 1.1 Vision

Atlas est une **plateforme éditoriale de découverte de voyage** dont l'ambition est de devenir une référence mondiale. Le cœur du modèle repose sur trois piliers :

1. **Volume** : couvrir le monde entier (continents → pays → régions → villes → lieux), ce qui génère mécaniquement des dizaines de milliers de pages à fort potentiel de recherche.
2. **Qualité & confiance (E-E-A-T)** : chaque page apporte une vraie valeur (informations fraîches, structurées, vérifiées), condition indispensable pour ranker durablement sur Google et rester conforme aux politiques AdSense.
3. **Vitesse & expérience** : un site ultra-rapide, moderne et accessible, qui fait que le visiteur trouve l'information en moins de 3 secondes.

### 1.2 Objectifs business (SMART)

| Objectif | Indicateur | Cible An 1 | Cible An 3 |
|---|---|---|---|
| Trafic organique | Sessions/mois (Search) | 100 000 | 3 000 000+ |
| Indexation | Pages indexées (GSC) | 5 000 | 80 000+ |
| Revenu publicitaire | RPM AdSense / revenu mensuel | 2–5 € RPM | 8–15 € RPM |
| Engagement | Pages/session | ≥ 1,8 | ≥ 2,5 |
| Fidélisation | Comptes créés / favoris | 5 000 | 200 000 |
| Performance | Lighthouse (mobile) | > 90 | > 95 |
| Autorité | Domain Rating / backlinks | démarrage | autorité reconnue |

### 1.3 Objectifs techniques

- **Performance** : Core Web Vitals « Good » sur > 90 % des URLs (LCP < 2,5 s, INP < 200 ms, CLS < 0,1).
- **Scalabilité** : architecture capable d'absorber plusieurs millions de visiteurs/mois sans refonte (rendu statique + cache + CDN).
- **SEO-first** : chaque page est rendue côté serveur, indexable, avec données structurées, et générée à grande échelle (programmatic SEO).
- **Sécurité** : protection complète (XSS, CSRF, injection, rate-limiting, CSP) dès la conception.
- **Maintenabilité** : code modulaire, typé, testé, documenté.

### 1.4 Objectifs UX

- Trouver une information en **≤ 3 clics** et **≤ 3 secondes**.
- Recherche instantanée (as-you-type) accessible partout.
- Navigation géographique intuitive (continent → pays → ville → lieu).
- Design premium, minimaliste, responsive et accessible (WCAG 2.2 AA).

### 1.5 Choix de marque (à valider)

`Atlas` est un **nom de code**. Propositions de marque (à arbitrer avec disponibilité du `.com` et marque déposée) :

- **Atlas** / **AtlasGo** — universel, mémorisable, évoque la carte du monde.
- **Voyago** / **Voyagora** — sonorité voyage, internationale.
- **Wandr** / **Roamly** — moderne, court, orienté marché anglophone.
- **Globora** / **Terramundi** — connotation « monde entier ».

> ❓ **Décision attendue** : nom de marque + domaine principal + langue(s) de lancement.

---

## 2. Personas

5 personas couvrant l'essentiel du trafic. Le **persona dominant en SEO** est le « chercheur d'info rapide » qui arrive depuis Google sur une page profonde.

### Persona 1 — Léa, « la planificatrice rêveuse » (cœur de cible)
- **28 ans, urbaine, prépare 1 à 2 voyages/an.**
- Objectif : se faire une idée, comparer des destinations, organiser un itinéraire.
- Entrée : recherches « que faire à Lisbonne », « meilleure période pour le Japon ».
- Attentes : guides complets, photos inspirantes, infos pratiques fiables, favoris.
- Frein : sites lents, contenu superficiel, surcharge publicitaire.

### Persona 2 — Marc, « le chercheur d'info rapide » (volume SEO #1)
- **35 ans, arrive depuis Google, repart vite si pas satisfait.**
- Objectif : une réponse précise (« visa Thaïlande ? », « décalage horaire Bali », « Rome vs Florence »).
- Entrée : longue traîne, featured snippets, « People Also Ask ».
- Attentes : réponse immédiate au-dessus de la ligne de flottaison, page rapide.
- Frein : intro interminable, pop-ups, pub intrusive.
- **Implication produit** : réponse synthétique en haut de page + approfondissement ensuite (= bon pour SEO ET AdSense, car augmente le temps passé).

### Persona 3 — Sophie & famille, « le voyage organisé »
- **42 ans, voyage avec enfants, planifie longtemps à l'avance.**
- Objectif : destinations adaptées aux familles, hôtels, sécurité, budget.
- Attentes : filtres (famille, budget, saison), comparateurs, check-lists.
- Frein : informations contradictoires, manque de praticité.

### Persona 4 — Karim, « le backpacker / petit budget »
- **24 ans, voyage long, optimise chaque euro.**
- Objectif : destinations bon marché, bons plans, transport, auberges.
- Attentes : filtres budget, comparateurs de coût de la vie, guides « pas cher ».
- Frein : contenu orienté luxe uniquement.

### Persona 5 — Elena, « la nomade digitale »
- **31 ans, travaille en voyageant, séjours longs.**
- Objectif : villes adaptées (wifi, coût de la vie, visa long séjour, communauté).
- Attentes : fiches villes data-driven, comparateurs, infos visa/connexion.
- Frein : données obsolètes.

| Persona | Part de trafic estimée | Intention dominante | Monétisation |
|---|---|---|---|
| Marc (info rapide) | ~45 % | Informationnelle | AdSense (volume) |
| Léa (planificatrice) | ~25 % | Inspiration + planif | AdSense + affiliation |
| Sophie (famille) | ~15 % | Comparaison | Affiliation hôtels |
| Karim (budget) | ~10 % | Transactionnelle légère | Affiliation + AdSense |
| Elena (nomade) | ~5 % | Data / long séjour | Premium + affiliation |

---

## 3. Parcours utilisateur

### 3.1 Points d'entrée (réalité SEO)

⚠️ **80 % du trafic n'arrivera PAS par la home** mais par des pages profondes via Google. Chaque page est donc une **landing page autonome** : titre clair, fil d'Ariane, réponse rapide, maillage interne vers le contexte (ville → pays → continent) et le contenu connexe.

### 3.2 Parcours type — Marc (chercheur d'info rapide)

```
Google "meilleure période pour visiter Bali"
   ↓
Page "Quand partir à Bali" (réponse synthétique en haut + détail mensuel)
   ↓  (maillage interne)
"Que faire à Bali" → "Hôtels à Bali" → Fiche ville Bali
   ↓
CTA : "Ajouter Bali à mes favoris" → création de compte (soft)
```

### 3.3 Parcours type — Léa (inspiration → planification)

```
Home / page catégorie ("Voyage en couple")
   ↓
Recherche instantanée "Portugal"
   ↓
Fiche pays Portugal → villes (Lisbonne, Porto…)
   ↓
Comparateur "Lisbonne vs Porto"
   ↓
Guide "Itinéraire Portugal 7 jours" → Favoris → Compte
```

### 3.4 Parcours de conversion (compte & rétention)

- **Soft conversion** : favoris (déclencheur de création de compte « au bon moment »).
- **Newsletter** : capture e-mail (lead magnet : « Guide PDF / itinéraires »).
- **Compte** : favoris synchronisés, itinéraires sauvegardés, commentaires.
- **Rétention** : e-mails saisonniers, nouveautés de destinations suivies.

### 3.5 Diagramme de flux global

```
                         ┌──────────────┐
        Recherche Google │   Google     │  Réseaux sociaux / Direct
                ▼        └──────────────┘            ▼
        ┌───────────────────────────────────────────────────┐
        │  Page profonde (ville / guide / comparateur)       │
        │  → réponse rapide + fil d'Ariane + maillage        │
        └───────────────────────────────────────────────────┘
            ▼                ▼                 ▼
     Explorer la zone   Comparer       Lire un guide
     (pays/continent)   (comparateur)  (guide/blog)
            ▼                ▼                 ▼
        ┌───────────────────────────────────────────────────┐
        │  Engagement : Favoris / Commentaire / Newsletter   │
        └───────────────────────────────────────────────────┘
                              ▼
                     Création de compte
                              ▼
                  Tableau de bord utilisateur
```

---

## 4. Fonctionnalités indispensables (MVP)

> Le MVP doit déjà être « SEO-complet » : sans SEO solide dès le départ, l'objectif trafic est compromis.

### 4.1 Contenu & navigation
- [ ] Pages destinations hiérarchiques : **continent → pays → région → ville → lieu**.
- [ ] Fiches : **pays, villes, monuments/POI, hôtels, restaurants**.
- [ ] **Guides de voyage** (long-form) et **blog**.
- [ ] **Catégories** thématiques (famille, couple, budget, aventure…).
- [ ] **Comparateurs** (ville vs ville, pays vs pays).
- [ ] Pages SEO « intention » (que faire, quand partir, budget, où dormir…).

### 4.2 Recherche & découverte
- [ ] **Moteur de recherche instantané** (autocomplétion, multi-entités).
- [ ] **Filtres avancés** (continent, budget, saison, type, durée, public).
- [ ] **Pagination** SEO-friendly + tri.
- [ ] Recommandations « destinations similaires » (maillage interne).

### 4.3 Comptes & engagement
- [ ] **Authentification** (NextAuth : e-mail + OAuth Google).
- [ ] **Favoris** (destinations, lieux, guides).
- [ ] **Système de commentaires** (modéré, anti-spam).
- [ ] **Notes / avis** (avec modération).
- [ ] **Newsletter** (capture e-mail).

### 4.4 SEO technique (dès le MVP)
- [ ] Rendu **SSR/SSG** (Server Components, ISR).
- [ ] **Sitemap XML automatique** (+ index de sitemaps).
- [ ] **robots.txt**, **canonical**, métas dynamiques.
- [ ] **Données structurées JSON-LD** (Breadcrumb, Article, FAQ, TouristDestination, etc.).
- [ ] **Open Graph / Twitter Cards** par page.
- [ ] **Fil d'Ariane** visuel + structuré.

### 4.5 Monétisation
- [ ] Intégration **Google AdSense** (emplacements maîtrisés, sans nuire au CWV).
- [ ] Bandeau **consentement RGPD/CMP** (obligatoire pour AdSense personnalisé en UE).

### 4.6 Administration
- [ ] **Tableau de bord administrateur** : CRUD destinations/articles, modération commentaires, gestion médias, publication/brouillon, gestion SEO par page.
- [ ] Rôles : `ADMIN`, `EDITOR`, `USER`.

### 4.7 Qualité transverse
- [ ] **Responsive** mobile-first, **accessible** (WCAG 2.2 AA).
- [ ] **i18n-ready** (architecture prête au multilingue même si lancement mono-langue).
- [ ] **Performance** (images optimisées, lazy-loading, cache).

---

## 5. Fonctionnalités futures

| Vague | Fonctionnalité | Valeur |
|---|---|---|
| V2 | **Multilingue (i18n)** : FR/EN puis ES/DE/IT | ×N le trafic mondial |
| V2 | **Planificateur d'itinéraire** (drag & drop, jours, carte) | Engagement + rétention |
| V2 | **Cartes interactives** (clusters de POI) | UX + temps passé |
| V2 | **Contenu généré par IA assisté** (brouillons éditeurs, jamais publié sans relecture) | Vitesse de production |
| V3 | **Affiliation** (hôtels/vols/activités : Booking, GetYourGuide…) | Revenu × |
| V3 | **Avis utilisateurs enrichis** (photos, votes utiles) | UGC = SEO + fraîcheur |
| V3 | **Espace « Mes voyages »** (carnets, dépenses, partage) | Communauté |
| V3 | **Application mobile / PWA avancée** (offline) | Rétention |
| V4 | **Recommandations personnalisées** (ML) | Engagement |
| V4 | **Marketplace / réservation directe** | Nouveau revenu |
| V4 | **Programme contributeurs / UGC modéré** | Échelle de contenu |
| V4 | **API publique / widgets** | Backlinks & notoriété |

---

## 6. Arborescence complète

```
Accueil (/)
│
├── Destinations (/destinations)
│   ├── Continent (/{continent})                       ex: /europe
│   │   ├── Pays (/{continent}/{pays})                  ex: /europe/france
│   │   │   ├── Région (/{continent}/{pays}/{region})   ex: .../ile-de-france
│   │   │   │   └── Ville (/{continent}/{pays}/{ville})  ex: /europe/france/paris
│   │   │   │        ├── Monuments / lieux (/.../{ville}/lieux/{slug})
│   │   │   │        ├── Hôtels (/.../{ville}/hotels/{slug})
│   │   │   │        ├── Restaurants (/.../{ville}/restaurants/{slug})
│   │   │   │        └── Pages d'intention SEO (que-faire, quand-partir, budget…)
│   │   │   └── Pages d'intention pays (visa, meilleure-periode…)
│   │   └── (liste des pays du continent)
│   └── (carte + liste de tous les continents)
│
├── Guides (/guides)
│   ├── Guide thématique (/guides/{slug})               ex: /guides/itineraire-japon-15-jours
│   └── Guides par destination (maillés depuis les villes)
│
├── Blog (/blog)
│   ├── Catégorie blog (/blog/categorie/{slug})
│   └── Article (/blog/{slug})
│
├── Catégories (/categories)
│   └── Catégorie (/categories/{slug})                  ex: /categories/voyage-en-famille
│
├── Comparateurs (/comparateurs)
│   ├── Comparateur ville vs ville (/comparateurs/{villeA}-vs-{villeB})
│   ├── Comparateur pays vs pays
│   └── Comparateurs thématiques (coût de la vie, météo…)
│
├── Recherche (/recherche?q=...&filtres)
│
├── Espace utilisateur
│   ├── Connexion (/connexion)
│   ├── Inscription (/inscription)
│   ├── Mot de passe oublié (/mot-de-passe-oublie)
│   ├── Mon compte (/compte)
│   │   ├── Favoris (/compte/favoris)
│   │   ├── Mes itinéraires (/compte/itineraires)        [V2]
│   │   ├── Mes commentaires (/compte/commentaires)
│   │   └── Paramètres (/compte/parametres)
│   └── Newsletter (/newsletter)
│
├── Administration (/admin)                              [rôles ADMIN/EDITOR]
│   ├── Dashboard (/admin)
│   ├── Destinations (/admin/destinations)
│   ├── Lieux / Hôtels / Restaurants (/admin/lieux …)
│   ├── Articles & guides (/admin/contenus)
│   ├── Médias (/admin/medias)
│   ├── Commentaires / modération (/admin/moderation)
│   ├── Utilisateurs (/admin/utilisateurs)
│   ├── SEO (/admin/seo)
│   └── Réglages (/admin/reglages)
│
├── Pages éditoriales
│   ├── À propos (/a-propos)
│   ├── Contact (/contact)
│   ├── Équipe / Auteurs (/auteurs, /auteurs/{slug})     ← E-E-A-T
│   └── FAQ (/faq)
│
└── Pages légales
    ├── Mentions légales (/mentions-legales)
    ├── Politique de confidentialité (/confidentialite)
    ├── Politique cookies (/cookies)
    ├── CGU (/conditions-generales)
    └── Charte éditoriale (/charte-editoriale)            ← confiance/E-E-A-T
```

---

## 7. Toutes les pages

Liste exhaustive par type, avec rôle et statut de rendu (SSG/ISR/SSR).

### 7.1 Pages globales
| Page | URL | Rendu | Rôle |
|---|---|---|---|
| Accueil | `/` | ISR | Inspiration + recherche + entrées principales |
| Hub destinations | `/destinations` | ISR | Carte du monde + accès continents |
| Recherche | `/recherche` | SSR (dynamique) | Résultats filtrés + tri + pagination |
| Hub guides | `/guides` | ISR | Liste/Filtre des guides |
| Hub blog | `/blog` | ISR | Derniers articles |
| Hub catégories | `/categories` | SSG | Toutes les catégories |
| Hub comparateurs | `/comparateurs` | ISR | Comparateurs populaires |

### 7.2 Pages destination (programmatic SEO — le cœur du volume)
| Page | URL (exemple) | Rendu | Rôle |
|---|---|---|---|
| Fiche continent | `/europe` | ISR | Vue d'ensemble, pays, stats |
| Fiche pays | `/europe/france` | ISR | Présentation, villes, infos pratiques, visa, quand partir |
| Fiche région | `/europe/france/provence` | ISR | Villes & lieux de la région |
| Fiche ville | `/europe/france/paris` | ISR | LE hub local : que faire, hôtels, restos, météo, transport |
| Fiche monument/lieu | `/europe/france/paris/lieux/tour-eiffel` | ISR | Détail lieu (horaires, tarifs, accès, carte) |
| Fiche hôtel | `/europe/france/paris/hotels/{slug}` | ISR | Détail hébergement (note, prix indicatif, équipements) |
| Fiche restaurant | `/europe/france/paris/restaurants/{slug}` | ISR | Détail restaurant (cuisine, gamme prix) |

### 7.3 Pages d'intention SEO (générées par destination)
| Type | URL (exemple) | Intention |
|---|---|---|
| Que faire | `/europe/france/paris/que-faire` | « activités à Paris » |
| Quand partir | `/europe/france/paris/quand-partir` | « meilleure période Paris » |
| Où dormir | `/europe/france/paris/ou-dormir` | « quartiers où loger Paris » |
| Budget | `/europe/france/paris/budget` | « coût voyage Paris » |
| Itinéraire | `/europe/france/paris/itineraire-3-jours` | « Paris en 3 jours » |
| Transport | `/europe/france/paris/transport` | « se déplacer à Paris » |
| Visa/Pratique (pays) | `/europe/france/visa` | « visa France » |

### 7.4 Pages éditoriales
Guides (`/guides/{slug}`), articles blog (`/blog/{slug}`), catégories (`/categories/{slug}`), auteurs (`/auteurs/{slug}`), à propos, contact, FAQ.

### 7.5 Pages comparateurs
`/comparateurs/{a}-vs-{b}` (villes, pays), comparateurs thématiques (coût de la vie, météo, sécurité).

### 7.6 Pages compte & système
Connexion, inscription, mot de passe oublié, compte + sous-pages, newsletter, page 404, page 500, page de maintenance.

### 7.7 Pages d'administration
Dashboard, CRUD destinations/lieux/contenus, médias, modération, utilisateurs, SEO, réglages.

### 7.8 Pages légales
Mentions légales, confidentialité, cookies, CGU, charte éditoriale.

---

## 8. Catégories

Les catégories sont des **points d'entrée thématiques transverses** (forte valeur SEO « inspiration » + maillage).

### 8.1 Catégories par style de voyage
- Voyage en famille
- Voyage en couple / romantique
- Voyage entre amis
- Voyage solo
- Voyage de luxe
- Voyage petit budget / backpacking
- Voyage d'aventure
- Voyage culturel
- Voyage gastronomique
- Voyage bien-être / détente
- Voyage nature & écotourisme
- Nomadisme digital / long séjour

### 8.2 Catégories par type de destination
- Plages & îles
- Montagne & randonnée
- Villes & city-break
- Désert
- Parcs nationaux & safari
- Sites historiques & patrimoine
- Stations de ski

### 8.3 Catégories par saison / moment
- Où partir en hiver / été / printemps / automne
- Destinations de dernière minute
- Destinations soleil toute l'année
- Week-ends & courts séjours

### 8.4 Catégories par budget
- Destinations pas chères
- Bon rapport qualité-prix
- Luxe abordable

> Chaque catégorie = une page listant des destinations/guides filtrés, avec contenu éditorial introductif (utile SEO + AdSense).

---

## 9. Destinations

### 9.1 Modèle hiérarchique géographique
`Continent → Pays → Région/État → Ville → Lieu (POI/Monument/Hôtel/Restaurant)`

### 9.2 Données d'une destination (exhaustif)

**Pays** : nom, slug, continent, capitale, langue(s), monnaie, fuseau(x) horaire(s), indicatif, prise électrique, drapeau, population, superficie, meilleure période, climat, sécurité (niveau), visa (synthèse), budget moyen/jour, plats typiques, à savoir, villes principales, lieux phares, galerie, métas SEO.

**Ville** : nom, slug, pays/région, coordonnées GPS, population, présentation, quartiers, top lieux, hôtels, restaurants, météo (par mois), budget moyen, transport (aéroport, métro), durée de séjour conseillée, événements/saisonnalité, galerie, métas SEO.

**Lieu / Monument (POI)** : nom, slug, type (musée, monument, parc, plage…), ville, coordonnées, description, horaires, tarifs, durée de visite, accessibilité, site officiel, conseils, note, galerie, métas SEO.

**Hôtel** : nom, slug, ville, catégorie (étoiles/gamme), équipements, fourchette de prix, note, quartier, lien partenaire [affiliation V3], galerie, métas SEO.

**Restaurant** : nom, slug, ville, type de cuisine, gamme de prix, note, spécialités, galerie, métas SEO.

### 9.3 Couverture cible
- **An 1** : ~50 pays prioritaires, ~300 villes majeures, ~3 000 lieux.
- **An 2-3** : 195 pays, 3 000+ villes, 50 000+ lieux (programmatic + éditorial).

### 9.4 Sources de données
Mélange : saisie éditoriale + APIs (géo, météo, POI) + datasets ouverts (voir §21). **Toujours enrichi éditorialement** pour éviter le contenu « thin/dupliqué » (risque SEO & AdSense).

---

## 10. Types d'articles

| Type | Gabarit | Intention | Schema JSON-LD |
|---|---|---|---|
| **Guide destination** | Long-form structuré | Inspiration + planif | `Article` + `TouristDestination` |
| **Itinéraire** | Jour par jour | Planification | `Article` + `ItemList` |
| **Top / Liste** (« 10 plus belles plages ») | Listicle | Inspiration, snippets | `Article` + `ItemList` |
| **Guide pratique** (visa, budget, transport) | How-to | Réponse précise | `HowTo` / `FAQPage` |
| **Comparatif** | Tableau + analyse | Décision | `Article` + `Table` |
| **Quand partir** | Mensuel + climat | Saisonnier | `Article` + `FAQPage` |
| **Actualité / inspiration** (blog) | Court à moyen | Découverte | `Article`/`BlogPosting` |
| **Avis / test** | Structuré | Confiance | `Review` |
| **FAQ destination** | Q/R | Longue traîne | `FAQPage` |

### Structure éditoriale type (gabarit guide)
1. **Réponse rapide / résumé** (TL;DR) — capte Marc + featured snippet.
2. Sommaire ancré (table des matières cliquable).
3. Sections H2/H3 riches (texte + images + encadrés).
4. Encadrés pratiques (budget, durée, carte).
5. FAQ (schema `FAQPage`).
6. Maillage interne (destinations liées, guides liés).
7. Bloc auteur + date de mise à jour (E-E-A-T).
8. Commentaires.

---

## 11. Comparateurs

Les comparateurs sont d'excellents aimants SEO (intention décisionnelle « A vs B ») et engageants (temps passé → bon pour AdSense).

### 11.1 Types
- **Ville vs Ville** (`Lisbonne vs Porto`) : météo, budget, ambiance, durée, top lieux.
- **Pays vs Pays** (`Thaïlande vs Vietnam`).
- **Comparateur de coût de la vie** (nomades) : loyer, repas, transport, indice global.
- **Comparateur météo / quand partir** (multi-destinations sur une période).
- **Comparateur multi-critères** : l'utilisateur choisit 2-4 destinations et des critères.

### 11.2 Composants
- Tableau comparatif responsive (sticky header).
- Indicateurs visuels (jauges, badges, gagnant par critère).
- Données factuelles + verdict éditorial.
- Génération **programmatique** des paires populaires (pré-rendues) + génération à la demande (SSR) pour la longue traîne.

### 11.3 SEO
- URL canonique normalisée (ordre alphabétique : `lisbonne-vs-porto`, jamais l'inverse → évite le duplicate).
- Schema `Article` + `Table`, FAQ associée.

---

## 12. Pages SEO

« Pages SEO » = pages conçues pour capter une intention de recherche précise, générées à l'échelle.

### 12.1 Catégories de pages SEO
1. **Pages d'intention par destination** (§7.3) : que faire, quand partir, où dormir, budget, itinéraire, transport, visa.
2. **Pages listes** : « Les 10 plus belles villes de {pays} », « Meilleures plages d'{continent} ».
3. **Pages saisonnières** : « Où partir en {mois} », « Destinations soleil en hiver ».
4. **Pages comparateurs** (§11).
5. **Pages catégories** (§8).
6. **Pages questions (FAQ/longue traîne)** : alimentées par les « People Also Ask ».
7. **Pages hub / pilier** (topic clusters) : page pilier « Voyage au Japon » liant tous les contenus Japon.

### 12.2 Architecture en silos (topic clusters)
```
PAGE PILIER : "Voyage au Japon" (/asie/japon)
   ├── Quand partir au Japon
   ├── Visa Japon
   ├── Budget Japon
   ├── Itinéraire Japon 15 jours (guide)
   ├── Villes : Tokyo, Kyoto, Osaka… (chaque ville = sous-cluster)
   └── Comparateur Tokyo vs Kyoto
   ↳ Toutes ces pages se lient entre elles ET vers la page pilier.
```
Cela construit l'**autorité thématique** (topical authority), facteur clé de classement.

### 12.3 Garde-fous qualité (anti-pénalité)
- Pas de pages « vides » générées en masse (Google = « scaled content abuse », AdSense = « contenu sans valeur »).
- Chaque page programmatique doit avoir : données réelles + un minimum de contenu unique + utilité claire.
- Pages incomplètes → `noindex` jusqu'à enrichissement.

---

## 13. Pages légales

Obligatoires (RGPD, AdSense, confiance) :

| Page | URL | Rôle / Obligation |
|---|---|---|
| Mentions légales | `/mentions-legales` | Identité éditeur (obligation légale FR/UE) |
| Politique de confidentialité | `/confidentialite` | RGPD + **obligatoire AdSense** (collecte de données) |
| Politique cookies | `/cookies` | Détail cookies + lien CMP |
| CGU | `/conditions-generales` | Conditions d'utilisation, comptes, UGC |
| Charte éditoriale | `/charte-editoriale` | Méthodo, sources, indépendance → **E-E-A-T** |
| Gestion du consentement | (bandeau CMP) | RGPD / Consent Mode v2 Google |

> **Important AdSense** : un site sans politique de confidentialité claire et sans CMP conforme (en UE) **ne sera pas approuvé** ou sera suspendu. À traiter dès le MVP.

---

## 14. Structure des URLs

### 14.1 Principes
- **Lisibles, courtes, en minuscules, avec tirets**, sans paramètres inutiles.
- **Slugs translittérés** sans accents (`/asie/japon/tokyo`).
- **Hiérarchie géographique** reflétée dans le chemin (bon pour l'utilisateur ET le maillage).
- **Stables** (les changements d'URL cassent le SEO → prévoir redirections 301).
- **i18n par préfixe** dès la conception (`/fr/...`, `/en/...`) — au lancement, langue par défaut sans préfixe ou `/fr` selon décision §1.5.

### 14.2 Schéma d'URL
```
/                                        Accueil
/destinations                            Hub destinations
/{continent}                             ex: /europe
/{continent}/{pays}                      ex: /europe/france
/{continent}/{pays}/{region}             ex: /europe/france/provence
/{continent}/{pays}/{ville}              ex: /europe/france/paris
/{continent}/{pays}/{ville}/lieux/{slug}        Monument/POI
/{continent}/{pays}/{ville}/hotels/{slug}       Hôtel
/{continent}/{pays}/{ville}/restaurants/{slug}  Restaurant
/{continent}/{pays}/{ville}/{intention}         que-faire | quand-partir | budget | ...
/{continent}/{pays}/{intention}                 visa | quand-partir | budget (niveau pays)

/guides                                  Hub guides
/guides/{slug}                           Guide
/blog                                    Hub blog
/blog/{slug}                             Article
/blog/categorie/{slug}                   Catégorie blog
/categories                              Hub catégories
/categories/{slug}                       Catégorie thématique
/comparateurs                            Hub comparateurs
/comparateurs/{a}-vs-{b}                 Comparateur (ordre normalisé)

/recherche?q=...                         Recherche (noindex sur résultats filtrés)
/auteurs/{slug}                          Auteur (E-E-A-T)
/connexion /inscription /compte/...      Espace utilisateur (noindex)
/admin/...                               Admin (noindex + protégé)
/mentions-legales ...                    Pages légales
```

### 14.3 Règles de canonisation
- Une entité = **une URL canonique** unique.
- Filtres/tri/pagination → `canonical` vers la page de base ou auto-référent + `rel=prev/next` logique ; pages filtrées non pertinentes en `noindex`.
- Trailing slash : choix unique (sans slash) + redirection 301 de l'autre forme.
- `www` vs non-`www` : un seul host canonique (301).
- Comparateurs : ordre alphabétique forcé (redirection 301 si inversé).

### 14.4 Débat d'architecture URL (à valider)
**Option A (retenue) — chemin géographique complet** : `/europe/france/paris`.
- ➕ Hiérarchie claire, maillage naturel, lisibilité, fil d'Ariane évident.
- ➖ URLs plus longues, risque de collision de slugs (gérée par unicité par parent).

**Option B — chemin court** : `/destinations/paris`.
- ➕ URLs courtes.
- ➖ Perte de hiérarchie, ambiguïté (plusieurs « Paris »), maillage moins naturel.

> ❓ **Décision attendue** : confirmer **Option A** (recommandée pour ce projet).

---

## 15. Stratégie SEO

### 15.1 Piliers
1. **SEO technique irréprochable** (rapidité, indexabilité, données structurées).
2. **Programmatic SEO** (volume massif de pages utiles).
3. **Topical authority** (silos/clusters thématiques).
4. **E-E-A-T** (auteurs, sources, fraîcheur, charte).
5. **Maillage interne** dense et logique.
6. **Netlinking** (acquisition de backlinks de qualité — hors-site).

### 15.2 SEO technique (check-list)
- Rendu serveur (Server Components / SSG / ISR) → HTML complet pour les bots.
- **Métas dynamiques** par page : `title`, `description`, `canonical`, `robots`.
- **Open Graph** + **Twitter Cards** par page.
- **JSON-LD** : `Organization`, `WebSite` (+ `SearchAction` sitelinks searchbox), `BreadcrumbList`, `Article`/`BlogPosting`, `FAQPage`, `TouristDestination`, `TouristAttraction`, `LodgingBusiness` (hôtels), `Restaurant`, `Review`/`AggregateRating`, `ItemList`, `HowTo`.
- **Sitemap XML** automatique segmenté (sitemap index + sous-sitemaps par type/zone, < 50 000 URLs chacun) + `lastmod`.
- **robots.txt** propre (autorise le contenu, bloque `/admin`, `/compte`, `/recherche` filtrée, `/api`).
- **Fil d'Ariane** (UI + `BreadcrumbList`).
- **Pagination SEO** maîtrisée.
- **hreflang** (préparé pour i18n).
- **Core Web Vitals** (voir Phase 2/4) : LCP, INP, CLS optimisés.
- **Indexation pilotée** : `noindex` sur pages utilitaires, faibles ou en construction.
- Gestion **404/410** et **redirections 301** centralisée.

### 15.3 Stratégie de mots-clés
- **Tête** : « voyage Japon », « que faire à Rome » (forte concurrence, pages piliers).
- **Moyenne traîne** : « quand partir à Bali », « budget voyage Thaïlande ».
- **Longue traîne** (volume cumulé énorme, conversion AdSense) : « prise électrique au Portugal », « décalage horaire Mexique ».
- **Saisonnier** : « où partir en février ».
- Recherche par **clusters** : un cluster = une destination ou un thème.

### 15.4 Maillage interne (règles)
- Chaque page ville lie : pays parent, continent, lieux/hôtels/restos enfants, pages d'intention, villes proches, guides liés.
- Chaque guide lie : destinations citées + guides connexes.
- Blocs automatiques « À lire aussi », « Destinations proches », « Comparez ».
- Pages piliers reçoivent des liens de tout leur cluster.
- Profondeur ≤ 3-4 clics depuis la home pour le contenu clé.

### 15.5 Mesure
Google Search Console, Google Analytics 4, suivi positions (outil tiers), monitoring CWV (CrUX/PageSpeed), logs d'indexation.

> Détail complet (métas, schemas par page, OG, etc.) → **Phase 2**.

---

## 16. Stratégie de contenu

### 16.1 Principes
- **Qualité > quantité brute**, mais à grande **échelle maîtrisée**.
- Chaque page répond à **une intention** précise.
- **Fraîcheur** : date de mise à jour visible, refresh régulier (signal SEO).
- **Originalité** : pas de copie d'autres sites ; data + angle éditorial propres.
- **E-E-A-T** : auteurs identifiés, sources citées, expérience réelle valorisée.

### 16.2 Pipeline de production
```
Recherche mots-clés → Brief SEO (intention, plan, schema)
   → Rédaction (humain, IA en assistance brouillon)
   → Relecture & fact-check → Médias optimisés → Maillage
   → Publication → Indexation (GSC) → Suivi → Refresh
```

### 16.3 Mix de contenu (calendrier)
- **Évergreen** (80 %) : fiches destinations, guides pratiques (trafic stable).
- **Saisonnier** (15 %) : « où partir en {saison} », événements.
- **Actualité/inspiration** (5 %) : blog (fraîcheur, partages sociaux).

### 16.4 Échelle
- Combinaison **éditorial premium** (pages piliers, guides) + **programmatique enrichi** (pages d'intention par destination, comparateurs).
- Garde-fous anti-thin-content (§12.3).

### 16.5 UGC (V3)
Commentaires, avis, photos → fraîcheur + longue traîne, mais **modération stricte** (qualité + AdSense + sécurité).

---

## 17. Stratégie Google AdSense

> Objectif : maximiser le revenu **sans dégrader l'UX, les Core Web Vitals, ni violer les politiques** (sous peine de suspension).

### 17.1 Pré-requis d'approbation
- Contenu original, suffisant et de qualité (ne pas candidater avec un site quasi vide).
- Pages légales complètes (§13) + **CMP/consentement** conforme (UE).
- Navigation claire, site fonctionnel, trafic réel.

### 17.2 Emplacements publicitaires (manuel, maîtrisé)
| Emplacement | Format | Remarque |
|---|---|---|
| Sous le titre / après l'intro | In-article responsive | Bonne visibilité sans gêner |
| Entre sections de contenu long | In-article (1 toutes 3-4 sections) | Densité raisonnable |
| Barre latérale (desktop) | Display 300×600 sticky | Fort RPM desktop |
| Fin d'article | Display responsive | Avant commentaires |
| In-feed (listes/blog) | In-feed natif | S'intègre aux cartes |
| (Optionnel) Ancre mobile | Anchor | Avec parcimonie, non intrusif |

❌ **Interdits** : pub déguisée en contenu/navigation, près des boutons (clics accidentels), pop-ups intrusifs, densité excessive, pub sur pages sans contenu.

### 17.3 Performance & AdSense (point critique)
La publicité est l'**ennemi #1 des Core Web Vitals**. Mesures d'architecture :
- **Réserver l'espace** de chaque slot (dimensions fixes / `min-height`) → évite le **CLS**.
- **Lazy-load** des annonces hors écran (chargement à l'approche du viewport).
- **Charger le SDK Ads après** le contenu critique (post-LCP), idéalement après interaction/idle.
- **Limiter le nombre** d'annonces par page (3-5 max selon longueur).
- Préférer **emplacements manuels** vs Auto Ads pour garder le contrôle du CLS (Auto Ads possible plus tard, testé).

### 17.4 Consentement (RGPD / Consent Mode v2)
- CMP certifiée IAB TCF (ex. via Google Funding Choices ou solution tierce).
- Google **Consent Mode v2** : pas de pub personnalisée sans consentement en UE.
- Pub non-personnalisée en repli si refus.

### 17.5 Optimisation du revenu (sans nuire)
- A/B test des emplacements (RPM vs CWV vs taux de rebond).
- Contenu **long & engageant** = plus d'impressions par session.
- Cibler des **niches à fort CPC** (assurance voyage, vols, location voiture, cartes bancaires voyage) via contenu dédié.
- Suivi RPM par type de page → prioriser la production sur les pages rentables.

### 17.6 Diversification (anti-dépendance)
AdSense seul = risque (suspension, variation CPC). Voir §18 : ajouter affiliation, premium, etc.

---

## 18. Modèle économique

### 18.1 Sources de revenus (par phase)
| Source | Phase | Description | Potentiel |
|---|---|---|---|
| **Google AdSense** | MVP | Display contextuel | ⭐⭐⭐ (volume) |
| **Affiliation** | V3 | Booking, GetYourGuide, assurances, eSIM, location voiture | ⭐⭐⭐⭐ (RPM élevé) |
| **Régie directe / sponsoring** | V3+ | Offices de tourisme, marques | ⭐⭐⭐ |
| **Abonnement Premium** | V3 | Sans pub, guides PDF, planificateur avancé, hors-ligne | ⭐⭐ |
| **Produits numériques** | V3 | Guides PDF, itinéraires payants | ⭐⭐ |
| **API / data / widgets** | V4 | Licence de données voyage | ⭐⭐ |

### 18.2 Logique économique
- **Trafic SEO massif** → impressions AdSense → revenu de base.
- **Intentions transactionnelles** (hôtels, activités, assurance) → **affiliation** (RPM bien supérieur à l'AdSense).
- **Premium** monétise les utilisateurs fidèles tout en améliorant leur UX (sans pub).
- Diversification = résilience face aux changements d'algorithme / politiques AdSense.

### 18.3 Structure de coûts (ordre de grandeur)
- Hébergement/CDN (scalable, coût croissant avec le trafic), base de données managée, stockage/optimisation images, APIs tierces (météo, géo), outils SEO, **production de contenu** (poste #1), CMP.

### 18.4 Unit economics (cible)
- Optimiser **RPM global** (AdSense + affiliation) et **coût par page produite**.
- Seuil de rentabilité visé : autour de l'An 2 (selon rythme de contenu et trafic).

---

## 19. Plan d'évolution pluriannuel

### Phase 0 — Fondations (M0-M2)
Architecture (cette phase), design (Phase 2), socle technique (Phase 3), SEO technique, CI/CD, sécurité.

### An 1 — Lancement & traction SEO
- MVP en production (Phase 4) : destinations prioritaires, guides, comparateurs, recherche, comptes, AdSense.
- Production de contenu intensive (clusters prioritaires).
- GSC/GA4, suivi CWV, premières optimisations.
- **Cible : 100 k sessions/mois, AdSense actif.**

### An 2 — Échelle & monétisation
- Multilingue (FR/EN puis +), planificateur d'itinéraire, cartes interactives.
- Affiliation, contenu programmatique enrichi à grande échelle.
- Netlinking, autorité thématique consolidée.
- **Cible : 500 k–1 M sessions/mois, diversification du revenu.**

### An 3 — Référence & communauté
- UGC modéré (avis/photos), « Mes voyages », PWA avancée.
- Premium, régie directe, optimisation RPM.
- **Cible : 3 M+ sessions/mois, rentabilité.**

### An 4-5 — Plateforme
- Personnalisation ML, réservation/marketplace, API publique, app mobile native éventuelle, expansion linguistique massive.
- **Cible : référence mondiale, revenus diversifiés et résilients.**

```
M0 ───────► An1 ───────► An2 ───────► An3 ───────► An5
Socle      Trafic       Échelle      Communauté    Plateforme
+ SEO      + AdSense    + Affiliation + Premium     + ML/API
```

---

## 20. Structure de la base de données

> Modèle relationnel (PostgreSQL via Prisma). Présenté ici en **modèle conceptuel** ; le schéma Prisma exact sera produit en Phase 3.

### 20.1 Vue d'ensemble des domaines
1. **Géo & destinations** : Continent, Country, Region, City, Place (POI), Hotel, Restaurant.
2. **Contenu** : Article (guide/blog/intention), ArticleType, Category, Tag, Media.
3. **Utilisateurs & auth** : User, Account, Session, VerificationToken (NextAuth), Role.
4. **Engagement** : Favorite, Comment, Review, NewsletterSubscriber.
5. **SEO & système** : SeoMeta (embarqué/partagé), Redirect, AdSlot, Setting, AuditLog.
6. **Comparateurs** : Comparison (souvent dérivé, possible cache).

### 20.2 Entités principales (champs clés)

**Continent** : `id, name, slug, summary, heroImageId, latitude, longitude, seo*`.

**Country** : `id, name, slug, continentId(FK), capital, languages[], currency, timezones[], population, area, callingCode, powerPlug, flagImageId, bestSeason, climate, safetyLevel, visaSummary, avgBudgetPerDay, description(rich), heroImageId, status(DRAFT/PUBLISHED), publishedAt, updatedAt, seo*`. Unicité `slug`.

**Region** : `id, name, slug, countryId(FK), description, seo*`. Unicité `(countryId, slug)`.

**City** : `id, name, slug, countryId(FK), regionId(FK?), latitude, longitude, population, description(rich), bestSeason, avgBudgetPerDay, recommendedStayDays, heroImageId, status, publishedAt, updatedAt, seo*`. Unicité `(countryId, slug)`. Index géo + texte.

**Place (POI/Monument)** : `id, name, slug, cityId(FK), type(MONUMENT/MUSEUM/PARK/BEACH/...), latitude, longitude, description, openingHours(json), priceInfo, visitDuration, accessibility, officialUrl, rating, status, seo*`. Unicité `(cityId, slug)`.

**Hotel** : `id, name, slug, cityId(FK), stars, priceRange, amenities[], rating, neighborhood, affiliateUrl?, description, status, seo*`.

**Restaurant** : `id, name, slug, cityId(FK), cuisineType[], priceRange, rating, specialties[], description, status, seo*`.

**Article** : `id, title, slug, typeId(FK ArticleType), excerpt, content(rich/MDX), authorId(FK User), coverImageId, status, publishedAt, updatedAt, readingTime, featured, seo*`. Relations N-N : `categories`, `tags`, `relatedDestinations` (Country/City/Place via tables de liaison). Unicité `slug` (par type/section selon URL).

**ArticleType** : `id, name, slug` (guide, itinéraire, top-liste, pratique, comparatif, blog, quand-partir, faq).

**Category** : `id, name, slug, description, parentId(FK?), seo*`.

**Tag** : `id, name, slug`.

**Media** : `id, url, width, height, alt, caption, blurDataURL, credit, mimeType, createdAt`. (CDN/stockage objet ; `alt` obligatoire pour accessibilité & SEO.)

**User** : `id, name, email(unique), emailVerified, image, passwordHash?, role(USER/EDITOR/ADMIN), createdAt`.

**Account / Session / VerificationToken** : schéma standard **NextAuth** (OAuth + sessions).

**Author profile** (peut être porté par User ou table dédiée) : `bio, expertise, socialLinks, slug` → page `/auteurs/{slug}` (E-E-A-T).

**Favorite** : `id, userId(FK), entityType, entityId, createdAt`. Unicité `(userId, entityType, entityId)`. (Relation polymorphe gérée applicativement.)

**Comment** : `id, userId(FK), entityType, entityId, parentId(FK? threading), body, status(PENDING/APPROVED/SPAM/REJECTED), createdAt`. Index sur `(entityType, entityId, status)`.

**Review** : `id, userId(FK), entityType, entityId, rating(1-5), title, body, status, createdAt`. + `AggregateRating` calculé.

**NewsletterSubscriber** : `id, email(unique), status, locale, confirmedAt, createdAt`.

**Redirect** : `id, fromPath(unique), toPath, statusCode(301/302), createdAt` → gestion SEO des changements d'URL.

**AdSlot** : `id, key, page/zone, format, enabled` → configuration centralisée des emplacements pub.

**Setting** : `id, key(unique), value(json)` → réglages globaux (SEO par défaut, social, analytics IDs).

**AuditLog** : `id, userId, action, entityType, entityId, meta(json), createdAt` → traçabilité admin/sécurité.

> `seo*` = jeu de champs SEO embarqués sur chaque entité indexable : `metaTitle, metaDescription, ogImageId, canonicalOverride?, robotsOverride?`.

### 20.3 Relations clés (résumé)
```
Continent 1───* Country 1───* Region 1───* City 1───* Place
                                   │            ├──* Hotel
                                   │            └──* Restaurant
User 1───* Article *───* Category
User 1───* Comment / Review / Favorite
Article *───* Tag
Article *───* (Country|City|Place)        (destinations liées / maillage)
```

### 20.4 Indexation & performance DB
- Index sur tous les `slug` et clés étrangères.
- Index composites pour listes filtrées (ex. `City(countryId, status)`).
- Index texte (recherche) — Postgres `GIN`/`pg_trgm` ou moteur dédié (voir §21.4).
- `status`/`publishedAt` pour ne servir que le contenu publié.
- Pagination par **curseur** sur les grandes listes.

### 20.5 Choix de modélisation à valider
- **Polymorphisme** (Favorite/Comment/Review) : `entityType+entityId` (souple) vs tables dédiées par entité (intégrité FK forte). → Recommandation : `entityType+entityId` + validation applicative.
- **Place vs Hotel vs Restaurant** : tables séparées (clarté des champs) — recommandé — vs table unique `Place` polymorphe.
- **Contenu riche** : MDX/rich-text stocké (flexibilité éditoriale) + champs structurés.

> ❓ **Décisions attendues** : confirmer ces choix de modélisation.

---

## 21. API nécessaires

### 21.1 API internes (Next.js Route Handlers / Server Actions)
| Domaine | Endpoints (ex.) | Usage |
|---|---|---|
| Recherche | `GET /api/search?q=` | Autocomplétion + résultats |
| Favoris | `POST/DELETE /api/favorites` | Ajout/suppression (auth) |
| Commentaires | `GET/POST /api/comments` | Lecture/écriture modérée |
| Avis | `GET/POST /api/reviews` | Notes |
| Newsletter | `POST /api/newsletter` | Inscription (double opt-in) |
| Contact | `POST /api/contact` | Formulaire (anti-spam) |
| Admin (CRUD) | `/api/admin/*` | Gestion contenu (protégé RBAC) |
| Sitemap | `/sitemap.xml`, `/sitemap-*.xml` | Génération dynamique |
| Robots | `/robots.txt` | Règles d'indexation |
| Revalidation | `POST /api/revalidate` | ISR on-demand (webhook éditorial) |
| OG images | `/api/og` | Images Open Graph dynamiques |
| Health | `/api/health` | Monitoring |

> Privilégier **Server Components + Server Actions** pour les mutations (moins d'API publiques exposées = surface d'attaque réduite). Les API publiques restent pour le client interactif (recherche, favoris).

### 21.2 API externes (intégrations)
| Service | Usage | Phase |
|---|---|---|
| **NextAuth providers** (Google OAuth…) | Authentification | MVP |
| **Cartographie** (Mapbox / Leaflet+OSM / Google Maps) | Cartes, géocodage | MVP/V2 |
| **Météo** (Open-Meteo gratuit / OpenWeather) | Climat, « quand partir » | MVP/V2 |
| **Données géo/POI** (OpenStreetMap, GeoNames, Wikidata/Wikivoyage) | Enrichissement destinations | MVP→ |
| **Devises** (exchange rate API) | Budgets, conversion | V2 |
| **E-mail transactionnel** (Resend / SendGrid / SES) | Auth, newsletter, contact | MVP |
| **CMP / consentement** (Funding Choices / tiers) | RGPD AdSense | MVP |
| **Google AdSense** | Publicité | MVP |
| **Analytics** (GA4 + Search Console API) | Mesure | MVP |
| **Affiliation** (Booking, GetYourGuide, etc.) | Revenu | V3 |
| **Anti-spam** (hCaptcha/Turnstile, Akismet) | Commentaires/contact | MVP |
| **Stockage/Images** (S3-compatible + CDN/Image CDN) | Médias | MVP |

### 21.3 Conventions API
- Versionnement (`/api/v1` si API publique exposée en V4).
- Réponses typées (Zod en entrée/sortie), codes HTTP cohérents.
- **Rate limiting** sur endpoints sensibles (recherche, auth, contact, commentaires).
- Validation + sanitization systématiques (voir Phase 4 sécurité).
- Pagination par curseur, cache HTTP où pertinent.

### 21.4 Recherche instantanée — option d'architecture
- **MVP** : Postgres (`pg_trgm`/`tsvector`) — simple, suffisant au début.
- **Échelle** : moteur dédié (**Typesense / Meilisearch / Algolia**) pour l'autocomplétion ultra-rapide multi-entités.
> ❓ **Décision** : démarrer Postgres puis migrer, ou Meilisearch dès le MVP (recommandé si budget : meilleure UX de recherche).

---

## 22. Structure des dossiers

> Cible **Next.js (App Router) + TypeScript + Tailwind + Prisma + NextAuth**. Architecture **feature-oriented** + couche domaine claire.

```
projet-ads/
├── docs/                          # Documentation (phases, ADR, specs)
│   ├── PHASE-1-ARCHITECTURE.md
│   ├── PHASE-2-DESIGN-SEO.md      # (à venir)
│   └── adr/                       # Architecture Decision Records
│
├── prisma/
│   ├── schema.prisma              # Modèle de données
│   ├── migrations/
│   └── seed.ts                    # Données initiales (continents, pays…)
│
├── public/                        # Assets statiques, favicons, robots base
│
├── messages/                      # Traductions i18n (fr.json, en.json…)
│
├── src/
│   ├── app/                       # App Router (routes = arborescence §6)
│   │   ├── (marketing)/           # Groupe : home, à-propos, contact…
│   │   │   ├── page.tsx           # Accueil
│   │   │   └── a-propos/page.tsx
│   │   ├── (legal)/               # Pages légales
│   │   ├── destinations/
│   │   ├── [continent]/
│   │   │   ├── page.tsx           # Fiche continent
│   │   │   └── [country]/
│   │   │       ├── page.tsx       # Fiche pays
│   │   │       ├── [city]/
│   │   │       │   ├── page.tsx   # Fiche ville
│   │   │       │   ├── lieux/[slug]/page.tsx
│   │   │       │   ├── hotels/[slug]/page.tsx
│   │   │       │   ├── restaurants/[slug]/page.tsx
│   │   │       │   └── [intent]/page.tsx   # que-faire, quand-partir…
│   │   │       └── [intent]/page.tsx
│   │   ├── guides/[slug]/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── comparateurs/[slug]/page.tsx
│   │   ├── recherche/page.tsx
│   │   ├── (auth)/                # connexion, inscription…
│   │   ├── compte/               # espace utilisateur (protégé)
│   │   ├── admin/                # back-office (protégé RBAC)
│   │   ├── api/                  # Route handlers (§21.1)
│   │   ├── sitemap.ts           # Sitemap dynamique
│   │   ├── robots.ts           # robots.txt
│   │   ├── layout.tsx          # Layout racine (header/footer, providers)
│   │   ├── not-found.tsx       # 404
│   │   └── global-error.tsx    # 500
│   │
│   ├── components/
│   │   ├── ui/                  # Primitives design system (Button, Card, Input…)
│   │   ├── layout/             # Header, Footer, Nav, Breadcrumb
│   │   ├── destinations/      # DestinationCard, CityHero, PlaceCard…
│   │   ├── search/            # SearchBar, Filters, ResultsList
│   │   ├── content/          # ArticleBody, TOC, FAQ, AuthorBox
│   │   ├── comparison/      # ComparisonTable
│   │   ├── ads/             # AdSlot (réservation d'espace, lazy)
│   │   └── seo/             # JsonLd, MetaTags helpers
│   │
│   ├── features/             # Logique métier par domaine (optionnel)
│   │   ├── favorites/
│   │   ├── comments/
│   │   └── newsletter/
│   │
│   ├── lib/
│   │   ├── db.ts             # Client Prisma (singleton)
│   │   ├── auth.ts          # Config NextAuth
│   │   ├── seo.ts           # Helpers métas/JSON-LD
│   │   ├── search.ts        # Accès moteur de recherche
│   │   ├── rate-limit.ts    # Rate limiting
│   │   ├── validation/      # Schémas Zod
│   │   └── utils/           # slugify, format, dates…
│   │
│   ├── server/              # Server Actions + services (accès DB)
│   │   ├── actions/
│   │   └── services/
│   │
│   ├── hooks/               # Hooks React client
│   ├── types/               # Types partagés
│   ├── config/              # site config, navigation, constantes
│   ├── styles/              # globals.css, tokens Tailwind
│   └── middleware.ts        # i18n, auth admin, headers sécurité, redirects
│
├── tests/                   # unit / integration / e2e (Playwright)
├── .env.example
├── next.config.ts           # images, headers, redirects, i18n
├── tailwind.config.ts
├── tsconfig.json
├── eslint / prettier config
├── package.json
└── README.md
```

### 22.1 Principes de structure
- **Colocation** : un composant + ses styles/tests/variantes ensemble.
- **Server Components par défaut**, `"use client"` uniquement quand nécessaire (interactivité).
- **Séparation claire** UI (components) / métier (server, features) / accès données (lib/db, services).
- **Design system** isolé dans `components/ui` (réutilisable, testé).

---

## 23. Bonnes pratiques

### 23.1 Code & architecture
- **TypeScript strict** (`strict: true`), pas de `any` non justifié.
- Composants **petits, réutilisables, documentés**.
- **Server Components** par défaut ; client minimal.
- **Validation Zod** sur toute entrée (API, formulaires, params).
- **Séparation des responsabilités** (UI / logique / données).
- **ADR** (Architecture Decision Records) pour les choix structurants.

### 23.2 Performance
- **SSG/ISR** pour les pages destination (cache + revalidation).
- **next/image** (formats modernes, lazy, `blurDataURL`, dimensions).
- **Code splitting**, imports dynamiques pour le lourd (cartes, éditeur).
- **Cache** multi-niveaux (CDN, Data Cache, fetch cache, ISR).
- Budget de performance + audit Lighthouse en CI (détail Phase 4).

### 23.3 SEO (transverse au dev)
- Métas + JSON-LD générés **par page** via helpers centralisés.
- Sitemap/robots automatiques.
- Fil d'Ariane systématique.
- Maillage interne via composants automatiques.
- `noindex` discipliné (utilitaires, filtres, brouillons).

### 23.4 Sécurité (détail Phase 4)
- Validation/sanitization, protection **XSS/CSRF/injection**.
- **CSP** + headers de sécurité (HSTS, X-Frame-Options…).
- **Rate limiting** + anti-bruteforce + anti-spam (captcha).
- Cookies `HttpOnly`/`Secure`/`SameSite`, sessions sécurisées.
- RBAC strict sur `/admin` et `/api/admin`.
- Secrets via variables d'environnement (jamais commités).
- Dépendances auditées (Dependabot/`npm audit`).

### 23.5 Accessibilité
- **WCAG 2.2 AA** : navigation clavier, focus visible, `aria-*`, contrastes, alternatives textuelles, structure sémantique (landmarks, headings).

### 23.6 Qualité & process
- **ESLint + Prettier**, hooks pre-commit (lint-staged).
- **Tests** : unitaires (Vitest/Jest), composants (Testing Library), e2e (Playwright).
- **CI/CD** : lint + types + tests + build + Lighthouse à chaque PR.
- **Conventional Commits** + revue de code.
- **Observabilité** : logs structurés, monitoring d'erreurs (Sentry), uptime.
- **Sauvegardes** DB régulières + plan de restauration.

### 23.7 Données & contenu
- Slugs stables + redirections 301 gérées.
- `alt` obligatoire sur images (a11y + SEO).
- Dates de mise à jour visibles (fraîcheur/E-E-A-T).
- Modération UGC avant publication.

---

## 24. Stack technique & décisions d'architecture

Conforme à la Phase 3 imposée + compléments recommandés.

| Couche | Choix | Justification |
|---|---|---|
| Framework | **Next.js (App Router)** | SSR/SSG/ISR, SEO, perf, Server Components |
| Langage | **TypeScript (strict)** | Robustesse, maintenabilité |
| UI | **React + Tailwind CSS** | Vélocité, cohérence, design system |
| Données | **PostgreSQL + Prisma** | Relationnel adapté à la hiérarchie géo, typage |
| Auth | **NextAuth (Auth.js)** | OAuth + sessions sécurisées |
| Rendu | **Server Components + ISR** | Perf + SEO + cache |
| Recherche | **Postgres → Meilisearch/Typesense** | Évolutif (§21.4) |
| Validation | **Zod** | Sécurité des entrées |
| i18n | **next-intl** (préparé) | Multilingue futur |
| Images | **next/image + CDN/Image CDN** | Core Web Vitals |
| Hébergement | **Vercel** ou Node + CDN (au choix) | Scalabilité, ISR natif |
| Cache/CDN | CDN edge + Data Cache | Millions de visiteurs |
| Email | Resend / SES | Transactionnel |
| Monitoring | Sentry + Analytics | Observabilité |
| CI/CD | GitHub Actions | Qualité continue |

### Décisions structurantes (résumé)
1. **SEO-first / rendu serveur** : non négociable pour l'objectif trafic.
2. **Programmatic SEO encadré** : volume + garde-fous qualité.
3. **ISR + cache + CDN** : tenir la charge à coût maîtrisé.
4. **Server Actions** privilégiées : moins de surface d'attaque.
5. **i18n dès la conception** (activé plus tard).
6. **AdSense maîtrisé** (CWV-safe) + diversification revenus.

> ❓ **Décision attendue** : confirmer la cible d'hébergement (Vercel vs auto-hébergé Node/Docker) — impacte ISR, edge, coûts.

---

## 25. Risques & points de vigilance

| Risque | Impact | Mitigation |
|---|---|---|
| **Thin content** (programmatic mal fait) | Pénalité Google / refus AdSense | Garde-fous §12.3, enrichissement, `noindex` si vide |
| **AdSense vs Core Web Vitals** | Mauvais CWV → SEO ↓ | Réservation d'espace, lazy-load, limite de slots (§17.3) |
| **Dépendance AdSense** | Revenu fragile | Diversification (affiliation, premium) §18 |
| **Mises à jour algo Google** | Volatilité trafic | E-E-A-T, qualité, diversité de sources de trafic |
| **Coûts à l'échelle** | Marge | SSG/ISR/CDN, cache agressif, archi efficiente |
| **Conformité RGPD/CMP** | Sanctions / suspension AdSense | CMP + Consent Mode v2 dès le MVP |
| **Qualité des données géo** | Crédibilité | Sources fiables + relecture éditoriale |
| **Sécurité (UGC, admin)** | Compromission | RBAC, validation, rate limit, modération (Phase 4) |
| **Volume de contenu à produire** | Rythme de croissance | Pipeline + programmatique + IA en assistance |
| **Collision de slugs** | Bugs URL | Unicité par parent, slugify normalisé |

---

## 26. Critères de validation de la Phase 1

Merci de valider (ou amender) les points suivants avant le passage en Phase 2 (design + SEO détaillé). **Aucun code ne sera écrit avant votre accord.**

### Décisions à confirmer
1. **Marque & domaine** + langue(s) de lancement (§1.5).
2. **Structure d'URL** : Option A (chemin géographique complet) — recommandée (§14.4).
3. **Modélisation BD** : polymorphisme Favorite/Comment/Review + tables séparées Hotel/Restaurant/Place (§20.5).
4. **Recherche** : Postgres au départ vs Meilisearch dès le MVP (§21.4).
5. **Hébergement** cible : Vercel vs auto-hébergé (§24).
6. **Périmètre MVP** : la liste §4 vous convient-elle (rien à retirer/ajouter) ?
7. **Priorités de couverture** : quels continents/pays/destinations en premier (§9.3) ?
8. **Monétisation** : AdSense au lancement, affiliation en V3 — OK ?

### Ce que débloquera la validation
- **Phase 2** : design premium détaillé (chaque page : rôle, composants, couleurs, espacements, animations) + stratégie SEO opérationnelle (métas, OG, JSON-LD, sitemap, robots, CWV) — **toujours sans coder**.
- **Phase 3** : développement complet selon la stack imposée.
- **Phase 4** : mise en production, optimisation, sécurité, audit.

---

> **Prochaine étape : votre validation.** Indiquez « validé » (ou vos ajustements) et je lance la **Phase 2 (design + SEO)**.
