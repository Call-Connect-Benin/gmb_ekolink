import ProfileView from "../../components/dashboard/ProfileView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon profil", robots: { index: false, follow: false } };

export default function MonProfil() {
  return <ProfileView />;
}
