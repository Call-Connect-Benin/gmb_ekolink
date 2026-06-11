// Sérialisation CSV correcte : échappe les guillemets/points-virgules/sauts de ligne
// et préfixe un BOM UTF-8 pour qu'Excel reconnaisse l'encodage et l'accentuation.

const BOM = "﻿";

/** Échappe une cellule : entoure de guillemets si elle contient ; " saut de ligne. */
function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[";\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Construit un CSV (séparateur « ; », sauts de ligne CRLF, BOM en tête). */
export function toCsv(header: string[], rows: unknown[][]): string {
  const lines = [header, ...rows].map((r) => r.map(cell).join(";"));
  return BOM + lines.join("\r\n");
}
