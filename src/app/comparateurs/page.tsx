import Link from "next/link";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getComparableCities } from "@/server/destinations";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/json-ld";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Comparateurs de destinations : choisissez en un coup d'œil",
  description:
    "Hésitez-vous entre deux destinations ? Nos comparateurs analysent budget, météo, ambiance et activités pour vous aider à choisir.",
  path: paths.comparators(),
});

export default async function ComparatorsPage() {
  const cities = await getComparableCities(10);

  // Suggestions de comparateurs (paires de villes populaires).
  const pairs: [(typeof cities)[number], (typeof cities)[number]][] = [];
  for (let i = 0; i + 1 < cities.length; i += 2) {
    pairs.push([cities[i], cities[i + 1]]);
  }

  return (
    <div className="container-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Comparateurs", path: paths.comparators() },
        ])}
      />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Comparateurs" }]} />

      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">
          Comparateurs de destinations
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Hésitez-vous entre deux villes ? Comparez-les en un coup d'œil.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map(([a, b]) => (
          <Link
            key={`${a.id}-${b.id}`}
            href={paths.comparator(a.slug, b.slug)}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative grid grid-cols-2">
              <div className="relative aspect-[4/3]">
                {a.heroImage && (
                  <Image src={a.heroImage} alt={a.name} fill sizes="200px" className="object-cover" />
                )}
              </div>
              <div className="relative aspect-[4/3]">
                {b.heroImage && (
                  <Image src={b.heroImage} alt={b.name} fill sizes="200px" className="object-cover" />
                )}
              </div>
              <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand-700 shadow-md">
                <ArrowLeftRight size={18} />
              </span>
            </div>
            <div className="p-4 text-center font-semibold">
              {a.name} <span className="text-muted-foreground">vs</span> {b.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
