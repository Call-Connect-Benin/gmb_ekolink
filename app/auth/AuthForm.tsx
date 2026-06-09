"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONFIGURED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const nextUrl = () =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next")
      : null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!CONFIGURED) {
      setError(t("errNotConfigured"));
      return;
    }
    setLoading(true);
    const sb = createClient();
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        if (data.session) {
          router.push(nextUrl() || "/fiches-google");
          router.refresh();
        } else {
          setInfo(t("accountCreated"));
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(nextUrl() || "/compte");
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setError("");
    if (!CONFIGURED) {
      setError(t("errNotConfigured"));
      return;
    }
    const sb = createClient();
    const next = nextUrl() || (mode === "signup" ? "/fiches-google" : "/compte");
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
  };

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold">
            {isSignup ? t("signupTitle") : t("signinTitle")}
          </CardTitle>
          <CardDescription>
            {isSignup ? t("signupSub") : t("signinSub")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {!CONFIGURED && (
            <p className="rounded-md border border-dashed border-amber-400 bg-amber-50 p-3 text-sm text-amber-800">
              <strong className="block">{t("backendTitle")}</strong>
              {t("backendText")}
            </p>
          )}

          <Button type="button" variant="outline" onClick={onGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.3 5.2C41.4 36.2 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z" />
            </svg>
            {t("google")}
          </Button>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            {t("orEmail")}
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {isSignup && (
              <div className="grid gap-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" placeholder={t("namePlaceholder")} />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignup ? "new-password" : "current-password"} />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-md bg-success/10 px-3 py-2 text-sm text-[color:var(--success)]" role="status">
                {info}
              </p>
            )}

            <Button type="submit" size="lg" disabled={loading}>
              {loading ? t("wait") : isSignup ? t("createAccount") : t("signin")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>{t("haveAccount")} <Link href="/connexion" className="text-primary hover:underline">{t("signin")}</Link></>
            ) : (
              <>{t("noAccount")} <Link href="/inscription" className="text-primary hover:underline">{t("createAccount")}</Link></>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
