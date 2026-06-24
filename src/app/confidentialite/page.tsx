import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StaticPage } from "@/components/content/static-page";

export const metadata = buildMetadata({
  title: "Politique de confidentialité",
  description: `Comment ${siteConfig.name} collecte et protège vos données personnelles (RGPD).`,
  path: "/confidentialite",
});

export default function PrivacyPage() {
  return (
    <StaticPage title="Politique de confidentialité" lastUpdated="24 juin 2026">
      <p>
        Chez {siteConfig.name}, nous accordons une grande importance à la
        protection de vos données personnelles, conformément au RGPD.
      </p>
      <h2>Données collectées</h2>
      <ul>
        <li>Données de compte : nom, adresse e-mail.</li>
        <li>Données d'usage : favoris, commentaires.</li>
        <li>Données techniques : cookies, statistiques de navigation.</li>
      </ul>
      <h2>Utilisation des données</h2>
      <p>
        Vos données servent à fournir le service (compte, favoris), à améliorer
        le site et, avec votre consentement, à afficher des publicités
        pertinentes.
      </p>
      <h2>Publicité et cookies</h2>
      <p>
        Nous utilisons Google AdSense et des outils de mesure d'audience. Le
        dépôt de cookies publicitaires est soumis à votre consentement (Consent
        Mode v2). Voir notre politique cookies.
      </p>
      <h2>Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification et de suppression de
        vos données. Vous pouvez supprimer votre compte à tout moment depuis vos
        paramètres.
      </p>
    </StaticPage>
  );
}
