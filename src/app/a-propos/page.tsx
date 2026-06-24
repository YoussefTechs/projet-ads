import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { StaticPage } from "@/components/content/static-page";

export const metadata = buildMetadata({
  title: "À propos",
  description: `Découvrez la mission d'${siteConfig.name} : rendre le voyage accessible à tous.`,
  path: "/a-propos",
});

export default function AboutPage() {
  return (
    <StaticPage title={`À propos d'${siteConfig.name}`}>
      <p>
        {siteConfig.name} est né d'une conviction simple : préparer un voyage
        devrait être aussi excitant que le voyage lui-même.
      </p>
      <h2>Notre mission</h2>
      <p>
        Rassembler au même endroit toutes les informations dont vous avez besoin
        — destinations, lieux, hébergements, conseils pratiques — dans une
        expérience rapide, élégante et fiable.
      </p>
      <h2>Nos valeurs</h2>
      <ul>
        <li>
          <strong>Fiabilité</strong> : des contenus vérifiés et à jour.
        </li>
        <li>
          <strong>Clarté</strong> : l'information utile, sans superflu.
        </li>
        <li>
          <strong>Accessibilité</strong> : un site rapide et utilisable par tous.
        </li>
      </ul>
      <p>
        Merci de faire partie de l'aventure. Bon voyage ! 🌍
      </p>
    </StaticPage>
  );
}
