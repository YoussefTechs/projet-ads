import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getCategories } from "@/server/content";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategoryCard } from "@/components/cards/category-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/json-ld";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Catégories de voyage : trouvez l'inspiration",
  description:
    "Famille, couple, aventure, petit budget, gastronomie… Explorez nos catégories pour trouver le voyage qui vous ressemble.",
  path: paths.categories(),
});

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Catégories", path: paths.categories() },
        ])}
      />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Catégories" }]} />

      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">
          Trouvez le voyage qui vous ressemble
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Parcourez nos catégories thématiques et laissez-vous inspirer.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            href={paths.category(cat.slug)}
            title={cat.name}
            image={cat.heroImage}
            count={`${cat._count.countries + cat._count.cities} destinations`}
          />
        ))}
      </div>
    </div>
  );
}
