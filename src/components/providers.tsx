"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

/**
 * Providers client globaux.
 * - SessionProvider : la session est récupérée côté client → le layout reste
 *   statique (les pages de contenu peuvent être SSG/ISR, essentiel pour le
 *   SEO, les Core Web Vitals et la mise à l'échelle).
 * - ThemeProvider : mode clair/sombre.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
