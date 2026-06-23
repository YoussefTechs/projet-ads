import { type LucideIcon } from "lucide-react";

/** Tuile d'information factuelle (capitale, monnaie, meilleure période…). */
export function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon size={14} aria-hidden />}
        {label}
      </div>
      <div className="mt-1 font-semibold text-foreground">{value || "—"}</div>
    </div>
  );
}

export function InfoTileGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}
