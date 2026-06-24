import Link from "next/link";
import { getAdminStats, requireAdminAccess } from "@/server/admin-data";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdminAccess();
  const s = await getAdminStats();

  const stats = [
    { label: "Pays", value: s.countries, href: "/admin/countries" },
    { label: "Villes", value: s.cities, href: "/admin/cities" },
    { label: "Activités", value: s.activities, href: "/admin/activities" },
    { label: "Hôtels", value: s.hotels, href: "/admin/hotels" },
    { label: "Restaurants", value: s.restaurants, href: "/admin/restaurants" },
    { label: "Articles & guides", value: s.articles, href: "/admin/guides" },
    {
      label: "Commentaires à modérer",
      value: s.pending,
      href: "/admin/moderation",
      highlight: s.pending > 0,
    },
    { label: "Utilisateurs", value: s.users, href: "/admin/users" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-semibold">Tableau de bord</h1>
        <div className="flex gap-2">
          <Link href="/admin/cities/new" className={buttonVariants({ size: "sm" })}>
            + Ville
          </Link>
          <Link
            href="/admin/countries/new"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            + Pays
          </Link>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`rounded-xl border bg-card p-6 transition-colors hover:border-brand-600 ${
              stat.highlight ? "border-accent-400" : "border-border"
            }`}
          >
            <p className="text-3xl font-semibold">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border bg-muted/30 p-6">
        <h2 className="font-semibold">Gérer le contenu</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tout le contenu du site se gère ici, sans toucher au code. Ajoutez un
          pays, puis ses villes, lieux, hôtels et restaurants — les pages et le
          référencement sont générés automatiquement.
        </p>
      </div>
    </div>
  );
}
