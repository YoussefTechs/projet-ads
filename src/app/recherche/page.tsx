import { buildMetadata } from "@/lib/seo";
import { searchAll } from "@/server/search";
import { SearchControls } from "@/components/search/search-controls";
import { EntityCard } from "@/components/cards/entity-card";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Search } from "lucide-react";

// Page utilitaire : non indexée (cf. PHASE-2-SEO §7).
export const metadata = buildMetadata({
  title: "Recherche",
  description: "Recherchez parmi nos destinations, lieux et guides de voyage.",
  path: "/recherche",
  noindex: true,
});

const PER_PAGE = 12;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const { q = "", type = "all", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { results, total } = await searchAll({
    q,
    type,
    page,
    perPage: PER_PAGE,
  });
  const pages = Math.ceil(total / PER_PAGE);

  return (
    <div className="container-page">
      <h1 className="mb-6 font-display text-3xl font-semibold md:text-4xl">
        Recherche
      </h1>

      <SearchControls initialQuery={q} activeType={type} />

      <div className="mt-8">
        {!q ? (
          <EmptyState
            icon={Search}
            title="Que recherchez-vous ?"
            description="Saisissez le nom d'une destination, d'un lieu ou d'un guide."
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={Search}
            title={`Aucun résultat pour « ${q} »`}
            description="Essayez avec d'autres mots-clés."
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {total} résultat{total > 1 ? "s" : ""} pour « {q} »
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {results.map((r) => (
                <EntityCard
                  key={`${r.type}-${r.id}`}
                  href={r.href}
                  title={r.name}
                  subtitle={r.subtitle}
                  image={r.image}
                />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={pages}
              hrefFor={(p) => {
                const params = new URLSearchParams();
                if (q) params.set("q", q);
                if (type !== "all") params.set("type", type);
                if (p > 1) params.set("page", String(p));
                return `/recherche?${params.toString()}`;
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
