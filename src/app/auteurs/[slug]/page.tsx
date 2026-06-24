import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getAuthors, getAuthorBySlug } from "@/server/content";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ArticleCard } from "@/components/cards/article-card";
import { SectionHeader } from "@/components/ui/section-header";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/json-ld";

export const revalidate = 3600;

export async function generateStaticParams() {
  const authors = await getAuthors();
  return authors.filter((a) => a.slug).map((a) => ({ slug: a.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return {};
  return buildMetadata({
    title: `${author.name}, auteur`,
    description: author.bio ?? `Articles et guides rédigés par ${author.name}.`,
    path: paths.author(slug),
    image: author.image ?? undefined,
  });
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Auteurs", path: paths.authors() },
    { name: author.name ?? "Auteur", path: paths.author(slug) },
  ];

  return (
    <div className="container-page">
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: author.name,
              description: author.bio,
              jobTitle: author.expertise,
            },
          },
        ]}
      />
      <Breadcrumb items={crumbs.map((c) => ({ name: c.name, href: c.path }))} />

      <header className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-brand-100">
          {author.image && (
            <Image src={author.image} alt={author.name ?? ""} fill sizes="96px" className="object-cover" />
          )}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold">{author.name}</h1>
          {author.expertise && (
            <p className="text-brand-700 dark:text-brand-300">{author.expertise}</p>
          )}
          {author.bio && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{author.bio}</p>
          )}
        </div>
      </header>

      <section className="mt-12">
        <SectionHeader title={`Articles de ${author.name}`} as="h2" />
        {author.articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {author.articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun article publié pour le moment.</p>
        )}
      </section>
    </div>
  );
}
