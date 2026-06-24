"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "atlas-consent";

/**
 * Bandeau de consentement (CMP simplifiée).
 * Non bloquant pour le LCP. En production, brancher une CMP certifiée
 * IAB TCF + Google Consent Mode v2 (cf. PHASE-2-SEO / Phase 1 §17.4).
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  function decide(value: "accepted" | "refused") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
    // Google Consent Mode v2 (si gtag présent)
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("consent", "update", {
      ad_storage: value === "accepted" ? "granted" : "denied",
      analytics_storage: value === "accepted" ? "granted" : "denied",
    });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 backdrop-blur">
      <div className="container flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Nous utilisons des cookies pour améliorer votre expérience et afficher
          des publicités pertinentes.{" "}
          <Link href="/cookies" className="text-brand-700 underline">
            En savoir plus
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => decide("refused")}>
            Refuser
          </Button>
          <Button size="sm" onClick={() => decide("accepted")}>
            Tout accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
