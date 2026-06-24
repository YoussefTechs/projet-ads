# Phase 5 — Mise à jour : Admin no-code, RBAC Google & scalabilité

> Cette mise à jour complète les phases précédentes selon les nouvelles exigences : **administration 100 % no-code**, connexion admin par **Google + ADMIN_EMAIL**, RBAC complet, type de contenu **Activités**, génération **IA**, SEO automatique et plan de scalabilité. Tout a été **buildé et testé** (login admin, CRUD, IA, pages publiques).

**Date : 2026-06-24**

---

## 1. Authentification administrateur (Google + ADMIN_EMAIL)

- Connexion via **Google OAuth** (Auth.js) ou e-mail/mot de passe.
- Variable d'environnement **`ADMIN_EMAIL`** (`anouarelbardaoui36@gmail.com`) : à la connexion, si l'e-mail Google correspond, le rôle **ADMIN** est attribué automatiquement (callback JWT + persistance en base via `events.signIn`). **Aucune action manuelle.**
- Vérifié : `admin@atlas.test` → session `role: ADMIN`, accès au dashboard.

## 2. RBAC & protection des routes

| Rôle | Accès |
|---|---|
| **ADMIN** | Tout : contenus, images, SEO, **utilisateurs**, **réglages**, IA |
| **EDITOR** | Créer / éditer / brouillons. Pas d'accès Utilisateurs ni Réglages |
| **USER** | Site public, favoris, profil. Aucun accès admin |

- Protection **middleware (edge)** + **serveur** (`requireAdminAccess`) + redirection vers **`/403`**.
- Routes protégées : `/admin`, `/admin/*`, `/dashboard`.
- Vérifié : non connecté → 307 ; rôle insuffisant → `/403` ; `/admin/users` réservé ADMIN.

## 3. Dashboard d'administration no-code

Menu complet : Tableau de bord · Pays · Villes · Activités · Hôtels · Restaurants · Guides · Blog · Modération · Images · SEO · Utilisateurs · Réglages.

**CRUD complet piloté par configuration** (`src/lib/admin/resources.ts`) — un seul moteur générique gère les 7 types de contenu via Server Actions :

- Champs : Titre, Slug, Image principale, Galerie, Description courte, Description complète, Catégories, Tags, **FAQ**, Statut, **champs SEO**.
- Statuts : **Brouillon · Préversion · Publié · Dépublié** + boutons **Enregistrer le brouillon / Publier / Dépublier / Prévisualiser** (via `draftMode`).
- À la publication d'une ville, l'URL `/{pays}/{ville}` est générée automatiquement (ex. `/asie/japon/tokyo`) — **sans code**.
- Vérifié : login admin → `/admin/countries` (liste « France »), `/admin/cities/new` (formulaire), `/admin/activities`, `/admin/users`.

## 4. Génération de contenu par IA

- Bouton **« Générer avec l'IA »** dans chaque formulaire : pré-remplit description, contenu, FAQ, métadonnées SEO.
- Endpoint `/api/admin/ai` : utilise l'**API Claude** si `ANTHROPIC_API_KEY` est défini, sinon un **gabarit** de secours. Réservé ADMIN/EDITOR (403 sinon), rate-limité.
- Le contenu est **révisable/éditable** avant publication.
- Vérifié : retourne `summary, description, metaTitle, metaDescription, faq` ; 403 sans authentification.

## 5. SEO automatique

À la création/publication, génération automatique (et **éditable**) : slug, Meta Title, Meta Description, Open Graph, Twitter Cards, URL canonique, fil d'Ariane, **Schema.org** (Article, FAQPage, BreadcrumbList, Organization, TouristDestination, TouristAttraction, LodgingBusiness, Restaurant), entrée de **sitemap**, **maillage interne**. FAQ désormais **stockée** par contenu et rendue (pays, villes, activités, articles).

## 6. Nouveau type de contenu : Activités

- Modèle `Activity` (rattaché à une ville), CRUD admin, page publique `/{continent}/{pays}/{ville}/activites/{slug}`, section dédiée sur la fiche ville, inclusion dans la recherche et le sitemap, schéma `TouristAttraction`.

## 7. Recherche

Recherche instantanée + page `/recherche` couvrant désormais **Pays, Villes, Activités, Hôtels, Restaurants, Articles** (autocomplete, filtres, pagination). Vérifié : `?q=visite` renvoie des activités.

## 8. Sécurité (rappel + ajouts)

Google OAuth, sessions JWT, cookies sécurisés (NextAuth), **CSP**, HSTS, XSS (échappement React + JSON-LD), CSRF (NextAuth), injection SQL (Prisma), **validation Zod**, **rate limiting**, anti-bruteforce (bcrypt 12), honeypot anti-spam, variables d'environnement, bonnes pratiques OWASP.

## 9. Scalabilité (250 pays · 100 000 villes · millions de lieux)

- **Modèle relationnel indexé** : index sur tous les `slug`, clés étrangères, `(status, featured)`, `(entityType, entityId)`, etc. → requêtes performantes à grande échelle.
- **Rendu SSG/ISR** (revalidation) + cache/CDN : les pages de contenu sont servies statiquement ; nouvelles pages générées **à la demande** (pas de rebuild complet pour ajouter un pays/une ville).
- **Pagination** partout (listes, recherche, sitemap segmentable < 50 000 URLs).
- **Revalidation à la publication** (`revalidatePath`) : le contenu publié depuis l'admin apparaît sans redéploiement.
- Évolutions prêtes : moteur de recherche dédié (Meilisearch/Typesense), Redis pour le rate-limit, CDN images.

## 10. Variable d'environnement ajoutée

```env
ADMIN_EMAIL=anouarelbardaoui36@gmail.com
# (optionnel) génération IA réelle :
ANTHROPIC_API_KEY=...
AI_MODEL=claude-sonnet-4-6
```

## 11. Workflow final (sans code)

1. Se connecter avec Google (e-mail = `ADMIN_EMAIL`) → rôle ADMIN automatique.
2. Accéder au **Dashboard** (`/admin`).
3. Ajouter Pays → Villes → Activités → Hôtels → Restaurants → Guides/Blog via les formulaires.
4. (Option) **Générer avec l'IA**, ajuster, renseigner la FAQ et le SEO.
5. **Publier** → la page publique et son référencement sont générés automatiquement.

Aucune manipulation de code, base de données, Docker ou Prisma n'est nécessaire après déploiement.
