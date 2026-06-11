/* ============================================================
   Graphiques SVG maison (aucune dépendance externe)
   ============================================================ */

export type Segment = { label: string; value: number; color: string };

/** Donut / anneau avec total au centre. */
export function Donut({
  segments,
  total,
  size = 180,
  thickness = 22,
  centerTop,
  centerBottom = "Total",
}: {
  segments: Segment[];
  total?: number;
  size?: number;
  thickness?: number;
  centerTop?: string;
  centerBottom?: string;
}) {
  const sum = segments.reduce((a, s) => a + s.value, 0) || 1;
  const shown = total ?? sum;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const frac = s.value / sum;
          const len = frac * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold leading-none">{centerTop ?? shown.toLocaleString("fr-FR")}</span>
        <span className="mt-1 text-xs text-muted-foreground">{centerBottom}</span>
      </div>
    </div>
  );
}

/** Légende verticale pour un donut. */
export function Legend({
  segments,
  format,
}: {
  segments: (Segment & { extra?: string })[];
  format?: (s: Segment & { extra?: string }) => string;
}) {
  return (
    <ul className="flex flex-1 flex-col gap-2.5 text-sm">
      {segments.map((s) => (
        <li key={s.label} className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-foreground/80">
            <span className="size-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
          <span className="font-semibold text-foreground">
            {format ? format(s) : (s.extra ?? s.value.toLocaleString("fr-FR"))}
          </span>
        </li>
      ))}
    </ul>
  );
}
