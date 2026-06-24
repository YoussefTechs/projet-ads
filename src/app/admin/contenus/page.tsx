import Link from "next/link";
import { prisma } from "@/lib/db";
import { paths } from "@/lib/url";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function AdminContentPage() {
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
    take: 100,
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Contenus</h1>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Titre</th>
              <th className="p-3 font-medium">Type</th>
              <th className="p-3 font-medium">Statut</th>
              <th className="p-3 font-medium">Auteur</th>
              <th className="p-3 font-medium">Modifié</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-muted/40">
                <td className="p-3 font-medium">
                  <Link
                    href={a.type === "BLOG" ? paths.article(a.slug) : paths.guide(a.slug)}
                    className="hover:text-brand-700"
                  >
                    {a.title}
                  </Link>
                </td>
                <td className="p-3 text-muted-foreground">{a.type}</td>
                <td className="p-3">
                  <Badge variant={a.status === "PUBLISHED" ? "success" : "muted"}>
                    {a.status === "PUBLISHED" ? "Publié" : "Brouillon"}
                  </Badge>
                </td>
                <td className="p-3 text-muted-foreground">{a.author?.name ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{formatDate(a.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
