import Link from "next/link";
import Image from "next/image";
import { Clock, CalendarClock } from "lucide-react";
import { paths } from "@/lib/url";
import { formatDate } from "@/lib/utils";
import { ArticleBody, extractHeadings } from "@/components/content/article-body";
import { AuthorBox } from "@/components/content/author-box";
import { ArticleCard } from "@/components/cards/article-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Faq } from "@/components/ui/faq";
import { AdSlot } from "@/components/ads/ad-slot";
import { Comments, type CommentView } from "@/components/engagement/comments";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/json-ld";

interface ArticleViewProps {
  section: "guides" | "blog";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  article: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  related: any[];
  comments: CommentView[];
}

/** Vue détaillée d'un article/guide (partagée entre /guides et /blog). */
export function ArticleView({
  section,
  article,
  related,
  comments,
}: ArticleViewProps) {
  const sectionLabel = section === "guides" ? "Guides" : "Blog";
  const sectionPath = section === "guides" ? paths.guides() : paths.blog();
  const selfPath =
    section === "guides" ? paths.guide(article.slug) : paths.article(article.slug);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: sectionLabel, path: sectionPath },
    { name: article.title, path: selfPath },
  ];

  const headings = extractHeadings(article.content);
  const faqItems: { question: string; answer: string }[] = article.faq ?? [];

  return (
    <article className="container py-10">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          articleSchema({
            title: article.title,
            description: article.excerpt ?? undefined,
            image: article.coverImage ?? undefined,
            path: selfPath,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            authorName: article.author?.name ?? undefined,
            authorPath: article.author?.slug
              ? paths.author(article.author.slug)
              : undefined,
          }),
          ...(faqItems.length ? [faqSchema(faqItems)] : []),
        ]}
      />

      {/* En-tête éditorial */}
      <header className="mx-auto max-w-3xl text-center">
        <nav aria-label="Fil d'Ariane" className="mb-4 text-sm text-muted-foreground">
          <Link href={sectionPath} className="hover:text-foreground">
            {sectionLabel}
          </Link>
        </nav>
        <h1 className="font-display text-3xl font-semibold leading-tight md:text-5xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {article.excerpt}
          </p>
        )}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
          {article.author?.name && <span>Par {article.author.name}</span>}
          {article.updatedAt && (
            <span className="flex items-center gap-1">
              <CalendarClock size={14} /> Mis à jour le {formatDate(article.updatedAt)}
            </span>
          )}
          {article.readingTime && (
            <span className="flex items-center gap-1">
              <Clock size={14} /> {article.readingTime} min
            </span>
          )}
        </div>
      </header>

      {/* Couverture */}
      {article.coverImage && (
        <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl bg-muted">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_280px]">
        <div>
          {/* Table des matières (mobile) */}
          {headings.length > 1 && (
            <nav className="mb-8 rounded-xl border border-border bg-card p-5 lg:hidden">
              <p className="mb-2 font-semibold">Sommaire</p>
              <ul className="space-y-1 text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-brand-700 hover:underline">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <ArticleBody content={article.content} />

          {/* Destinations liées (maillage interne) */}
          {(article.countries?.length > 0 || article.cities?.length > 0) && (
            <div className="mt-10 rounded-xl border border-border bg-muted/40 p-5">
              <p className="mb-2 font-semibold">Destinations citées</p>
              <div className="flex flex-wrap gap-2">
                {article.countries?.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (c: any) => (
                    <Link
                      key={c.id}
                      href={paths.country(c.continent.slug, c.slug)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-brand-600"
                    >
                      {c.flagEmoji} {c.name}
                    </Link>
                  ),
                )}
                {article.cities?.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (c: any) => (
                    <Link
                      key={c.id}
                      href={paths.city(c.country.continent.slug, c.country.slug, c.slug)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-sm hover:border-brand-600"
                    >
                      {c.name}
                    </Link>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Auteur (E-E-A-T) */}
          {article.author && (
            <div className="mt-10">
              <AuthorBox author={article.author} />
            </div>
          )}
        </div>

        {/* Colonne latérale */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-6">
            {headings.length > 1 && (
              <nav className="rounded-xl border border-border bg-card p-5">
                <p className="mb-2 font-semibold">Sommaire</p>
                <ul className="space-y-1.5 text-sm">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="text-muted-foreground hover:text-brand-700"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <AdSlot format="sidebar" />
          </div>
        </aside>
      </div>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <SectionHeader title="Questions fréquentes" as="h2" />
          <Faq items={faqItems} />
        </section>
      )}

      {/* Articles liés */}
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl">
          <SectionHeader title="À lire aussi" as="h2" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-3xl">
        <Comments
          entityType="ARTICLE"
          entityId={article.id}
          comments={comments}
        />
      </div>
    </article>
  );
}
