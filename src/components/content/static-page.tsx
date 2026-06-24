import { Breadcrumb } from "@/components/ui/breadcrumb";

/** Gabarit de page éditoriale/légale (colonne de lecture). */
export function StaticPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: title }]} />
        <h1 className="font-display text-4xl font-semibold">{title}</h1>
        {lastUpdated && (
          <p className="mt-2 text-sm text-muted-foreground">
            Dernière mise à jour : {lastUpdated}
          </p>
        )}
        <div className="prose mt-8">{children}</div>
      </div>
    </div>
  );
}
