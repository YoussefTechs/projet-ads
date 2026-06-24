import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getResource } from "@/lib/admin/resources";
import { loadResourceOptions, requireAdminAccess } from "@/server/admin-data";
import { ResourceForm } from "@/components/admin/resource-form";

export const dynamic = "force-dynamic";

export default async function NewResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  await requireAdminAccess();
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const options = await loadResourceOptions(resource);

  return (
    <div>
      <Link
        href={`/admin/${key}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} /> {resource.label}
      </Link>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Nouveau : {resource.singular}
      </h1>
      <ResourceForm
        resource={resource}
        record={null}
        options={options}
        publicPath={null}
      />
    </div>
  );
}
