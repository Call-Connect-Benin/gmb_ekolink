import { redirect } from "next/navigation";
import ClientShell from "../components/dashboard/ClientShell";
import { isCurrentUserAdmin, getCurrentProfile } from "@/lib/queries";

export const dynamic = "force-dynamic";

// Espace acheteur : un admin est renvoyé vers son propre dashboard (/admin).
export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  if (await isCurrentUserAdmin()) {
    redirect("/admin");
  }
  const profile = await getCurrentProfile();
  const userName = profile?.full_name?.trim() || profile?.email || "Mon compte";
  const userInitial = userName.charAt(0).toUpperCase() || "C";
  return (
    <ClientShell userName={userName} userInitial={userInitial} userAvatar={profile?.avatar_url ?? ""}>
      {children}
    </ClientShell>
  );
}
