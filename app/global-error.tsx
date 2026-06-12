"use client";

// global-error remplace le layout racine : pas de next-intl ni de CSS global
// disponible ici → styles inline et texte en français (locale par défaut).
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "linear-gradient(160deg, #0b1119, #0a1a33)",
          color: "#fff",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <p style={{ color: "#f59e0b", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 13, margin: 0 }}>
            Erreur critique
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "12px 0" }}>Une erreur est survenue</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: 0 }}>
            Un incident technique a interrompu le chargement. Réessayez, ou contactez-nous à contact@ekolink.fr si le problème persiste.
          </p>
          {error?.digest && (
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 8 }}>Référence : {error.digest}</p>
          )}
          <button
            onClick={() => unstable_retry()}
            style={{
              marginTop: 24,
              background: "#1a73e8",
              color: "#fff",
              border: 0,
              borderRadius: 12,
              padding: "12px 24px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
