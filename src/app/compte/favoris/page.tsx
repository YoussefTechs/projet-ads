import { auth } from "@/auth";
import { getResolvedFavorites } from "@/server/engagement";
import { FavoritesList } from "@/components/account/favorites-list";

export const metadata = { title: "Mes favoris", robots: { index: false } };

export default async function FavoritesPage() {
  const session = await auth();
  const favorites = await getResolvedFavorites(session!.user.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Mes favoris</h1>
      <FavoritesList initial={favorites} />
    </div>
  );
}
