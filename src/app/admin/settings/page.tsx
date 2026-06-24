import { Check, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { requireAdminAccess } from "@/server/admin-data";

export const dynamic = "force-dynamic";

function StatusRow({ label, ok, value }: { label: string; ok: boolean; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="font-medium">{label}</span>
      <span className="flex items-center gap-2 text-sm">
        {value && <span className="text-muted-foreground">{value}</span>}
        {ok ? (
          <Check size={18} className="text-green-600" />
        ) : (
          <X size={18} className="text-muted-foreground" />
        )}
      </span>
    </div>
  );
}

export default async function AdminSettingsPage() {
  await requireAdminAccess(true);

  const integrations = [
    { label: "Administrateur principal (ADMIN_EMAIL)", ok: Boolean(process.env.ADMIN_EMAIL), value: process.env.ADMIN_EMAIL },
    { label: "Google OAuth", ok: Boolean(process.env.AUTH_GOOGLE_ID) },
    { label: "Google AdSense", ok: Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT) },
    { label: "Google Analytics", ok: Boolean(process.env.NEXT_PUBLIC_GA_ID) },
    { label: "Google Search Console", ok: Boolean(process.env.NEXT_PUBLIC_GSC_VERIFICATION) },
    { label: "Génération IA (ANTHROPIC_API_KEY)", ok: Boolean(process.env.ANTHROPIC_API_KEY) },
  ];

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-semibold">Réglages</h1>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-2 font-semibold">Site</h2>
        <p className="text-sm text-muted-foreground">
          Nom : <strong>{siteConfig.name}</strong> · URL :{" "}
          <strong>{siteConfig.url}</strong>
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="mb-3 font-semibold">Intégrations</h2>
        <div>
          {integrations.map((i) => (
            <StatusRow key={i.label} label={i.label} ok={i.ok} value={i.value ?? undefined} />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Ces intégrations s'activent via les variables d'environnement (voir
          <code className="mx-1 rounded bg-muted px-1">.env.example</code>). Aucune
          modification de code n'est nécessaire.
        </p>
      </div>
    </div>
  );
}
