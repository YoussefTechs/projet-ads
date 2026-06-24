import Link from "next/link";
import Image from "next/image";
import { buildMetadata } from "@/lib/seo";
import { paths } from "@/lib/url";
import { getAuthors } from "@/server/content";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const revalidate = 3600;

export const metadata = buildMetadata({
  title: "Nos auteurs",
  description:
    "Découvrez l'équipe Atlas : des voyageurs passionnés et experts qui rédigent nos guides.",
  path: paths.authors(),
});

export default async function AuthorsPage() {
  const authors = await getAuthors();

  return (
    <div className="container-page">
      <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Auteurs" }]} />
      <h1 className="mb-2 font-display text-4xl font-semibold">Nos auteurs</h1>
      <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
        Des voyageurs passionnés qui partagent leur expertise.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={paths.author(author.slug!)}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand-600"
          >
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-100">
              {author.image && (
                <Image src={author.image} alt={author.name ?? ""} fill sizes="64px" className="object-cover" />
              )}
            </span>
            <div>
              <p className="font-semibold">{author.name}</p>
              {author.expertise && (
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  {author.expertise}
                </p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                {author._count.articles} article{author._count.articles > 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
