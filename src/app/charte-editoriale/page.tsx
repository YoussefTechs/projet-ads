import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StaticPage } from "@/components/content/static-page";

export const metadata = buildMetadata({
  title: "Charte éditoriale",
  description: `Notre méthodologie : comment ${siteConfig.name} produit un contenu fiable et à jour.`,
  path: "/charte-editoriale",
});

export default function EditorialPage() {
  return (
    <StaticPage title="Charte éditoriale" lastUpdated="24 juin 2026">
      <p>
        Notre mission : offrir une information de voyage fiable, claire et
        actualisée. Voici nos engagements.
      </p>
      <h2>Fiabilité</h2>
      <p>
        Nos contenus sont rédigés par des passionnés de voyage et s'appuient sur
        des sources vérifiées. Chaque guide est relu avant publication.
      </p>
      <h2>Indépendance</h2>
      <p>
        Nos recommandations sont indépendantes. Les liens d'affiliation
        éventuels n'influencent pas notre sélection éditoriale et sont signalés.
      </p>
      <h2>Fraîcheur</h2>
      <p>
        Nous indiquons la date de dernière mise à jour et actualisons
        régulièrement nos contenus les plus consultés.
      </p>
      <h2>Transparence</h2>
      <p>
        Nos auteurs sont identifiés. En cas d'erreur, signalez-la nous via la
        page de contact : nous corrigerons rapidement.
      </p>
    </StaticPage>
  );
}
