import Link from "next/link";
import { Compass } from "lucide-react";
import { footerNav, siteConfig } from "@/config/site";
import { NewsletterForm } from "@/components/engagement/newsletter-form";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-ink-950 text-ink-300">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold text-white">
              <Compass className="text-brand-400" aria-hidden />
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink-400">
              {siteConfig.description}
            </p>
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium text-white">
                Recevez nos meilleures idées de voyage
              </p>
              <NewsletterForm />
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h2 className="mb-3 text-sm font-semibold text-white">
                {col.title}
              </h2>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-ink-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-6 text-sm text-ink-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <a href={siteConfig.social.twitter} className="hover:text-white">
              Twitter
            </a>
            <a href={siteConfig.social.instagram} className="hover:text-white">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
