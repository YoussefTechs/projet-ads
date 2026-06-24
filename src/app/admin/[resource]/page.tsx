import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { getResource } from "@/lib/admin/resources";
import { listResource, recordPublicPath, requireAdminAccess } from "@/server/admin-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "success" | "muted" | "default" | "accent"> = {
  PUBLISHED: "success",
  DRAFT: "muted",
  PREVIEW: "accent",
  UNPUBLISHED: "default",
};
const statusLabel: Record<string, string> = {
  PUBLISHED: "Publié",
  DRAFT: "Brouillon",
  PREVIEW: "Préversion",
  UNPUBLISHED: "Dépublié",
};

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  await requireAdminAccess();
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const records = await listResource(resource);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">{resource.label}</h1>
        <Link href={`/admin/${key}/new`} className={buttonVariants({ size: "sm" })}>
          <Plus size={16} /> Ajouter
        </Link>
      </div>

      {records.length === 0 ? (
        <EmptyState
          title={`Aucun élément`}
          description={`Commencez par ajouter votre premier contenu « ${resource.singular} ».`}
        >
          <Link href={`/admin/${key}/new`} className={buttonVariants()}>
            <Plus size={16} /> Ajouter
          </Link>
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-3 font-medium">Titre</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium">Modifié</th>
                <th className="p-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r: Record<string, unknown>) => {
                const path = recordPublicPath(resource.model, r);
                const status = String(r.status ?? "PUBLISHED");
                return (
                  <tr key={String(r.id)} className="border-t border-border hover:bg-muted/40">
                    <td className="p-3 font-medium">
                      <Link
                        href={`/admin/${key}/${r.id}`}
                        className="hover:text-brand-700"
                      >
                        {String(r[resource.titleField] ?? "—")}
                      </Link>
                    </td>
                    <td className="p-3">
                      <Badge variant={statusVariant[status] ?? "muted"}>
                        {statusLabel[status] ?? status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {formatDate(r.updatedAt as Date)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-3">
                        {path && status === "PUBLISHED" && (
                          <a
                            href={path}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Voir"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <Link
                          href={`/admin/${key}/${r.id}`}
                          className="text-brand-700"
                          aria-label="Modifier"
                        >
                          <Pencil size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
