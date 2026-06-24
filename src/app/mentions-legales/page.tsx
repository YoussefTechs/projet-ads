import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StaticPage } from "@/components/content/static-page";

export const metadata = buildMetadata({
  title: "Mentions légales",
  description: `Mentions légales du site ${siteConfig.name}.`,
  path: "/mentions-legales",
});

export default function LegalPage() {
  return (
    <StaticPage title="Mentions légales" lastUpdated="24 juin 2026">
      <h2>Éditeur du site</h2>
      <p>
        Le site {siteConfig.name} est édité par {siteConfig.name} SAS. Pour toute
        question, contactez-nous via la page de contact.
      </p>
      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par un prestataire d'infrastructure cloud assurant la
        disponibilité et la sécurité des données.
      </p>
      <h2>Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus (textes, images, logos) est protégé par le droit
        d'auteur. Toute reproduction sans autorisation est interdite.
      </p>
      <h2>Responsabilité</h2>
      <p>
        Les informations publiées sont fournies à titre indicatif. Nous nous
        efforçons de les tenir à jour mais ne pouvons garantir leur exactitude à
        tout moment.
      </p>
    </StaticPage>
  );
}
