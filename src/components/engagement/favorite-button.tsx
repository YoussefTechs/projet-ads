"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Bouton « favori » (ajout/suppression optimiste).
 * Si l'utilisateur n'est pas connecté (401), redirige vers la connexion.
 */
export function FavoriteButton({
  entityType,
  entityId,
  initialFavorited = false,
  variant = "overlay",
}: {
  entityType: string;
  entityId: string;
  initialFavorited?: boolean;
  variant?: "overlay" | "inline";
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    const next = !favorited;
    setFavorited(next); // optimiste
    try {
      const res = await fetch("/api/favorites", {
        method: next ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entityId }),
      });
      if (res.status === 401) {
        router.push("/connexion");
        setFavorited(!next);
        return;
      }
      if (!res.ok) setFavorited(!next); // rollback
      else router.refresh();
    } catch {
      setFavorited(!next);
    } finally {
      setPending(false);
    }
  }

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={favorited}
        className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Heart
          size={18}
          className={cn(
            "transition-all",
            favorited ? "animate-pop fill-favorite text-favorite" : "text-foreground",
          )}
        />
        {favorited ? "Enregistré" : "Enregistrer"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={favorited}
      className="grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-transform hover:scale-110 dark:bg-ink-900/80"
    >
      <Heart
        size={18}
        className={cn(
          favorited ? "animate-pop fill-favorite text-favorite" : "text-ink-700",
        )}
      />
    </button>
  );
}
