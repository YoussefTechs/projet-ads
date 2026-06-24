import { Skeleton } from "@/components/ui/skeleton";

/** État de chargement (affiché pendant le rendu des pages dynamiques). */
export default function Loading() {
  return (
    <div className="container-page">
      <Skeleton className="mb-6 h-10 w-2/3 max-w-md" />
      <Skeleton className="mb-10 h-5 w-1/2 max-w-sm" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="mt-3 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
