"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const AVATARS = ["avatar-thomas", "avatar-elodie", "avatar-marc"];

const Stars = ({ n = 5 }: { n?: number }) => (
  <span className="inline-flex text-[#fbbc04]">
    {Array.from({ length: n }).map((_, i) => <Star key={i} className="size-3.5 fill-current" />)}
  </span>
);

export default function TestimonialsCard() {
  const t = useTranslations("testimonials");
  const TESTIMONIALS = (t.raw("items") as { quote: string; name: string; role: string }[]).map((x, i) => ({ ...x, avatar: AVATARS[i] }));
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = TESTIMONIALS.length;
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(id);
  }, [paused, count]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  };

  const current = TESTIMONIALS[index];

  return (
    <aside
      className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carrousel"
      aria-label={t("aria")}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-extrabold leading-snug">{t("title")}</h3>
        <div className="hidden shrink-0 gap-1 sm:flex">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={t("prev")}
            className="flex size-8 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={t("next")}
            className="flex size-8 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div key={index} className="animate-[fadeIn_0.35s_ease] mt-3">
        <Stars />
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">« {current.quote} »</p>
        <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
          <img src={`/assets/images/${current.avatar}.png`} alt="" className="size-10 rounded-full object-cover" loading="lazy" />
          <div>
            <strong className="block text-sm">{current.name}</strong>
            <span className="text-xs text-muted-foreground">{current.role}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex justify-center gap-1.5 pt-6">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => go(i)}
            aria-label={t("goTo", { n: i + 1 })}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${i === index ? "w-5 bg-primary" : "w-2 bg-border hover:bg-primary/40"}`}
          />
        ))}
      </div>
    </aside>
  );
}
