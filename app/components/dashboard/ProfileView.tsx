import { getCurrentProfile } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import ProfileTabs from "./ProfileTabs";

/** Page « Mon profil » partagée entre l'espace acheteur et l'espace admin. */
export default async function ProfileView() {
  const t = await getTranslations("dash.profile");
  const locale = await getLocale();
  const loc = locale === "en" ? "en-US" : "fr-FR";

  const p = await getCurrentProfile();
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();

  const fullName = p?.full_name ?? "";
  const [prenom, ...rest] = fullName.split(" ");
  const nom = rest.join(" ");
  const since = p?.created_at ? new Date(p.created_at).toLocaleDateString(loc, { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const lastSignin = user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString(loc, { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
  const isStaff = p?.role === "admin" || p?.role === "super_admin";

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <ProfileTabs
        firstName={prenom || ""}
        lastName={nom}
        email={p?.email ?? ""}
        phone={p?.phone ?? ""}
        avatarUrl={p?.avatar_url ?? ""}
        role={p?.role ?? "buyer"}
        since={since}
        lastSignin={lastSignin}
        isStaff={isStaff}
      />
    </div>
  );
}
