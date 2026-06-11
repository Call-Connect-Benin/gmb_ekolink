"use client";

/* eslint-disable @next/next/no-img-element */
import { useActionState, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Camera, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProfileAction, uploadAvatarAction } from "./profileActions";

export default function ProfileForm({
  firstName,
  lastName,
  email,
  phone,
  avatarUrl,
}: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}) {
  const t = useTranslations("dash.profile");
  const initials = ((firstName[0] || "") + (lastName[0] || "") || email[0] || "?").toUpperCase();
  const fieldCls = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary";

  const avatarFormRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [state, formAction] = useActionState(updateProfileAction, null);

  return (
    <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
      {/* Photo de profil : formulaire dédié, soumis automatiquement au choix du fichier. */}
      <form ref={avatarFormRef} action={uploadAvatarAction} className="flex flex-col items-center gap-2">
        <input
          ref={fileRef}
          name="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={() => {
            if (fileRef.current?.files?.length) {
              setUploading(true);
              avatarFormRef.current?.requestSubmit();
            }
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative"
          aria-label={t("editPhoto")}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={t("editPhoto")} className="size-[88px] rounded-full object-cover" />
          ) : (
            <span className="flex size-[88px] items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">{initials}</span>
          )}
          <span className="absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-2 border-white bg-primary text-white">
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Camera className="size-3.5" />}
          </span>
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-60"
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Camera className="size-3.5" />} {t("editPhoto")}
        </button>
      </form>

      <form action={formAction} className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-foreground/80">{t("firstName")}</label>
          <input name="firstName" type="text" defaultValue={firstName} autoComplete="given-name" className={fieldCls} />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-foreground/80">{t("lastName")}</label>
          <input name="lastName" type="text" defaultValue={lastName} autoComplete="family-name" className={fieldCls} />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-foreground/80">{t("email")}</label>
          <input type="email" value={email} disabled readOnly className={`${fieldCls} cursor-not-allowed bg-secondary text-muted-foreground`} />
        </div>
        <div className="grid gap-1.5">
          <label className="text-xs font-semibold text-foreground/80">{t("phone")}</label>
          <input name="phone" type="tel" defaultValue={phone} autoComplete="tel" placeholder="+33 6 12 34 56 78" className={fieldCls} />
        </div>
        <div className="flex items-center justify-end gap-3 sm:col-span-2">
          {state?.ok && <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-success"><CheckCircle2 className="size-4" /> {t("saved")}</span>}
          {state?.error && <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-destructive"><AlertCircle className="size-4" /> {t("saveError")}</span>}
          <button type="submit" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90">{t("save")}</button>
        </div>
      </form>
    </div>
  );
}
