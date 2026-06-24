"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // En production, brancher un monitoring d'erreurs (ex. Sentry).
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">
        Oups, une erreur est survenue
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Quelque chose s'est mal passé de notre côté. Réessayez dans un instant.
      </p>
      <Button onClick={reset} className="mt-8">
        Réessayer
      </Button>
    </div>
  );
}
