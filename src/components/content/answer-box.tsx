import { Sparkles } from "lucide-react";

/**
 * Encadré « réponse rapide » (TL;DR) — placé en tête des pages d'intention.
 * Sert le persona « info rapide » et cible les featured snippets.
 */
export function AnswerBox({
  title = "En bref",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-900/50 dark:bg-brand-900/20">
      <div className="mb-1.5 flex items-center gap-2 font-semibold text-brand-800 dark:text-brand-200">
        <Sparkles size={18} aria-hidden /> {title}
      </div>
      <div className="text-ink-700 dark:text-ink-200">{children}</div>
    </div>
  );
}
