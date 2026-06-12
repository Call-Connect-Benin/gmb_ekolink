import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Anti open-redirect : n'accepte qu'un chemin interne (commence par "/" mais
 * pas "//", qui serait protocol-relative → site externe). Sinon renvoie null.
 */
export function safeNext(raw: string | null | undefined): string | null {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : null;
}
