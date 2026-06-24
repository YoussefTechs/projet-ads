import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StaticPage } from "@/components/content/static-page";

export const metadata = buildMetadata({
  title: "Conditions générales d'utilisation",
  description: `Conditions générales d'utilisation du site ${siteConfig.name}.`,
  path: "/conditions-generales",
});

export default function TermsPage() {
  return (
    <StaticPage title="Conditions générales d'utilisation" lastUpdated="24 juin 2026">
      <h2>Objet</h2>
      <p>
        Les présentes conditions régissent l'utilisation du site {siteConfig.name}
        et de ses services (consultation, compte, favoris, commentaires).
      </p>
      <h2>Compte utilisateur</h2>
      <p>
        Vous êtes responsable de la confidentialité de vos identifiants et de
        l'exactitude des informations fournies.
      </p>
      <h2>Contenu des utilisateurs</h2>
      <p>
        Les commentaires publiés doivent respecter la loi et la courtoisie. Nous
        modérons les contenus et nous réservons le droit de les supprimer.
      </p>
      <h2>Responsabilité</h2>
      <p>
        Les informations de voyage sont fournies à titre indicatif. Vérifiez
        toujours les informations officielles (visa, sécurité) avant de partir.
      </p>
    </StaticPage>
  );
}
