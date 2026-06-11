import { redirect } from "next/navigation";
import AdminShell from "../components/dashboard/AdminShell";
import { isCurrentUserAdmin, isCurrentUserSuperAdmin, getCurrentProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Espace réservé aux administrateurs : contrôle du rôle à chaque accès.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isCurrentUserAdmin())) {
    redirect("/compte");
  }
  const profile = await getCurrentProfile();
  const isSuperAdmin = await isCurrentUserSuperAdmin();
  const userName = profile?.full_name?.trim() || profile?.email || "Admin";
  const userInitial = userName.charAt(0).toUpperCase() || "A";

  return (
    <AdminShell userName={userName} userInitial={userInitial} userAvatar={profile?.avatar_url ?? ""} isSuperAdmin={isSuperAdmin}>
      {children}
    </AdminShell>
  );
}
