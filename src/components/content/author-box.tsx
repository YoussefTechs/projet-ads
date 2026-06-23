import Link from "next/link";
import Image from "next/image";
import { paths } from "@/lib/url";

/** Encadré auteur (E-E-A-T). */
export function AuthorBox({
  author,
}: {
  author: {
    name: string | null;
    slug: string | null;
    image: string | null;
    bio?: string | null;
    expertise?: string | null;
  };
}) {
  const content = (
    <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-brand-100">
        {author.image ? (
          <Image src={author.image} alt={author.name ?? ""} fill sizes="56px" className="object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center text-lg font-semibold text-brand-700">
            {(author.name ?? "?").charAt(0)}
          </span>
        )}
      </span>
      <div>
        <p className="font-semibold">{author.name}</p>
        {author.expertise && (
          <p className="text-sm text-brand-700 dark:text-brand-300">
            {author.expertise}
          </p>
        )}
        {author.bio && (
          <p className="mt-1 text-sm text-muted-foreground">{author.bio}</p>
        )}
      </div>
    </div>
  );

  return author.slug ? (
    <Link href={paths.author(author.slug)} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}
