import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ContactForm } from "@/components/engagement/contact-form";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Une question, une suggestion ? Contactez l'équipe Atlas.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "Contact" }]} />
        <h1 className="font-display text-4xl font-semibold">Contactez-nous</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Une question, une suggestion ou une correction ? Écrivez-nous, nous
          répondons sous 48 h.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
