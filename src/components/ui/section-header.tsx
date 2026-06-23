import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** En-tête de section réutilisable (titre + sous-titre + lien optionnel). */
export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Tout voir",
  className,
  as = "h2",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className={cn("mb-6 flex items-end justify-between gap-4", className)}>
      <div>
        <Heading className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </Heading>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:gap-2 hover:underline dark:text-brand-300 sm:inline-flex"
        >
          {linkLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
