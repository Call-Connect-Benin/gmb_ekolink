"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreHorizontal } from "lucide-react";

/**
 * Menu d'actions de ligne rendu via un portal (position: fixed) pour échapper au
 * rognage du conteneur `overflow-x-auto` des tableaux. S'ouvre vers le haut quand
 * il manque de place en bas (dernières lignes). `children` reçoit `close`.
 */
export default function RowMenu({
  label,
  width = 208,
  children,
}: {
  label: string;
  width?: number;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; up: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const up = spaceBelow < 280; // pas assez de place en bas → ouvre vers le haut
      setPos({
        top: up ? r.top - 4 : r.bottom + 4,
        left: Math.max(8, Math.min(r.right - width, window.innerWidth - width - 8)),
        up,
      });
    }
    setOpen((v) => !v);
  };

  // Toute modification de scroll/resize invaliderait la position fixe → on ferme.
  useEffect(() => {
    if (!open) return;
    const onMove = () => setOpen(false);
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        aria-label={label}
        className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
      >
        <MoreHorizontal className="size-4" />
      </button>

      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[1190]" onClick={close} />
          <div
            className="fixed z-[1200] overflow-hidden rounded-xl border border-border bg-white py-1 text-sm shadow-lg"
            style={{ top: pos.top, left: pos.left, width, transform: pos.up ? "translateY(-100%)" : undefined }}
          >
            {children(close)}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
