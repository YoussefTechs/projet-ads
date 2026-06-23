import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind de manière sûre (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Transforme un texte en slug URL (sans accents, minuscules, tirets). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Formate un nombre avec séparateurs de milliers (locale fr). */
export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("fr-FR").format(n);
}

/** Formate une date en français (ex. « 12 janvier 2026 »). */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

/** Tronque un texte à n caractères sans couper un mot. */
export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  return slice.slice(0, slice.lastIndexOf(" ")).trimEnd() + "…";
}

/** Estime le temps de lecture (≈ 200 mots/minute). */
export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Libellé d'une gamme de prix. */
export function priceRangeLabel(range: string): string {
  return (
    {
      BUDGET: "€",
      MODERATE: "€€",
      EXPENSIVE: "€€€",
      LUXURY: "€€€€",
    }[range] ?? "€€"
  );
}

/** Construit une plage de pages pour la pagination (avec ellipses). */
export function paginationRange(
  current: number,
  total: number,
  siblings = 1,
): (number | "…")[] {
  const totalNumbers = siblings * 2 + 5;
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;
  const pages: (number | "…")[] = [1];
  if (showLeftDots) pages.push("…");
  for (let i = left; i <= right; i++) {
    if (i !== 1 && i !== total) pages.push(i);
  }
  if (showRightDots) pages.push("…");
  pages.push(total);
  return pages;
}
