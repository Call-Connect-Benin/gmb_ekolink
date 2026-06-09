import AdminShell from "../components/dashboard/AdminShell";

// Auth réactivée en fin de chantier (espace ouvert pendant l'intégration).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
