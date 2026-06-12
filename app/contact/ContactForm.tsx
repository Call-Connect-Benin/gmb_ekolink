"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { submitContactAction } from "./actions";

type Errors = Record<string, string>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const telRe = /^[+\d][\d\s.\-()]{6,}$/;

type TFunc = (key: string, values?: Record<string, string | number>) => string;

function validate(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, tf: TFunc): string {
  const v = (el.value || "").trim();
  const required = (el as HTMLInputElement).required;
  if (el instanceof HTMLInputElement && el.type === "checkbox") {
    if (required && !el.checked) return tf("errCheckbox");
    return "";
  }
  if (required && v.length === 0) return tf("errRequired");
  if (el instanceof HTMLInputElement && el.type === "email" && v && !emailRe.test(v))
    return tf("errEmail");
  if (el instanceof HTMLInputElement && el.type === "tel" && v && !telRe.test(v))
    return tf("errTel");
  const min = el.dataset.minLength ? parseInt(el.dataset.minLength, 10) : 0;
  if (min && v.length < min) return tf("errMin", { min });
  return "";
}

const ErrorMsg = ({ msg }: { msg?: string }) =>
  msg ? <span className="text-xs text-destructive">{msg}</span> : null;

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ kind: "success" | "error"; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const setFieldError = (name: string, msg: string) => setErrors((e) => ({ ...e, [name]: msg }));

  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const el = e.target;
    if (el.value || (el as HTMLInputElement).required) setFieldError(el.name, validate(el, t));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const hp = form.elements.namedItem("website") as HTMLInputElement | null;
    if (hp && hp.value.length > 0) {
      setStatus({ kind: "success", msg: t("statusHp") });
      form.reset();
      return;
    }

    const fields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input,textarea,select")
    ).filter((f) => f.type !== "hidden" && f.name !== "website");

    const newErrors: Errors = {};
    let ok = true;
    fields.forEach((f) => {
      const msg = validate(f, t);
      if (msg) ok = false;
      newErrors[f.name] = msg;
    });
    setErrors(newErrors);
    if (!ok) {
      setStatus({ kind: "error", msg: t("statusFix") });
      fields.find((f) => newErrors[f.name])?.focus();
      return;
    }

    setSubmitting(true);
    try {
      // E6 — soumission serveur réelle (table contacts + notification équipe).
      await submitContactAction(new FormData(form));
      setStatus({ kind: "success", msg: t("statusSuccess") });
      form.reset();
    } catch {
      setStatus({ kind: "error", msg: t("statusError") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <form id="contact-form" noValidate ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold">{t("title")}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstname">{t("firstname")} *</Label>
              <Input id="firstname" name="firstname" type="text" required autoComplete="given-name" maxLength={60} onBlur={onBlur} />
              <ErrorMsg msg={errors.firstname} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname">{t("lastname")} *</Label>
              <Input id="lastname" name="lastname" type="text" required autoComplete="family-name" maxLength={60} onBlur={onBlur} />
              <ErrorMsg msg={errors.lastname} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")} *</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" maxLength={120} onBlur={onBlur} />
              <ErrorMsg msg={errors.email} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={20} placeholder="+33 6 12 34 56 78" onBlur={onBlur} />
              <ErrorMsg msg={errors.phone} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company">{t("company")}</Label>
            <Input id="company" name="company" type="text" autoComplete="organization" maxLength={120} onBlur={onBlur} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">{t("subject")} *</Label>
            <Select id="subject" name="subject" required onBlur={onBlur} defaultValue="">
              <option value="">{t("chooseSubject")}</option>
              <option value="commande-fiche">{t("subjOrder")}</option>
              <option value="info-tarifs">{t("subjPricing")}</option>
              <option value="support">{t("subjSupport")}</option>
              <option value="partenariat">{t("subjPartner")}</option>
              <option value="presse">{t("subjPress")}</option>
              <option value="autre">{t("subjOther")}</option>
            </Select>
            <ErrorMsg msg={errors.subject} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">{t("message")} *</Label>
            <Textarea id="message" name="message" required data-min-length="20" maxLength={2000} rows={6} placeholder={t("messagePlaceholder")} onBlur={onBlur} />
            <span className="text-xs text-muted-foreground">{t("messageHint")}</span>
            <ErrorMsg msg={errors.message} />
          </div>

          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website">Ne pas remplir</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-2">
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="consent" required onBlur={onBlur} className="mt-1" />
              <span>
                {t("consentPre")}
                <a href="/politique-confidentialite" className="text-primary hover:underline">{t("consentLink")}</a>{t("consentPost")}
              </span>
            </label>
            <ErrorMsg msg={errors.consent} />
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" size="lg" className="w-fit" disabled={submitting}>
              {submitting ? t("submitting") : t("submit")} {!submitting && <Send className="size-4" />}
            </Button>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3.5" /> {t("encrypted")}
            </p>
          </div>

          {status && (
            <p className={`rounded-md px-3 py-2 text-sm ${status.kind === "success" ? "bg-success/10 text-[color:var(--success)]" : "bg-destructive/10 text-destructive"}`} role="status" aria-live="polite">
              {status.msg}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
