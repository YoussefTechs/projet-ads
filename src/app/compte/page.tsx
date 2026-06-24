import Link from "next/link";
import { Heart, MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Tableau de bord", robots: { index: false } };

export default async function AccountDashboard() {
  const session = await auth();
  const userId = session!.user.id;

  const [favoritesCount, commentsCount] = await Promise.all([
    prisma.favorite.count({ where: { userId } }),
    prisma.comment.count({ where: { authorId: userId } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">
        Bonjour {session!.user.name ?? "voyageur"} 👋
      </h1>
      <p className="mt-2 text-muted-foreground">
        Bienvenue sur votre espace personnel.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link
          href="/compte/favoris"
          className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand-600"
        >
          <Heart className="text-favorite" />
          <p className="mt-3 text-3xl font-semibold">{favoritesCount}</p>
          <p className="text-muted-foreground">Favoris enregistrés</p>
        </Link>
        <Link
          href="/compte/commentaires"
          className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand-600"
        >
          <MessageSquare className="text-brand-600" />
          <p className="mt-3 text-3xl font-semibold">{commentsCount}</p>
          <p className="text-muted-foreground">Commentaires publiés</p>
        </Link>
      </div>
    </div>
  );
}
