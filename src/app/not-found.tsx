import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { paths } from "@/lib/url";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl font-semibold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">
        Cette page s'est perdue en route
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        La page que vous cherchez n'existe pas ou a été déplacée. Explorez plutôt
        nos destinations !
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Retour à l'accueil
        </Link>
        <Link
          href={paths.destinations()}
          className={buttonVariants({ variant: "outline" })}
        >
          Explorer les destinations
        </Link>
      </div>
    </div>
  );
}
