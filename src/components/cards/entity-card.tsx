import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/ui/rating";
import { cn } from "@/lib/utils";

/**
 * Carte de destination/lieu réutilisable (pays, ville, monument, hôtel…).
 * Image généreuse, zoom au survol, badge + note optionnels.
 */
export function EntityCard({
  href,
  title,
  subtitle,
  image,
  badge,
  rating,
  ratingCount,
  meta,
  action,
  priority = false,
  ratio = "aspect-[4/3]",
  className,
}: {
  href: string;
  title: string;
  subtitle?: string;
  image?: string | null;
  badge?: string;
  rating?: number | null;
  ratingCount?: number;
  meta?: string;
  action?: React.ReactNode;
  priority?: boolean;
  ratio?: string;
  className?: string;
}) {
  return (
    <div className={cn("group relative", className)}>
      <Link
        href={href}
        className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 ease-standard hover:-translate-y-1 hover:shadow-lg"
      >
        <div className={cn("relative overflow-hidden bg-muted", ratio)}>
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width:768px) 100vw, (max-width:1280px) 33vw, 320px"
              className="object-cover transition-transform duration-500 ease-standard group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/30 to-brand-700/40" />
          )}
          {badge && (
            <Badge variant="default" className="absolute left-3 top-3 shadow-sm">
              {badge}
            </Badge>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-snug text-foreground">
              {title}
            </h3>
            {rating ? <RatingStars value={rating} count={ratingCount} /> : null}
          </div>
          {subtitle && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={13} aria-hidden /> {subtitle}
            </p>
          )}
          {meta && <p className="mt-2 text-sm text-muted-foreground">{meta}</p>}
        </div>
      </Link>
      {action && <div className="absolute right-3 top-3 z-10">{action}</div>}
    </div>
  );
}
