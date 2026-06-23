"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

/** Barre de recherche du héros — navigue vers /recherche. */
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/recherche?q=${encodeURIComponent(q.trim())}` : "/recherche");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-lg ring-1 ring-black/5 dark:bg-ink-900"
    >
      <Search size={20} className="ml-3 shrink-0 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Où voulez-vous aller ?"
        aria-label="Rechercher une destination"
        className="h-10 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-brand-600 px-6 font-medium text-white transition-colors hover:bg-brand-700"
      >
        Explorer
      </button>
    </form>
  );
}
