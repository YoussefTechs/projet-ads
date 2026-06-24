import Link from "next/link";
import Image from "next/image";
import { Compass } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Mise en page « split-screen » des pages d'authentification. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Panneau image (desktop) */}
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=70"
          alt="Voyage"
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="font-display text-3xl font-semibold">
            Préparez vos plus beaux voyages
          </h2>
          <p className="mt-2 text-white/85">
            Enregistrez vos destinations favorites et retrouvez-les partout.
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2 font-display text-xl font-semibold">
            <Compass className="text-brand-600" /> {siteConfig.name}
          </Link>
          <h1 className="font-display text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1.5 text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
