import Link from "next/link";
import { ExternalLink, Check } from "lucide-react";
import { requireAdminAccess } from "@/server/admin-data";

export const dynamic = "force-dynamic";

const features = [
  "URL SEO générée automatiquement (slug)",
  "Meta Title & Meta Description (auto + éditables)",
  "Open Graph & Twitter Cards",
  "URL canonique",
  "Fil d'Ariane (Breadcrumb)",
  "Schema.org (Article, FAQ, TouristDestination, LocalBusiness…)",
  "Entrée de sitemap automatique",
  "Maillage interne automatique",
];

export default async function AdminSeoPage() {
  await requireAdminAccess();

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold">SEO</h1>
      <p className="mb-6 text-muted-foreground">
        Le référencement est automatisé à la publication. Chaque contenu peut
        être affiné via les champs SEO de son formulaire.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 font-semibold">Généré automatiquement</h2>
          <ul className="space-y-2 text-sm">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <Check size={16} className="text-green-600" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-3 font-semibold">Fichiers SEO</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-700 hover:underline"
              >
                Sitemap XML <ExternalLink size={14} />
              </a>
            </li>
            <li>
              <a
                href="/robots.txt"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-700 hover:underline"
              >
                robots.txt <ExternalLink size={14} />
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Pensez à soumettre le sitemap dans{" "}
            <Link href="/admin/settings" className="text-brand-700 hover:underline">
              Google Search Console
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
