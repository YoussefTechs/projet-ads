import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";

/** Héros de page destination : image plein cadre + overlay + titre. */
export function PageHero({
  title,
  subtitle,
  image,
  badge,
  breadcrumb,
  actions,
}: {
  title: string;
  subtitle?: string;
  image?: string | null;
  badge?: string;
  breadcrumb?: Crumb[];
  actions?: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[42vh] items-end overflow-hidden">
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <div className="container relative z-10 pb-10 pt-24 text-white">
        {breadcrumb && (
          <nav aria-label="Fil d'Ariane" className="mb-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/80">
              {breadcrumb.map((c, i) => {
                const isLast = i === breadcrumb.length - 1;
                return (
                  <li key={i} className="flex items-center gap-1">
                    {c.href && !isLast ? (
                      <Link href={c.href} className="hover:text-white">
                        {c.name}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-white" : undefined}>
                        {c.name}
                      </span>
                    )}
                    {!isLast && <ChevronRight size={14} aria-hidden />}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}

        {badge && (
          <Badge variant="brand" className="mb-3">
            {badge}
          </Badge>
        )}

        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-lg text-white/90">{subtitle}</p>
        )}
        {actions && <div className="mt-5 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
