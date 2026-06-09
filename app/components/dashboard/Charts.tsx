import { cn } from "@/lib/utils";

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

/** Courbe avec aire dégradée, points et axes. */
export function LineChart({
  series,
  labels,
  height = 220,
  max,
  yTicks = 5,
  showDots = true,
  className,
}: {
  series: { color: string; points: number[] }[];
  labels: string[];
  height?: number;
  max?: number;
  yTicks?: number;
  showDots?: boolean;
  className?: string;
}) {
  const W = 760;
  const H = height;
  const padL = 44;
  const padB = 26;
  const padT = 12;
  const padR = 12;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const allVals = series.flatMap((s) => s.points);
  const top = max ?? Math.max(1, ...allVals);
  const n = labels.length;
  const x = (i: number) => padL + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW);
  const y = (v: number) => padT + plotH - (v / top) * plotH;
  const uid = series.map((s) => s.color.replace(/[^a-z0-9]/gi, "")).join("");

  const linePath = (pts: number[]) => pts.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const areaPath = (pts: number[]) =>
    `${linePath(pts)} L${x(pts.length - 1)},${padT + plotH} L${x(0)},${padT + plotH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} role="img">
      <defs>
        {series.map((s, si) => (
          <linearGradient key={si} id={`grad-${uid}-${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {/* grille + axe Y */}
      {Array.from({ length: yTicks + 1 }).map((_, i) => {
        const v = (top / yTicks) * (yTicks - i);
        const yy = padT + (plotH / yTicks) * i;
        return (
          <g key={i}>
            <line x1={padL} y1={yy} x2={W - padR} y2={yy} stroke="var(--border)" strokeWidth="1" />
            <text x={padL - 8} y={yy + 3} textAnchor="end" className="fill-muted-foreground text-[10px]">
              {v >= 1000 ? `${Math.round(v / 1000)}k` : Math.round(v)}
            </text>
          </g>
        );
      })}
      {/* aire (1re série) */}
      <path d={areaPath(series[0].points)} fill={`url(#grad-${uid}-0)`} />
      {/* lignes */}
      {series.map((s, si) => (
        <path key={si} d={linePath(s.points)} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* points */}
      {showDots &&
        series.map((s, si) =>
          s.points.map((v, i) => <circle key={`${si}-${i}`} cx={x(i)} cy={y(v)} r="3.5" fill="#fff" stroke={s.color} strokeWidth="2" />)
        )}
      {/* labels X */}
      {labels.map((l, i) => (
        <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="fill-muted-foreground text-[10px]">
          {l}
        </text>
      ))}
    </svg>
  );
}

/** Petite courbe d'aire pour les cartes stat. */
export function Sparkline({ points, color = "#1a73e8", className }: { points: number[]; color?: string; className?: string }) {
  const W = 120;
  const H = 40;
  const top = Math.max(1, ...points);
  const min = Math.min(...points);
  const span = top - min || 1;
  const x = (i: number) => (i / (points.length - 1)) * W;
  const y = (v: number) => H - 2 - ((v - min) / span) * (H - 6);
  const line = points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("h-10 w-full", className)} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Barre de progression libellée (répartitions horizontales). */
export function MeterBar({
  label,
  value,
  total,
  color = "#1a73e8",
  right,
}: {
  label: string;
  value: number;
  total: number;
  color?: string;
  right?: string;
}) {
  const pct = Math.min(100, Math.round((value / (total || 1)) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-foreground/80">{label}</span>
        <span className="font-semibold">{right ?? `${value.toLocaleString("fr-FR")} (${pct}%)`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
