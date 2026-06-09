import { Camera, Plus, CalendarDays, User, ShieldCheck, Mail, Phone, CheckCircle2, KeyRound, MapPin, CreditCard, Trash2 } from "lucide-react";
import { Panel, PanelHeader, Avatar, Pill, QuickAction } from "../../components/dashboard/ui";
import { EmptyMini } from "../../components/dashboard/list";
import { getCurrentProfile } from "@/lib/queries";
import { getTranslations, getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mon profil", robots: { index: false, follow: false } };

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="grid gap-1.5"><label className="text-xs font-semibold text-foreground/80">{label}</label><div className="flex h-10 items-center rounded-lg border border-border bg-background px-3 text-sm">{value || <span className="text-muted-foreground">—</span>}</div></div>
);

export default async function MonProfil() {
  const t = await getTranslations("dash.profile");
  const locale = await getLocale();
  const TABS = t.raw("tabs") as string[];
  const p = await getCurrentProfile();
  const fullName = p?.full_name ?? "";
  const [prenom, ...rest] = fullName.split(" ");
  const nom = rest.join(" ");
  const email = p?.email ?? "";
  const phone = p?.phone ?? "";
  const since = p?.created_at ? new Date(p.created_at).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="flex gap-6 overflow-x-auto border-b border-border">
        {TABS.map((tab, i) => <button key={tab} className={`shrink-0 border-b-2 pb-3 text-sm font-semibold ${i === 0 ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{tab}</button>)}
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <Panel>
            <h2 className="mb-4 font-bold">{t("personalInfo")}</h2>
            <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
              <div className="flex flex-col items-center gap-2">
                <div className="relative"><Avatar name={fullName || email || t("myAccount")} size={88} /><span className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-2 border-white bg-primary text-white"><Camera className="size-3.5" /></span></div>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary"><Camera className="size-3.5" /> {t("editPhoto")}</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t("firstName")} value={prenom || ""} />
                <Field label={t("lastName")} value={nom} />
                <Field label={t("email")} value={email} />
                <Field label={t("phone")} value={phone} />
                <div className="flex items-end justify-end sm:col-span-2"><button className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">{t("save")}</button></div>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelHeader title={t("myAddresses")} action={<button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-primary hover:bg-secondary"><Plus className="size-4" /> {t("addAddress")}</button>} />
            <EmptyMini label={t("noAddress")} />
          </Panel>

          <Panel>
            <PanelHeader title={t("paymentMethods")} action={<button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-semibold text-primary hover:bg-secondary"><Plus className="size-4" /> {t("addCard")}</button>} />
            <EmptyMini label={t("noPayment")} />
          </Panel>
        </div>

        <aside className="space-y-5">
          <Panel>
            <PanelHeader title={t("accountSummary")} />
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-2.5"><CalendarDays className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("memberSince")}</span><span className="ml-auto font-semibold">{since}</span></li>
              <li className="flex items-center gap-2.5"><User className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("accountType")}</span><span className="ml-auto font-semibold">{p?.role === "admin" ? t("admin") : t("buyer")}</span></li>
              <li className="flex items-center gap-2.5"><ShieldCheck className="size-4 text-muted-foreground" /><span className="text-muted-foreground">{t("status")}</span><span className="ml-auto">{p ? <Pill tone="green">{t("active")}</Pill> : <Pill tone="gray">{t("notConnected")}</Pill>}</span></li>
              {email && <li className="flex items-center gap-2.5"><Mail className="size-4 text-muted-foreground" /><div className="flex-1"><p className="text-foreground/80">{t("email")}</p><p className="text-xs text-muted-foreground">{email}</p></div><CheckCircle2 className="size-5 text-success" /></li>}
              {phone && <li className="flex items-center gap-2.5"><Phone className="size-4 text-muted-foreground" /><div className="flex-1"><p className="text-foreground/80">{t("phone")}</p><p className="text-xs text-muted-foreground">{phone}</p></div><CheckCircle2 className="size-5 text-success" /></li>}
            </ul>
          </Panel>
          <Panel>
            <PanelHeader title={t("quickActions")} />
            <div className="flex flex-col gap-1">
              <QuickAction icon={KeyRound} tone="blue" label={t("changePassword")} />
              <QuickAction icon={MapPin} tone="purple" label={t("manageAddresses")} />
              <QuickAction icon={CreditCard} tone="teal" label={t("managePayments")} />
              <QuickAction icon={Trash2} tone="red" label={t("deleteAccount")} />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
