"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lock, Eye, EyeOff } from "lucide-react";

/** Champ mot de passe avec œil pour afficher / masquer la saisie. */
export default function PasswordInput({
  name,
  placeholder,
  autoComplete,
  className,
  value,
  onChange,
  required,
  minLength,
}: {
  name?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  minLength?: number;
}) {
  const t = useTranslations("auth");
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        suppressHydrationWarning
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        minLength={minLength}
        className={
          className ??
          "h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        }
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t("hidePassword") : t("showPassword")}
        title={show ? t("hidePassword") : t("showPassword")}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
      >
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
