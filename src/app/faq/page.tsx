import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Faq } from "@/components/ui/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, faqSchema } from "@/lib/json-ld";

export const metadata = buildMetadata({
  title: "Questions fréquentes (FAQ)",
  description: "Toutes les réponses à vos questions sur l'utilisation d'Atlas.",
  path: "/faq",
});

const items = [
  {
    question: "Atlas est-il gratuit ?",
    answer:
      "Oui, la consultation de tous nos guides et fiches destinations est entièrement gratuite.",
  },
  {
    question: "Comment enregistrer mes destinations favorites ?",
    answer:
      "Créez un compte gratuit, puis cliquez sur le cœur présent sur chaque fiche pour l'ajouter à vos favoris.",
  },
  {
    question: "Les informations sont-elles à jour ?",
    answer:
      "Nous actualisons régulièrement nos contenus. La date de dernière mise à jour est indiquée sur chaque guide.",
  },
  {
    question: "Puis-je proposer une correction ?",
    answer:
      "Bien sûr ! Contactez-nous via la page de contact, nous étudierons votre suggestion rapidement.",
  },
  {
    question: "Comment fonctionnent les comparateurs ?",
    answer:
      "Nos comparateurs analysent plusieurs critères (budget, météo, ambiance) pour vous aider à choisir entre deux destinations.",
  },
];

export default function FaqPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-3xl">
        <JsonLd
          data={[
            breadcrumbSchema([
              { name: "Accueil", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]),
            faqSchema(items),
          ]}
        />
        <Breadcrumb items={[{ name: "Accueil", href: "/" }, { name: "FAQ" }]} />
        <h1 className="mb-8 font-display text-4xl font-semibold">
          Questions fréquentes
        </h1>
        <Faq items={items} />
      </div>
    </div>
  );
}
