import "server-only";
import nodemailer from "nodemailer";

/**
 * Envoi d'emails transactionnels via SMTP (Brevo).
 * Best-effort : ne fait rien si le SMTP n'est pas configuré, et n'échoue jamais
 * bruyamment (on ne veut pas casser un paiement parce qu'un email n'est pas parti).
 *
 * Variables d'environnement attendues (.env.local + Vercel) :
 *   SMTP_HOST   = smtp-relay.brevo.com
 *   SMTP_PORT   = 587
 *   SMTP_USER   = <identifiant SMTP Brevo (souvent un email @smtp-brevo.com)>
 *   SMTP_PASS   = <clé SMTP Brevo>
 *   MAIL_FROM   = "EkoLink <contact@ekolink.dev>"   (expéditeur, domaine vérifié Brevo)
 *   TEAM_EMAIL  = contact@ekolink.fr                (destinataire des alertes ventes)
 */

const HOST = process.env.SMTP_HOST;
const PORT = Number(process.env.SMTP_PORT || 587);
const USER = process.env.SMTP_USER;
const PASS = process.env.SMTP_PASS;
const FROM = process.env.MAIL_FROM || "EkoLink <contact@ekolink.dev>";

export function isMailConfigured(): boolean {
  return Boolean(HOST && USER && PASS);
}

let cached: nodemailer.Transporter | null = null;
function transporter(): nodemailer.Transporter {
  if (!cached) {
    cached = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: USER, pass: PASS },
    });
  }
  return cached;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!isMailConfigured()) return false;
  try {
    await transporter().sendMail({ from: FROM, ...opts });
    return true;
  } catch (e) {
    // best-effort : on log sans interrompre le flux appelant (webhook Stripe, etc.)
    console.error("[mail] envoi échoué:", e instanceof Error ? e.message : e);
    return false;
  }
}
