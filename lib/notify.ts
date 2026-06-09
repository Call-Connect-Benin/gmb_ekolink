/**
 * Notifie n8n (emails transactionnels + notification équipe — CDC §3.4).
 * Ne fait rien si N8N_WEBHOOK_URL n'est pas défini, et n'interrompt jamais le flux.
 */
export async function notifyN8n(
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...payload, sentAt: new Date().toISOString() }),
    });
  } catch {
    // best-effort : on n'interrompt pas le paiement si n8n est indisponible
  }
}
