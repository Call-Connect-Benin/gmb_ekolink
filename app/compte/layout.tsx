import ClientShell from "../components/dashboard/ClientShell";

// Auth réactivée en fin de chantier (espace ouvert pendant l'intégration).
export default function CompteLayout({ children }: { children: React.ReactNode }) {
  return <ClientShell>{children}</ClientShell>;
}
