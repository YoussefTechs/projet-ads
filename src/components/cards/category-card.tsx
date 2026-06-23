import Link from "next/link";
import Image from "next/image";

/** Tuile imagée pour continents & catégories (titre en surimpression). */
export function CategoryCard({
  href,
  title,
  image,
  count,
}: {
  href: string;
  title: string;
  image?: string | null;
  count?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-xl bg-muted shadow-sm"
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width:768px) 50vw, 200px"
          className="object-cover transition-transform duration-500 ease-standard group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-800" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="relative z-10 p-4 text-white">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {count && <p className="text-sm text-white/80">{count}</p>}
      </div>
    </Link>
  );
}
