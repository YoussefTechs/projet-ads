# Atlas — Plateforme de voyage *(nom de code)*

Plateforme éditoriale de découverte de voyage, **SEO-first** et monétisée par **Google AdSense** (puis affiliation & premium). Construite avec Next.js (App Router), TypeScript, Tailwind, Prisma/PostgreSQL et NextAuth.

> ✅ Projet développé en 4 phases (analyse → design → développement → production). Le code compile, démarre et a été testé en conditions réelles.

## Avancement par phases

| Phase | Objet | Statut |
|---|---|---|
| **Phase 1** | Analyse & architecture complète | ✅ Validée |
| **Phase 2** | Design premium + stratégie SEO | ✅ Validée |
| **Phase 3** | Développement (Next.js, TS, Prisma…) | ✅ Terminée |
| **Phase 4** | Production, optimisation, sécurité, audit | ✅ Terminée |

## Documentation

- 📄 [Phase 1 — Architecture](docs/PHASE-1-ARCHITECTURE.md)
- 🎨 [Phase 2 — Design](docs/PHASE-2-DESIGN.md) · 🔍 [Phase 2 — SEO](docs/PHASE-2-SEO.md)
- 🚀 [Phase 4 — Production & audit](docs/PHASE-4-PRODUCTION.md)

## Fonctionnalités

Accueil · recherche instantanée (⌘K) · fiches **pays / villes / monuments / hôtels / restaurants** · pages d'intention SEO (que faire, quand partir, budget…) · **guides** & **blog** · **comparateurs** · **catégories** · **favoris** · **compte utilisateur** · **système de commentaires** modéré · **tableau de bord admin** (RBAC) · filtres & pagination · **sitemap automatique** · JSON-LD · dark mode · accessibilité WCAG 2.2 AA.

## Stack

Next.js 15 (App Router, Server Components) · React 19 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · NextAuth (Auth.js) v5.

## Démarrage rapide

```bash
# 1. Dépendances
npm install

# 2. Base de données (PostgreSQL local)
docker compose up -d
cp .env.example .env          # puis renseigner DATABASE_URL & AUTH_SECRET

# 3. Schéma + données de démonstration
npm run db:push
npm run db:seed

# 4. Développement
npm run dev                   # http://localhost:3000
```

Build de production : `npm run build && npm run start`.

### Comptes de démonstration (après seed)

| Rôle | E-mail | Mot de passe |
|---|---|---|
| Admin | `admin@atlas.test` | `Admin1234` |
| Éditeur | `marie@atlas.test` | `Marie1234` |
| Utilisateur | `user@atlas.test` | `User1234` |

## Structure

```
src/
├── app/            # Routes (App Router) : pages, API, sitemap, robots
├── components/     # UI (design system), layout, cartes, contenu, recherche…
├── server/         # Accès aux données (destinations, contenu, recherche, engagement)
├── lib/            # db, auth, seo, json-ld, url, validation, utils, rate-limit
├── config/         # Configuration du site & navigation
└── auth.ts         # NextAuth (Google + credentials, RBAC)
prisma/             # schema.prisma + seed.ts
docs/               # Documentation des 4 phases
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm run db:push` / `db:migrate` | Schéma Prisma |
| `npm run db:seed` | Données de démonstration |

## Variables d'environnement

Voir [`.env.example`](.env.example). Le site fonctionne sans clés Google (AdSense/Analytics/Search Console désactivés tant que les variables ne sont pas renseignées).
