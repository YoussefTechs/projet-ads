import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

/**
 * Image Open Graph dynamique (1200×630) — cf. PHASE-2-SEO §4.
 * Génère une image de partage cohérente pour chaque page.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? siteConfig.name).slice(0, 110);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f766e 0%, #0d9488 60%, #14b8a6 100%)",
          padding: 72,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 36, fontWeight: 600 }}>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, opacity: 0.9 }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
