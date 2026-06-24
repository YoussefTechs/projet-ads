import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getResource } from "@/lib/admin/resources";
import {
  getRecord,
  loadResourceOptions,
  recordPublicPath,
  requireAdminAccess,
} from "@/server/admin-data";
import { ResourceForm } from "@/components/admin/resource-form";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  await requireAdminAccess();
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const [record, options] = await Promise.all([
    getRecord(resource, id),
    loadResourceOptions(resource),
  ]);
  if (!record) notFound();

  // Recharge avec relations parentes pour construire l'URL publique.
  const publicPath = recordPublicPath(resource.model, record);

  return (
    <div>
      <Link
        href={`/admin/${key}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} /> {resource.label}
      </Link>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Modifier : {record[resource.titleField]}
      </h1>
      <ResourceForm
        resource={resource}
        record={record}
        options={options}
        publicPath={publicPath}
      />
    </div>
  );
}
