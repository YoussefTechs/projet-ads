import { buildMetadata } from "@/lib/seo";
import { StaticPage } from "@/components/content/static-page";

export const metadata = buildMetadata({
  title: "Politique de cookies",
  description: "Quels cookies utilise Atlas et comment les gérer.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <StaticPage title="Politique de cookies" lastUpdated="24 juin 2026">
      <p>Notre site utilise différents types de cookies :</p>
      <h2>Cookies essentiels</h2>
      <p>
        Nécessaires au fonctionnement du site (authentification, préférences).
        Ils ne nécessitent pas de consentement.
      </p>
      <h2>Cookies de mesure d'audience</h2>
      <p>
        Nous aident à comprendre l'utilisation du site (Google Analytics), de
        façon anonymisée.
      </p>
      <h2>Cookies publicitaires</h2>
      <p>
        Utilisés par Google AdSense pour afficher des publicités. Ils ne sont
        déposés qu'avec votre consentement.
      </p>
      <h2>Gérer vos préférences</h2>
      <p>
        Vous pouvez modifier vos choix à tout moment via le bandeau de
        consentement ou les paramètres de votre navigateur.
      </p>
    </StaticPage>
  );
}
