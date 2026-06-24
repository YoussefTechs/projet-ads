import { prisma } from "@/lib/db";
import { requireAdminAccess } from "@/server/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminImagesPage() {
  await requireAdminAccess();

  const [cities, countries, articles] = await Promise.all([
    prisma.city.findMany({
      where: { heroImage: { not: null } },
      select: { name: true, heroImage: true },
      take: 24,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.country.findMany({
      where: { heroImage: { not: null } },
      select: { name: true, heroImage: true },
      take: 12,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.article.findMany({
      where: { coverImage: { not: null } },
      select: { title: true, coverImage: true },
      take: 12,
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const images = [
    ...cities.map((c) => ({ src: c.heroImage!, label: c.name })),
    ...countries.map((c) => ({ src: c.heroImage!, label: c.name })),
    ...articles.map((a) => ({ src: a.coverImage!, label: a.title })),
  ];

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-semibold">Images</h1>
      <p className="mb-6 text-muted-foreground">
        Les images sont gérées par URL dans chaque formulaire de contenu (champ
        « Image principale » et « Galerie »). Collez l'URL d'une image hébergée
        (CDN, banque d'images). Bibliothèque actuellement utilisée :
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <figure key={i} className="overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.label}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="truncate p-2 text-xs text-muted-foreground">
              {img.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
