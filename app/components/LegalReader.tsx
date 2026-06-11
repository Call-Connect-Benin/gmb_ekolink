"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type LegalSection = { id: string; label: string; content: React.ReactNode };

/** Lecteur de page légale : sommaire (sidebar) + une section à la fois + navigation. */
export default function LegalReader({
  sections,
  tocTitle,
  prevLabel,
  nextLabel,
}: {
  sections: LegalSection[];
  tocTitle: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [active, setActive] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    if (i < 0 || i > sections.length - 1) return;
    setActive(i);
    // Remet le contenu en haut (scroll interne desktop + scroll page mobile).
    requestAnimationFrame(() => {
      if (articleRef.current) articleRef.current.scrollTop = 0;
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  return (
    <section className="py-8">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 lg:h-[calc(100vh-96px)] lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Sommaire / sidebar — scroll interne */}
        <aside className="lg:min-h-0">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_18px_50px_rgba(17,31,56,0.06)] lg:flex lg:h-full lg:flex-col">
            <h2 className="px-2 pb-3 text-xs font-extrabold uppercase tracking-[0.16em] text-muted-foreground lg:shrink-0">
              {tocTitle}
            </h2>
            <nav className="flex flex-col gap-1 lg:min-h-0 lg:overflow-y-auto lg:pr-1" aria-label={tocTitle}>
              {sections.map((s, i) => {
                const on = i === active;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-current={on ? "true" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                      on
                        ? "bg-[linear-gradient(180deg,#f5f9ff,#eef5ff)] text-primary shadow-[inset_3px_0_0_0_#1a73e8]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${
                        on ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Contenu de la section active — scroll interne, nav épinglée en bas */}
        <div ref={contentRef} className="flex scroll-mt-24 flex-col lg:h-full lg:min-h-0">
          <article
            ref={articleRef}
            className="page-content !mb-0 !max-w-none flex-1 lg:min-h-0 lg:overflow-y-auto"
          >
            {sections[active].content}
          </article>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-5 lg:shrink-0">
            <button
              type="button"
              onClick={() => go(active - 1)}
              disabled={active === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-bold text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" /> {prevLabel}
            </button>

            <span className="text-sm font-semibold text-muted-foreground">
              {active + 1} / {sections.length}
            </span>

            <button
              type="button"
              onClick={() => go(active + 1)}
              disabled={active === sections.length - 1}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-[0_14px_34px_rgba(26,115,232,0.22)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {nextLabel} <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
