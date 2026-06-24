"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import type { ResolvedFavorite } from "@/server/engagement";
import { EmptyState } from "@/components/ui/empty-state";
import { Heart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function FavoritesList({ initial }: { initial: ResolvedFavorite[] }) {
  const [favorites, setFavorites] = useState(initial);

  async function remove(fav: ResolvedFavorite) {
    setFavorites((prev) => prev.filter((f) => f.key !== fav.key));
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityType: fav.entityType, entityId: fav.entityId }),
    });
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Aucun favori pour le moment"
        description="Explorez nos destinations et cliquez sur le cœur pour les enregistrer."
      >
        <Link href="/destinations" className={buttonVariants()}>
          Explorer les destinations
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {favorites.map((fav) => (
        <div key={fav.key} className="group relative">
          <Link
            href={fav.href}
            className="block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] bg-muted">
              {fav.image && (
                <Image src={fav.image} alt={fav.name} fill sizes="33vw" className="object-cover" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{fav.name}</h3>
              {fav.subtitle && (
                <p className="text-sm text-muted-foreground">{fav.subtitle}</p>
              )}
            </div>
          </Link>
          <button
            onClick={() => remove(fav)}
            aria-label="Retirer des favoris"
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm hover:bg-white"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
