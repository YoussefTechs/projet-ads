"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AdFormat = "in-article" | "sidebar" | "leaderboard" | "in-feed";

// Hauteurs réservées par format → CLS = 0 (cf. PHASE-2-DESIGN §31).
const minHeights: Record<AdFormat, string> = {
  "in-article": "min-h-[280px]",
  sidebar: "min-h-[600px]",
  leaderboard: "min-h-[120px]",
  "in-feed": "min-h-[250px]",
};

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Emplacement publicitaire à espace réservé + lazy-load.
 * - L'espace est réservé immédiatement (pas de décalage de mise en page).
 * - L'annonce n'est demandée que lorsqu'elle approche du viewport.
 * - Sans configuration AdSense, un placeholder discret est affiché.
 */
export function AdSlot({
  slot,
  format = "in-article",
  className,
}: {
  slot?: string;
  format?: AdFormat;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (visible && siteConfig.ads.enabled) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ignore les erreurs (bloqueur de pub, etc.).
      }
    }
  }, [visible]);

  return (
    <div
      ref={ref}
      className={cn(
        "my-8 flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-muted/40",
        minHeights[format],
        className,
      )}
      aria-label="Publicité"
    >
      <span className="py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        Publicité
      </span>
      {visible && siteConfig.ads.enabled && slot ? (
        <ins
          className="adsbygoogle block w-full"
          style={{ display: "block" }}
          data-ad-client={siteConfig.ads.client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground/60">
          Emplacement publicitaire
        </div>
      )}
    </div>
  );
}
