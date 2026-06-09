"use client";

import { useEffect, useRef, useState } from "react";

const fmt = (n: number, decimals: number) =>
  n.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Compteur animé déclenché à l'entrée dans le viewport.
 * Reproduit la logique de landing_page/js/animations.js (easeOutQuart).
 */
export default function Counter({
  value,
  decimals = 0,
}: {
  value: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(() => fmt(0, decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setDisplay(fmt(value, decimals));
      return;
    }

    let raf = 0;
    const run = () => {
      const duration = 1600;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
        setDisplay(fmt(value * eased, decimals));
        if (progress < 1) raf = requestAnimationFrame(tick);
        else setDisplay(fmt(value, decimals));
      };
      raf = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            o.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals]);

  return <span ref={ref}>{display}</span>;
}
