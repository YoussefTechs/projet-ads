import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getGuides } from "@/server/content";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArticleCard } from "@/components/cards/article-card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  return buildMetadata({
    title: "Guides de voyage : itinéraires, conseils & inspirations",
    description:
      "Tous nos guides de voyage : itinéraires détaillés, conseils pratiques et idées de destinations pour préparer votre prochain séjour.",
    path: page && +page > 1 ? `${paths.guides()}?page=${page}` : paths.guides(),
    noindex: Boolean(page && +page > 1),
  });
}

export default async function GuidesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, pages } = await getGuides({ page, perPage: 9 });

  return (
    <div className="container-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Guides", path: paths.guides() },
        ])}
      />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Guides" }]} />

      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">
          Guides de voyage
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Itinéraires, conseils pratiques et inspirations pour préparer chaque
          voyage.
        </p>
      </header>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a, i) => (
              <ArticleCard key={a.id} article={a} priority={i < 3} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={pages}
            hrefFor={(p) => (p === 1 ? paths.guides() : `${paths.guides()}?page=${p}`)}
          />
        </>
      ) : (
        <EmptyState title="Aucun guide pour le moment" description="Revenez bientôt !" />
      )}
    </div>
  );
}
