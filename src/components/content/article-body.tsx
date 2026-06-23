import { Fragment } from "react";
import { slugify } from "@/lib/utils";

/**
 * Rendu sécurisé d'un contenu Markdown léger (sans dépendance externe ni
 * dangerouslySetInnerHTML → pas d'XSS). Gère titres, listes, citations,
 * paragraphes et **gras**.
 */

function renderInline(text: string, keyPrefix: string) {
  // Découpe sur **gras** ; le reste est du texte échappé par React.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={`${keyPrefix}-${i}`}>{part}</Fragment>;
  });
}

export interface Heading {
  id: string;
  text: string;
}

/** Extrait les titres H2 pour une table des matières. */
export function extractHeadings(content: string): Heading[] {
  return content
    .split(/\n+/)
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const text = l.replace(/^##\s+/, "").trim();
      return { id: slugify(text), text };
    });
}

export function ArticleBody({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <div className="prose">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          const text = trimmed.replace(/^##\s+/, "");
          return (
            <h2 key={i} id={slugify(text)}>
              {text}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          const text = trimmed.replace(/^###\s+/, "");
          return (
            <h3 key={i} id={slugify(text)}>
              {text}
            </h3>
          );
        }
        if (trimmed.startsWith("> ")) {
          return (
            <blockquote key={i}>
              {renderInline(trimmed.replace(/^>\s+/, ""), `bq-${i}`)}
            </blockquote>
          );
        }
        // Listes à puces
        const lines = trimmed.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{renderInline(l.replace(/^-\s+/, ""), `li-${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{renderInline(trimmed, `p-${i}`)}</p>;
      })}
    </div>
  );
}
