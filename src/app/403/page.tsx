import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { buttonVariants } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "Accès refusé",
  description: "Vous n'avez pas les droits pour accéder à cette page.",
  path: "/403",
  noindex: true,
});

export default function ForbiddenPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-red-100 text-red-600">
        <ShieldAlert size={32} />
      </div>
      <p className="font-display text-6xl font-semibold text-red-600">403</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Accès refusé</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
        Cette zone est réservée aux administrateurs.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Retour à l'accueil
        </Link>
        <Link href="/compte" className={buttonVariants({ variant: "outline" })}>
          Mon compte
        </Link>
      </div>
    </div>
  );
}
