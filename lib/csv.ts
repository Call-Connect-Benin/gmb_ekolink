// Sérialisation CSV correcte : échappe les guillemets/points-virgules/sauts de ligne
// et préfixe un BOM UTF-8 pour qu'Excel reconnaisse l'encodage et l'accentuation.

const BOM = "﻿";

/** Échappe une cellule + neutralise l'injection de formules (CSV injection). */
function cell(v: unknown): string {
  let s = v == null ? "" : String(v);
  // E4 — une valeur commençant par = + - @ (ou tab/CR) peut s'exécuter à
  // l'ouverture dans Excel/Sheets : on la préfixe d'une apostrophe.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[";\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Construit un CSV (séparateur « ; », sauts de ligne CRLF, BOM en tête). */
export function toCsv(header: string[], rows: unknown[][]): string {
  const lines = [header, ...rows].map((r) => r.map(cell).join(";"));
  return BOM + lines.join("\r\n");
}
