import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { paths } from "@/lib/url";

interface ArticleCardData {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  type: string;
  publishedAt?: Date | string | null;
  readingTime?: number | null;
  author?: { name: string | null } | null;
  categories?: { name: string; slug: string }[];
}

/** Carte d'article / guide (image de couverture, catégorie, auteur, date). */
export function ArticleCard({
  article,
  priority = false,
}: {
  article: ArticleCardData;
  priority?: boolean;
}) {
  const href =
    article.type === "BLOG"
      ? paths.article(article.slug)
      : paths.guide(article.slug);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 ease-standard hover:-translate-y-1 hover:shadow-lg">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-muted">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 ease-standard group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-300/40 to-brand-500/40" />
        )}
        {article.categories?.[0] && (
          <Badge variant="default" className="absolute left-3 top-3">
            {article.categories[0].name}
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug">
          <Link href={href} className="hover:text-brand-700 dark:hover:text-brand-300">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          {article.author?.name && <span>{article.author.name}</span>}
          {article.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={new Date(article.publishedAt).toISOString()}>
                {formatDate(article.publishedAt)}
              </time>
            </>
          )}
          {article.readingTime && (
            <>
              <span aria-hidden>·</span>
              <span>{article.readingTime} min</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
