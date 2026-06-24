import Link from "next/link";
import { prisma } from "@/lib/db";
import { paths } from "@/lib/url";
import { Badge } from "@/components/ui/badge";

export default async function AdminDestinationsPage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    include: {
      continent: true,
      _count: { select: { cities: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Destinations</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Pays</th>
              <th className="p-3 font-medium">Continent</th>
              <th className="p-3 font-medium">Villes</th>
              <th className="p-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody>
            {countries.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/40">
                <td className="p-3 font-medium">
                  <Link
                    href={paths.country(c.continent.slug, c.slug)}
                    className="hover:text-brand-700"
                  >
                    {c.flagEmoji} {c.name}
                  </Link>
                </td>
                <td className="p-3 text-muted-foreground">{c.continent.name}</td>
                <td className="p-3 text-muted-foreground">{c._count.cities}</td>
                <td className="p-3">
                  <Badge variant={c.status === "PUBLISHED" ? "success" : "muted"}>
                    {c.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
