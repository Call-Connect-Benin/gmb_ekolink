"use client";

import { usePathname } from "next/navigation";

/**
 * Affiche la chrome publique (Header / Footer / boutons flottants) sur le site
 * vitrine, mais la masque sur les espaces applicatifs plein écran (admin,
 * compte, connexion) qui ont leur propre shell.
 */
export default function SiteChrome({
  header,
  footer,
  floating,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  floating: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const bare =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/compte") ||
    pathname === "/connexion" ||
    pathname === "/inscription" ||
    pathname === "/mot-de-passe-oublie" ||
    pathname.startsWith("/reset");

  if (bare) return <>{children}</>;

  return (
    <>
      {header}
      {children}
      {footer}
      {floating}
    </>
  );
}
