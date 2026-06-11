"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { CalendarDays, User, ShieldCheck, Mail, Phone, CheckCircle2, LogOut, Globe, Clock } from "lucide-react";
import { Panel, PanelHeader, Pill } from "./ui";
import { createClient } from "@/lib/supabase/client";
import LocaleSwitcher from "../LocaleSwitcher";
import ProfileForm from "./ProfileForm";
import ChangePasswordButton from "./ChangePasswordButton";
import DeleteAccountButton from "./DeleteAccountButton";

export default function ProfileTabs({
  firstName,
  lastName,
  email,
  phone,
  avatarUrl,
  role,
  since,
  lastSignin,
  isStaff,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: string;
  since: string;
  lastSignin: string;
  isStaff: boolean;
}) {
  const t = useTranslations("dash.profile");
  const tabs = t.raw("tabs") as string[];
  const [active, setActive] = useState(0);
  const router = useRouter();

  const accountType = role === "super_admin" ? t("superAdmin") : role === "admin" ? t("admin") : t("buyer");

  const signOutAll = async () => {
    const sb = createClient();
    await sb.auth.signOut({ scope: "global" });
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div className="flex gap-6 overflow-x-auto border-b border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(i)}
            className={`shrink-0 border-b-2 pb-3 text-sm font-semibold ${active === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Informations personnelles */}
      {active === 0 && (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <Panel>
              <h2 className="mb-4 font-bold">{t("personalInfo")}</h2>
              <ProfileForm firstName={firstName} lastName={lastName} email={email} phone={phone} avatarUrl={avatarUrl} />
            </Panel>
            {/* MD8 — Adresses & moyens de paiement masqués tant que non implémentés (aucune table associée). */}
          </div>

          <aside className="space-y-5">
            <Panel>
              <PanelHeader title={t("accountSummary")} />
              <ul className="space-y-3.5 text-sm">
                <li className="flex items-center gap-2.5"><CalendarDays className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("memberSince")}</span><span className="ml-auto font-semibold">{since}</span></li>
                <li className="flex items-center gap-2.5"><User className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("accountType")}</span><span className="ml-auto font-semibold">{accountType}</span></li>
                <li className="flex items-center gap-2.5"><ShieldCheck className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("status")}</span><span className="ml-auto"><Pill tone="green">{t("active")}</Pill></span></li>
                {email && <li className="flex items-center gap-2.5"><Mail className="size-4 text-muted-foreground" /><div className="flex-1"><p className="text-foreground/80">{t("email")}</p><p className="text-xs text-muted-foreground">{email}</p></div><CheckCircle2 className="size-5 text-success" /></li>}
                {phone && <li className="flex items-center gap-2.5"><Phone className="size-4 text-muted-foreground" /><div className="flex-1"><p className="text-foreground/80">{t("phone")}</p><p className="text-xs text-muted-foreground">{phone}</p></div><CheckCircle2 className="size-5 text-success" /></li>}
              </ul>
            </Panel>
            <Panel>
              <PanelHeader title={t("quickActions")} />
              <div className="flex flex-col gap-1">
                <ChangePasswordButton />
                {!isStaff && <DeleteAccountButton />}
              </div>
            </Panel>
          </aside>
        </div>
      )}

      {/* Sécurité */}
      {active === 1 && (
        <Panel>
          <PanelHeader title={tabs[1]} />
          <div className="flex max-w-md flex-col gap-1">
            <ChangePasswordButton />
            <button type="button" onClick={signOutAll} className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-secondary">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10"><LogOut className="size-4 text-primary" /></span>
              <span className="flex-1 text-left text-sm font-medium text-foreground/85">{t("secSignOutAll")}</span>
            </button>
          </div>
        </Panel>
      )}

      {/* Préférences */}
      {active === 2 && (
        <Panel>
          <PanelHeader title={tabs[2]} />
          <div className="flex max-w-md items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium"><Globe className="size-4 text-muted-foreground" /> {t("prefLanguage")}</span>
            <LocaleSwitcher />
          </div>
        </Panel>
      )}

      {/* Activité du compte */}
      {active === 3 && (
        <Panel>
          <PanelHeader title={tabs[3]} />
          <ul className="max-w-md space-y-3.5 text-sm">
            <li className="flex items-center gap-2.5"><CalendarDays className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("memberSince")}</span><span className="ml-auto font-semibold">{since}</span></li>
            <li className="flex items-center gap-2.5"><Clock className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("actLastSignin")}</span><span className="ml-auto font-semibold">{lastSignin}</span></li>
            <li className="flex items-center gap-2.5"><Mail className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("email")}</span><span className="ml-auto font-semibold">{email}</span></li>
          </ul>
        </Panel>
      )}
    </>
  );
}
