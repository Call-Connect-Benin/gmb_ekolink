"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { WHATSAPP_URL } from "@/lib/contact";
import {
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  CreditCard,
  LayoutGrid,
  LifeBuoy,
  Mail,
  MapPin,
  MessageCircleMore,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type CategoryId =
  | "all"
  | "payment"
  | "listing"
  | "delivery"
  | "account"
  | "support";

type FaqItem = {
  id: string;
  category: Exclude<CategoryId, "all">;
  question: string;
  answer: string;
};

const TRUST_ICONS = [ShieldCheck, Truck, Smartphone, CheckCircle2];
const TRUST_TONES = [
  "text-primary bg-primary/10",
  "text-accent bg-accent/12",
  "text-primary bg-primary/10",
  "text-success bg-success/10",
];

const CATEGORY_META = [
  { id: "all", icon: LayoutGrid },
  { id: "payment", icon: CreditCard },
  { id: "listing", icon: MapPin },
  { id: "delivery", icon: Send },
  { id: "account", icon: UserRoundCheck },
  { id: "support", icon: LifeBuoy },
] as const satisfies ReadonlyArray<{ id: CategoryId; icon: LucideIcon }>;

const FAQ_META: { id: string; category: Exclude<CategoryId, "all"> }[] = [
  // Fiches Google Business
  { id: "listing-definition", category: "listing" },
  { id: "listing-history", category: "listing" },
  { id: "rename-listing", category: "listing" },
  { id: "listing-optimized", category: "listing" },
  { id: "listing-category-change", category: "listing" },
  // Achat & Paiement
  { id: "purchase-flow", category: "payment" },
  { id: "payment-methods", category: "payment" },
  { id: "payment-security", category: "payment" },
  { id: "invoice", category: "payment" },
  { id: "refund", category: "payment" },
  // Livraison & Transfert
  { id: "delivery-time", category: "delivery" },
  { id: "transfer-process", category: "delivery" },
  { id: "delivery-content", category: "delivery" },
  { id: "transfer-help", category: "delivery" },
  { id: "transfer-duration", category: "delivery" },
  // Compte & Sécurité
  { id: "policy-compliance", category: "account" },
  { id: "account-create", category: "account" },
  { id: "account-data", category: "account" },
  { id: "account-google-safety", category: "account" },
  { id: "account-password", category: "account" },
  // Support & Assistance
  { id: "contact-support", category: "support" },
  { id: "support-hours", category: "support" },
  { id: "support-after-sale", category: "support" },
  { id: "support-custom", category: "support" },
  { id: "support-response-time", category: "support" },
];

function HeroIllustration() {
  return (
    <div className="relative mx-auto hidden h-[320px] w-full max-w-[470px] items-center justify-center lg:flex">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/faq.png"
        alt="Questions fréquentes"
        className="object-contain drop-shadow-[0_24px_60px_rgba(8,22,44,0.45)]"
        style={{ height: "300px", width: "auto", maxWidth: "100%" }}
      />
    </div>
  );
}

export default function FaqClient() {
  const t = useTranslations("faq");
  const trustItems = (t.raw("trust") as { title: string; description: string }[]).map((x, i) => ({ ...x, icon: TRUST_ICONS[i], tone: TRUST_TONES[i] }));
  const categoryLabels = t.raw("categories") as string[];
  const categories = CATEGORY_META.map((c, i) => ({ ...c, label: categoryLabels[i] }));
  const faqs: FaqItem[] = (t.raw("items") as { question: string; answer: string }[]).map((x, i) => ({ ...FAQ_META[i], ...x }));
  const stats = t.raw("stats") as { value: string; label: string }[];
  const popularFaqs = ["purchase-flow", "payment-security", "delivery-time", "refund"]
    .map((id) => faqs.find((f) => f.id === id))
    .filter((x): x is FaqItem => Boolean(x));

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [openId, setOpenId] = useState<string>(faqs[0]?.id ?? "");
  const [showSuggest, setShowSuggest] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const normalizedQuery = query.trim().toLowerCase();

  // Suggestions affichées sous la barre de recherche pendant la saisie.
  const suggestions =
    normalizedQuery.length >= 1
      ? faqs
          .filter((item) => item.question.toLowerCase().includes(normalizedQuery))
          .slice(0, 6)
      : [];

  // Clic sur une suggestion : ouvre la réponse et défile vers la liste.
  const handleSelect = (item: FaqItem) => {
    setSelectedCategory("all");
    setQuery(item.question);
    setOpenId(item.id);
    setShowSuggest(false);
    requestAnimationFrame(() =>
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const haystack = `${item.question} ${item.answer}`.toLowerCase();
    const matchesQuery =
      normalizedQuery.length === 0 || haystack.includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  // Une seule source de vérité : ouvert seulement si openId est non vide ET présent
  // dans la liste filtrée. Fermer (openId = "") ne rouvre donc plus la 1ʳᵉ question.
  const visibleOpenId =
    openId && filteredFaqs.some((item) => item.id === openId) ? openId : "";

  return (
    <main id="main" className="bg-[linear-gradient(180deg,#f7faff,#ffffff_26%)]">
      <section className={`relative bg-[linear-gradient(120deg,#08162c,#0c2244_58%,#0a1d38)] pb-24 pt-26 text-white md:pb-28 md:pt-30 ${showSuggest && normalizedQuery.length >= 1 ? "z-30" : ""}`}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(41,110,255,0.10),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(248,159,27,0.08),transparent_24%)]" />
          <div className="absolute right-10 top-20 hidden h-40 w-28 bg-[radial-gradient(circle,#1d4f97_1.1px,transparent_1.1px)] bg-[length:12px_12px] opacity-35 lg:block" />
          <div className="absolute bottom-0 left-0 right-0 h-22 bg-white [clip-path:ellipse(75%_100%_at_50%_100%)]" />
        </div>

        <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 px-5 lg:grid-cols-[minmax(0,1fr)_470px]">
          <div className="max-w-[620px]">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent">
              {t("badge")}
            </p>
            <h1 className="mt-3 text-[clamp(2.8rem,5vw,5rem)] font-black leading-[0.95] tracking-[-0.05em] text-white">
              {t("h1")}
            </h1>
            <p className="mt-5 max-w-[520px] text-xl leading-9 text-white/76">
              {t("lead")}
            </p>

            <div className="relative mt-9 max-w-[470px]">
              <Search className="absolute left-5 top-7 size-5 -translate-y-1/2 text-white/45" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setShowSuggest(true);
                }}
                onFocus={() => setShowSuggest(true)}
                onBlur={() => setShowSuggest(false)}
                type="search"
                placeholder={t("searchPlaceholder")}
                className="h-14 w-full rounded-2xl border border-white/12 bg-white/7 pl-14 pr-5 text-base text-white outline-none transition placeholder:text-white/42 focus:border-white/24 focus:bg-white/10"
              />

              {showSuggest && normalizedQuery.length >= 1 && (
                <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-2xl border border-[#e8edf6] bg-white py-2 text-slate-900 shadow-[0_24px_60px_rgba(8,22,44,0.4)]">
                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        // onMouseDown (avant le blur) pour que le clic soit pris en compte.
                        onMouseDown={(event) => {
                          event.preventDefault();
                          handleSelect(item);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50"
                      >
                        <Search className="size-4 shrink-0 text-slate-400" />
                        <span className="font-medium">{item.question}</span>
                      </button>
                    ))
                  ) : (
                    <p className="px-4 py-2.5 text-sm text-slate-500">{t("empty")}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <HeroIllustration />
        </div>
      </section>

      <div className="relative mx-auto max-w-[1240px] px-5">
        <section className="-mt-8 grid gap-0 overflow-hidden rounded-[1.9rem] border border-[#e8edf6] bg-white shadow-[0_24px_60px_rgba(17,31,56,0.08)] md:grid-cols-2 xl:grid-cols-4">
          {trustItems.map((item, index) => (
            <div
              key={item.title}
              className={`flex items-center gap-4 px-6 py-6 ${
                index < trustItems.length - 1
                  ? "border-b border-[#eef2f7] xl:border-b-0 xl:border-r"
                  : ""
              }`}
            >
              <div
                className={`flex size-13 shrink-0 items-center justify-center rounded-full ${item.tone}`}
              >
                <item.icon className="size-6" strokeWidth={1.9} />
              </div>
              <div>
                <p className="text-[1.05rem] font-extrabold tracking-[-0.03em] text-slate-900">
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="grid gap-7 py-12 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <div className="rounded-[1.7rem] border border-[#e8edf6] bg-white p-5 shadow-[0_18px_50px_rgba(17,31,56,0.06)]">
              <h2 className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-slate-950">
                {t("categoriesTitle")}
              </h2>
              <div className="mt-5 space-y-2">
                {categories.map((category) => {
                  const active = category.id === selectedCategory;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-bold transition ${
                        active
                          ? "border-primary/15 bg-[linear-gradient(180deg,#f5f9ff,#eef5ff)] text-primary shadow-[inset_3px_0_0_0_#1a73e8]"
                          : "border-transparent text-slate-700 hover:border-[#e8edf6] hover:bg-slate-50"
                      }`}
                    >
                      <category.icon className="size-4.5 shrink-0" strokeWidth={1.9} />
                      {category.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.7rem] border border-[#e8edf6] bg-white p-5 shadow-[0_18px_50px_rgba(17,31,56,0.06)]">
              <h3 className="max-w-[180px] text-[1.15rem] font-extrabold leading-8 tracking-[-0.03em] text-slate-950">
                {t("noAnswerTitle")}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-500">
                {t("noAnswerText")}
              </p>
              <Link
                href="/contact"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-3.5 text-sm font-extrabold text-accent-foreground shadow-[0_14px_34px_rgba(248,159,27,0.24)] transition hover:-translate-y-0.5 hover:bg-accent/92"
              >
                <MessageCircleMore className="size-4" />
                {t("contactUs")}
              </Link>
            </div>

            {/* Questions populaires */}
            <div className="rounded-[1.7rem] border border-[#e8edf6] bg-white p-5 shadow-[0_18px_50px_rgba(17,31,56,0.06)]">
              <h3 className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-slate-950">
                {t("popularTitle")}
              </h3>
              <div className="mt-4 space-y-1">
                {popularFaqs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary"
                  >
                    <CircleHelp className="mt-0.5 size-4.5 shrink-0 text-primary" strokeWidth={1.9} />
                    {item.question}
                  </button>
                ))}
              </div>
            </div>

            {/* Nos garanties */}
            <div className="rounded-[1.7rem] border border-[#e8edf6] bg-white p-5 shadow-[0_18px_50px_rgba(17,31,56,0.06)]">
              <h3 className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-slate-950">
                {t("guaranteesTitle")}
              </h3>
              <div className="mt-4 space-y-4">
                {trustItems.map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className={`flex size-10 shrink-0 items-center justify-center rounded-full ${item.tone}`}>
                      <item.icon className="size-5" strokeWidth={1.9} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold tracking-[-0.02em] text-slate-900">{item.title}</p>
                      <p className="text-xs leading-5 text-slate-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EkoLink en chiffres */}
            <div className="rounded-[1.7rem] border border-[#dceaff] bg-[linear-gradient(170deg,#f5f9ff,#ffffff)] p-5 shadow-[0_18px_50px_rgba(17,31,56,0.06)]">
              <h3 className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-slate-950">
                {t("statsTitle")}
              </h3>
              <div className="mt-4 space-y-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline gap-3">
                    <span className="min-w-[3.2rem] text-xl font-black tracking-[-0.03em] text-primary">{stat.value}</span>
                    <span className="text-sm leading-5 text-slate-600">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div ref={listRef} className="scroll-mt-24">
            <h2 className="text-[clamp(1.8rem,2.4vw,2.5rem)] font-extrabold tracking-[-0.04em] text-slate-950">
              {t("listTitle")}
            </h2>

            <div className="mt-6 overflow-hidden rounded-[1.7rem] border border-[#e8edf6] bg-white shadow-[0_18px_50px_rgba(17,31,56,0.06)]">
              {filteredFaqs.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-lg font-bold text-slate-900">
                    {t("empty")}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {t("emptyHint")}
                  </p>
                </div>
              ) : (
                filteredFaqs.map((item, index) => {
                  const open = item.id === visibleOpenId;
                  return (
                    <div
                      key={item.id}
                      className={index < filteredFaqs.length - 1 ? "border-b border-[#edf1f7]" : ""}
                    >
                      <button
                        type="button"
                      onClick={() =>
                        setOpenId((current) =>
                          current === item.id ? "" : item.id
                        )
                      }
                        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                        aria-expanded={open}
                      >
                        <span
                          className={`text-[1.05rem] font-bold tracking-[-0.025em] ${
                            open ? "text-primary" : "text-slate-900"
                          }`}
                        >
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`size-5 shrink-0 transition-transform ${
                            open
                              ? "rotate-180 text-primary"
                              : "text-slate-400"
                          }`}
                        />
                      </button>

                      <div
                        className="grid transition-all duration-300 ease-out"
                        style={{
                          gridTemplateRows:
                            item.id === visibleOpenId ? "1fr" : "0fr",
                        }}
                      >
                        <div className="overflow-hidden">
                          <div className="px-6 pb-5 text-[15px] leading-8 text-slate-600">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <section className="mb-16 rounded-[1.85rem] border border-[#f1dfc8] bg-[linear-gradient(120deg,#fffaf2,#fff3e2)] px-6 py-7 shadow-[0_20px_55px_rgba(90,53,10,0.06)] md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <Image
                src="/assets/support.png"
                alt="Support EkoLink"
                width={110}
                height={110}
                className="h-auto w-[82px] shrink-0"
              />
              <div>
                <h2 className="text-[1.95rem] font-extrabold tracking-[-0.04em] text-slate-950">
                  {t("supportTitle")}
                </h2>
                <p className="mt-2 max-w-[520px] text-[15px] leading-7 text-slate-600">
                  {t("supportText")}
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap gap-3 md:justify-end">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-13 items-center gap-2 rounded-2xl border border-[#dfe5ef] bg-white px-6 text-sm font-extrabold text-slate-900 transition hover:-translate-y-0.5"
              >
                <MessageCircleMore className="size-4 text-success" />
                {t("whatsapp")}
              </a>
              <Link
                href="/contact"
                className="inline-flex min-h-13 items-center gap-2 rounded-2xl bg-accent px-6 text-sm font-extrabold text-accent-foreground shadow-[0_14px_34px_rgba(248,159,27,0.24)] transition hover:-translate-y-0.5 hover:bg-accent/92"
              >
                <Mail className="size-4" />
                {t("sendEmail")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
