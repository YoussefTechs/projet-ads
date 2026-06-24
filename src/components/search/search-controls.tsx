"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const types = [
  { value: "all", label: "Tout" },
  { value: "city", label: "Villes" },
  { value: "country", label: "Pays" },
  { value: "place", label: "Lieux" },
  { value: "article", label: "Guides & articles" },
];

/** Champ de recherche + filtres par type (met à jour l'URL). */
export function SearchControls({
  initialQuery,
  activeType,
}: {
  initialQuery: string;
  activeType: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function search(type = activeType) {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (type && type !== "all") params.set("type", type);
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-card p-2"
      >
        <Search size={20} className="ml-2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une destination, un guide…"
          aria-label="Rechercher"
          className="h-10 flex-1 bg-transparent outline-none"
        />
        <button
          type="submit"
          className="h-10 rounded-full bg-brand-600 px-5 font-medium text-white hover:bg-brand-700"
        >
          Rechercher
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => search(t.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeType === t.value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border hover:bg-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
