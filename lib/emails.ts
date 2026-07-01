import "server-only";

/** Gabarits HTML des emails transactionnels (FR). Style inline pour compat. clients mail. */

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://gmb.ekolink.dev";

function euros(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(amount);
}

/** "Titre — Ville", sans dupliquer la ville si le titre la contient déjà. */
function ficheLabel(title?: string | null, city?: string | null, fallback = ""): string {
  const t = (title ?? "").trim();
  const c = (city ?? "").trim();
  if (t && c && !t.toLowerCase().includes(c.toLowerCase())) return `${t} — ${c}`;
  return t || c || fallback;
}

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f6fb;font-family:Segoe UI,Arial,sans-serif;color:#1a2233">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="text-align:center;padding:8px 0 20px"><span style="font-size:20px;font-weight:800;color:#2563eb">EkoLink</span></div>
    <div style="background:#fff;border:1px solid #e6eaf2;border-radius:14px;padding:28px">
      <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3">${title}</h1>
      ${body}
    </div>
    <p style="text-align:center;color:#8a94a6;font-size:12px;margin:18px 0 0">
      EkoLink — Fiches Google Business optimisées · <a href="${SITE}" style="color:#2563eb;text-decoration:none">${SITE.replace(/^https?:\/\//, "")}</a>
    </p>
  </div></body></html>`;
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:10px">${label}</a>`;

/** Email envoyé à l'acheteur après un paiement confirmé. */
export function buyerConfirmationEmail(p: {
  name?: string | null;
  listingTitle?: string | null;
  city?: string | null;
  amount: number;
}): { subject: string; html: string } {
  const hello = p.name ? `Bonjour ${p.name},` : "Bonjour,";
  const fiche = ficheLabel(p.listingTitle, p.city, "votre fiche Google Business");
  const subject = `Achat confirmé — ${p.listingTitle ?? "votre fiche Google Business"}`;
  const html = layout("Merci, votre achat est confirmé", `
    <p style="margin:0 0 14px">${hello}</p>
    <p style="margin:0 0 14px">Nous avons bien reçu votre paiement de <strong>${euros(p.amount)}</strong> pour :</p>
    <p style="margin:0 0 18px;padding:12px 14px;background:#f4f6fb;border-radius:10px;font-weight:600">${fiche}</p>
    <p style="margin:0 0 14px">Notre équipe prépare dès maintenant le <strong>transfert de la fiche</strong> vers votre compte Google. Vous recevrez la procédure de revendication par email très prochainement.</p>
    <p style="margin:0 0 22px">Vous pouvez suivre l'état de votre commande dans votre espace :</p>
    <p style="margin:0 0 8px">${btn(`${SITE}/compte`, "Suivre ma commande")}</p>
    <p style="margin:22px 0 0;color:#6b7280;font-size:13px">Une question ? Répondez simplement à cet email.</p>
  `);
  return { subject, html };
}

/** Email d'alerte envoyé à l'équipe EkoMedia à chaque nouvelle vente. */
export function teamSaleAlertEmail(p: {
  listingTitle?: string | null;
  city?: string | null;
  buyerEmail?: string | null;
  amount: number;
  orderId?: string;
}): { subject: string; html: string } {
  const fiche = ficheLabel(p.listingTitle, p.city, "(fiche inconnue)");
  const subject = `Nouvelle vente — ${p.listingTitle ?? "fiche"} (${euros(p.amount)})`;
  const html = layout("Nouvelle vente à traiter", `
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#6b7280">Fiche</td><td style="padding:6px 0;text-align:right;font-weight:600">${fiche}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Montant</td><td style="padding:6px 0;text-align:right;font-weight:600">${euros(p.amount)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280">Acheteur</td><td style="padding:6px 0;text-align:right;font-weight:600">${p.buyerEmail ?? "—"}</td></tr>
      ${p.orderId ? `<tr><td style="padding:6px 0;color:#6b7280">Commande</td><td style="padding:6px 0;text-align:right;font-family:monospace">${p.orderId}</td></tr>` : ""}
    </table>
    <p style="margin:20px 0 8px">${btn(`${SITE}/admin/commandes`, "Ouvrir le back-office")}</p>
    <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Pensez à contacter l'acheteur pour organiser le transfert de la fiche.</p>
  `);
  return { subject, html };
}
