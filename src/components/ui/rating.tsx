import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Affichage d'une note sur 5 (étoiles + valeur). */
export function RatingStars({
  value,
  count,
  size = 16,
  className,
}: {
  value?: number | null;
  count?: number;
  size?: number;
  className?: string;
}) {
  if (!value) return null;
  return (
    <span
      className={cn("inline-flex items-center gap-1 text-sm", className)}
      aria-label={`Note : ${value.toFixed(1)} sur 5`}
    >
      <Star
        size={size}
        className="fill-accent-400 text-accent-400"
        aria-hidden
      />
      <span className="font-semibold text-foreground">{value.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-muted-foreground">({count})</span>
      )}
    </span>
  );
}
