import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getBlogArticles } from "@/server/content";
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
    title: "Blog voyage : actualités, inspirations & conseils",
    description:
      "Le blog Atlas : inspirations, actualités et conseils pour voyager mieux, plus loin et plus souvent.",
    path: page && +page > 1 ? `${paths.blog()}?page=${page}` : paths.blog(),
    noindex: Boolean(page && +page > 1),
  });
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { items, pages } = await getBlogArticles({ page, perPage: 9 });

  return (
    <div className="container-page">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Blog", path: paths.blog() },
        ])}
      />
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Blog" }]} />

      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Inspirations, actualités et conseils pour voyager mieux.
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
            hrefFor={(p) => (p === 1 ? paths.blog() : `${paths.blog()}?page=${p}`)}
          />
        </>
      ) : (
        <EmptyState title="Aucun article pour le moment" description="Revenez bientôt !" />
      )}
    </div>
  );
}
