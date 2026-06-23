export interface ClimateData {
  months: { m: string; t: number; rain: number }[];
}

/** Mini-graphe climat (température par mois) — pour « quand partir ». */
export function ClimateChart({ data }: { data: ClimateData }) {
  const temps = data.months.map((m) => m.t);
  const max = Math.max(...temps, 1);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-end justify-between gap-1.5" aria-hidden>
        {data.months.map((m) => (
          <div key={m.m} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-foreground">{m.t}°</span>
            <div
              className="w-full rounded-t bg-gradient-to-t from-brand-600 to-brand-400"
              style={{ height: `${Math.max(8, (m.t / max) * 120)}px` }}
            />
            <span className="text-[10px] text-muted-foreground">{m.m}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Températures moyennes mensuelles (°C).
      </p>
    </div>
  );
}
