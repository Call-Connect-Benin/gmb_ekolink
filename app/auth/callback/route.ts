import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Échange le code OAuth / lien magique contre une session, puis redirige. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Anti open-redirect : on n'accepte qu'un chemin interne (commençant par "/" mais pas "//").
  const nextParam = searchParams.get("next") || "/compte";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/compte";
  const oauthError = searchParams.get("error_description") || searchParams.get("error");

  // Base d'URL de redirection : NEXT_PUBLIC_SITE_URL en prod, sinon l'origine de la requête.
  const base = process.env.NEXT_PUBLIC_SITE_URL || origin;

  // Erreur renvoyée par le fournisseur (refus, config invalide…).
  if (oauthError) {
    return NextResponse.redirect(`${base}/connexion?error=oauth`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${base}/connexion?error=oauth`);
    }
  }

  return NextResponse.redirect(`${base}${next}`);
}
