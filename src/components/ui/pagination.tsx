import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { paginationRange } from "@/lib/utils";

/**
 * Pagination SEO-friendly : liens <a> crawlables (cf. PHASE-2-SEO §6).
 * `hrefFor` construit l'URL d'une page donnée.
 */
export function Pagination({
  currentPage,
  totalPages,
  hrefFor,
}: {
  currentPage: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const range = paginationRange(currentPage, totalPages);

  const base =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-md border border-border px-3 text-sm transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1.5"
    >
      {currentPage > 1 && (
        <Link
          href={hrefFor(currentPage - 1)}
          className={cn(base, "hover:bg-muted")}
          aria-label="Page précédente"
          rel="prev"
        >
          <ChevronLeft size={16} />
        </Link>
      )}

      {range.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={hrefFor(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              base,
              p === currentPage
                ? "border-brand-600 bg-brand-600 font-semibold text-white"
                : "hover:bg-muted",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={hrefFor(currentPage + 1)}
          className={cn(base, "hover:bg-muted")}
          aria-label="Page suivante"
          rel="next"
        >
          <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
