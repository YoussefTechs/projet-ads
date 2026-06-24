import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  const [countries, cities, places, articlesPublished, articlesDraft, pending, users] =
    await Promise.all([
      prisma.country.count(),
      prisma.city.count(),
      prisma.place.count(),
      prisma.article.count({ where: { status: "PUBLISHED" } }),
      prisma.article.count({ where: { status: "DRAFT" } }),
      prisma.comment.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
    ]);

  const stats = [
    { label: "Pays", value: countries },
    { label: "Villes", value: cities },
    { label: "Lieux", value: places },
    { label: "Articles publiés", value: articlesPublished },
    { label: "Brouillons", value: articlesDraft },
    { label: "Commentaires à modérer", value: pending, highlight: pending > 0 },
    { label: "Utilisateurs", value: users },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">
        Tableau de bord
      </h1>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border bg-card p-6 ${
              s.highlight ? "border-accent-400" : "border-border"
            }`}
          >
            <p className="text-3xl font-semibold">{s.value}</p>
            <p className="mt-1 text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
