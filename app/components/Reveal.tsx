import { type ElementType, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  className?: string;
  children?: ReactNode;
} & Record<string, unknown>;

/**
 * Animation d'entrée légère (fade + montée), TOUJOURS visible à l'état final.
 * Aucun masquage persistant : le contenu reste fiable au rendu et en capture.
 */
export default function Reveal({
  as,
  delay = 0,
  className = "",
  children,
  ...rest
}: RevealProps) {
  const Tag = (as || "div") as ElementType;
  const style: CSSProperties | undefined = delay
    ? { animationDelay: `${delay}ms` }
    : undefined;
  return (
    <Tag
      style={style}
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-2 duration-700 fill-mode-both",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
