import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import {
  getContinents,
  getFeaturedCountries,
  getPopularCities,
} from "@/server/destinations";
import { getCategories, getLatestArticles } from "@/server/content";
import { HeroSearch } from "@/components/search/hero-search";
import { SectionHeader } from "@/components/ui/section-header";
import { CategoryCard } from "@/components/cards/category-card";
import { EntityCard } from "@/components/cards/entity-card";
import { ArticleCard } from "@/components/cards/article-card";
import { buttonVariants } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";

export const revalidate = 3600; // ISR : régénération horaire

export const metadata = buildMetadata({
  title:
    "Atlas — Guide de voyage : destinations, conseils & comparateurs",
  description:
    "Découvrez le monde avec Atlas : guides de voyage, fiches destinations, monuments, hôtels et comparateurs pour préparer chaque voyage facilement.",
  path: "/",
  rawTitle: true,
});

const trust = [
  {
    icon: ShieldCheck,
    title: "Informations vérifiées",
    text: "Des fiches rédigées et relues par notre équipe, avec sources fiables.",
  },
  {
    icon: RefreshCw,
    title: "Toujours à jour",
    text: "Nos guides sont actualisés régulièrement pour rester pertinents.",
  },
  {
    icon: Sparkles,
    title: "L'info en 3 secondes",
    text: "Une réponse claire en haut de page, puis tous les détails pour aller plus loin.",
  },
];

export default async function HomePage() {
  const [continents, countries, cities, categories, articles] =
    await Promise.all([
      getContinents(),
      getFeaturedCountries(8),
      getPopularCities(8),
      getCategories(),
      getLatestArticles(3),
    ]);

  return (
    <>
      {/* ───────────── Héros ───────────── */}
      <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=70"
          alt="Voyage à travers le monde"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="container relative z-10 flex flex-col items-center text-center text-white">
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-tight md:text-6xl">
            Le monde, à portée de clic
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
            Des milliers de destinations, guides et conseils pour préparer votre
            prochain voyage — simplement.
          </p>
          <div className="mt-8 flex w-full justify-center">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ───────────── Continents ───────────── */}
      {continents.length > 0 && (
        <section className="container-page">
          <SectionHeader
            title="Explorer par continent"
            subtitle="Plongez dans les destinations du monde entier."
            href={paths.destinations()}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {continents.map((c) => (
              <CategoryCard
                key={c.id}
                href={paths.continent(c.slug)}
                title={c.name}
                image={c.heroImage}
                count={`${c._count.countries} pays`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Destinations populaires ───────────── */}
      {cities.length > 0 && (
        <section className="container-page">
          <SectionHeader
            title="Destinations populaires"
            subtitle="Les villes que les voyageurs adorent en ce moment."
            href={paths.destinations()}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cities.map((city, i) => (
              <EntityCard
                key={city.id}
                href={paths.city(
                  city.country.continent.slug,
                  city.country.slug,
                  city.slug,
                )}
                title={city.name}
                subtitle={city.country.name}
                image={city.heroImage}
                rating={city.rating}
                meta={`${city._count.places} lieux à découvrir`}
                priority={i < 4}
              />
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Bandeau confiance (E-E-A-T) ───────────── */}
      <section className="border-y border-border bg-muted/40">
        <div className="container grid gap-8 py-14 md:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700">
                <t.icon size={20} />
              </div>
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Catégories ───────────── */}
      {categories.length > 0 && (
        <section className="container-page">
          <SectionHeader
            title="Trouvez le voyage qui vous ressemble"
            subtitle="Famille, couple, aventure, petit budget…"
            href={paths.categories()}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((cat) => (
              <CategoryCard
                key={cat.id}
                href={paths.category(cat.slug)}
                title={cat.name}
                image={cat.heroImage}
              />
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Pays à la une ───────────── */}
      {countries.length > 0 && (
        <section className="container-page">
          <SectionHeader title="Pays à la une" href={paths.destinations()} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {countries.slice(0, 4).map((country) => (
              <EntityCard
                key={country.id}
                href={paths.country(country.continent.slug, country.slug)}
                title={`${country.flagEmoji ?? ""} ${country.name}`.trim()}
                subtitle={country.continent.name}
                image={country.heroImage}
                rating={country.rating}
                meta={`${country._count.cities} villes · ${formatNumber(country.avgBudgetPerDay)} €/jour`}
              />
            ))}
          </div>
        </section>
      )}

      {/* ───────────── Derniers articles ───────────── */}
      {articles.length > 0 && (
        <section className="container-page">
          <SectionHeader
            title="Inspiration & conseils"
            subtitle="Nos derniers guides et articles."
            href={paths.blog()}
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {/* ───────────── CTA final ───────────── */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center text-white">
          <h2 className="font-display text-3xl font-semibold">
            Prêt à préparer votre prochain voyage ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">
            Explorez nos destinations et créez votre liste de favoris.
          </p>
          <Link
            href={paths.destinations()}
            className={buttonVariants({
              variant: "secondary",
              size: "lg",
              className: "mt-6 bg-white text-brand-700 hover:bg-white/90",
            })}
          >
            Explorer les destinations <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
