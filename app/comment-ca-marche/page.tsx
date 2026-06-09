import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Clock4,
  Headphones,
  Headset,
  Lock,
  MessageCircleMore,
  Search,
  Send,
  Shield,
  ShieldCheck,
  StoreIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Découvrez comment acheter une fiche Google Business prête à l'emploi en 3 étapes simples : choisissez, payez, recevez et revendiquez.",
  alternates: { canonical: "/comment-ca-marche" },
};

const STEP_IMAGES = ["/assets/steps/choisir.png", "/assets/steps/payer.png", "/assets/steps/recevoir.png"];
const TRUST_ICONS = [CheckCircle2, Lock, Clock3, Headphones, ShieldCheck];
const TRUST_COLORS = ["text-primary", "text-primary", "text-primary", "text-primary", "text-success"];
const WHY_ICONS = [StoreIcon, Shield, Headset, Clock4];
const WHY_COLORS = ["text-primary", "text-success", "text-accent", "text-primary"];
const TIMELINE_ICONS = [Search, CheckCircle2, Send, CheckCircle2];
const TIMELINE_TONES = [
  "border-[#cfe0ff] bg-[#f5f9ff] text-primary shadow-[0_8px_20px_rgba(26,115,232,0.10)]",
  "border-[#cfead7] bg-[#f4fcf6] text-success shadow-[0_8px_20px_rgba(52,168,83,0.10)]",
  "border-[#ffe0b8] bg-[#fff8ef] text-accent shadow-[0_8px_20px_rgba(248,159,27,0.10)]",
  "border-[#cfe0ff] bg-[#f5f9ff] text-primary shadow-[0_8px_20px_rgba(26,115,232,0.10)]",
];
const TIMELINE_LABEL_TONES = ["text-primary", "text-success", "text-accent", "text-primary"];
const CTA_TRUST_ICONS = [Lock, Headphones, Clock3, ShieldCheck];

function SectionTitle({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <h2 className="text-center text-[clamp(1.9rem,3vw,2.8rem)] font-extrabold leading-tight tracking-[-0.03em] text-slate-900">
      {children}
    </h2>
  );
}

export default async function CommentCaMarchePage() {
  const t = await getTranslations("howItWorks");
  const heroSteps = (t.raw("heroSteps") as { title: string; description: string }[]).map((s, i) => ({ ...s, id: i + 1, image: STEP_IMAGES[i] }));
  const trustItems = (t.raw("trust") as { title: string; description: string }[]).map((s, i) => ({ ...s, icon: TRUST_ICONS[i], color: TRUST_COLORS[i] }));
  const processCards = (t.raw("process") as { title: string; description: string }[]).map((s, i) => ({ ...s, id: i + 1, image: STEP_IMAGES[i] }));
  const detailCards = (t.raw("detail") as { title: string; points: string[] }[]).map((s, i) => ({ ...s, id: i + 1, image: STEP_IMAGES[i] }));
  const whyCards = (t.raw("why") as { title: string; description: string }[]).map((s, i) => ({ ...s, icon: WHY_ICONS[i], color: WHY_COLORS[i] }));
  const timeline = (t.raw("timeline") as { title: string; value: string }[]).map((s, i) => ({ ...s, icon: TIMELINE_ICONS[i], tone: TIMELINE_TONES[i], labelTone: TIMELINE_LABEL_TONES[i] }));
  const faqs = t.raw("faq") as { question: string; answer: string }[];
  const ctaTrust = (t.raw("ctaTrust") as { label: string }[]).map((s, i) => ({ ...s, icon: CTA_TRUST_ICONS[i] }));

  return (
    <main
      id="main"
      className="bg-[radial-gradient(circle_at_top,#f5f9ff_0%,#ffffff_42%,#fffdfa_100%)] text-slate-900"
    >
      <section className="relative overflow-hidden pb-10 pt-24 md:pt-28">
        <div className="absolute right-[-6rem] top-12 hidden h-96 w-96 rounded-full bg-[radial-gradient(circle,#dbe9ff_0%,#dbe9ff_45%,transparent_46%)] opacity-90 lg:block" />
        <div className="absolute right-10 top-52 hidden h-28 w-28 rounded-full bg-[linear-gradient(180deg,#ffe4c2,#ffd49f)] lg:block" />
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)] lg:gap-10">
            <div className="max-w-[560px]">
              <h1 className="text-[clamp(2.45rem,5vw,4.4rem)] font-black leading-[0.97] tracking-[-0.05em] text-slate-950">
                {t("h1a")}
                <span className="mt-2 block text-primary">{t("h1b")}</span>
              </h1>
              <p className="mt-5 max-w-[540px] text-lg leading-8 text-slate-600">
                {t("lead")}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/fiches-google"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-base font-extrabold text-white shadow-[0_20px_45px_rgba(26,115,232,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  {t("ctaSee")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-7 text-base font-extrabold text-accent-foreground shadow-[0_20px_45px_rgba(248,159,27,0.22)] transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircleMore className="size-4" />
                  {t("ctaExpert")}
                </Link>
              </div>
            </div>

            <div className="relative rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_30px_80px_rgba(22,34,56,0.10)] backdrop-blur">
              <div className="grid gap-4 md:grid-cols-3">
                {heroSteps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index < heroSteps.length - 1 ? (
                      <div className="absolute right-[-0.9rem] top-1/2 z-10 hidden -translate-y-1/2 text-primary md:block">
                        <ArrowRight className="size-6" />
                      </div>
                    ) : null}
                    <div className="h-full rounded-[1.6rem] border border-slate-100 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(33,47,82,0.08)]">
                      <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#f9fbff,#f2f7ff)] p-3">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={220}
                          height={220}
                          className="mx-auto h-auto w-full max-w-[140px]"
                        />
                      </div>
                      <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em] text-slate-900">
                        {step.id}. {step.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-[#edf1f8] bg-white px-5 py-4 shadow-[0_18px_44px_rgba(30,41,59,0.06)]">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {trustItems.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f7faff,#edf4ff)]">
                    <item.icon className={`size-5 ${item.color}`} />
                  </div>
                  <div className="text-sm leading-5">
                    <p className="font-extrabold text-slate-900">{item.title}</p>
                    <p className="text-slate-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8 pt-6 md:pb-12">
        <div className="mx-auto max-w-[1240px] px-5">
          <SectionTitle>{t("processTitle")}</SectionTitle>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {processCards.map((card, index) => (
              <div key={card.id} className="relative">
                {index < processCards.length - 1 ? (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 text-primary lg:block">
                    <ArrowRight className="size-8" />
                  </div>
                ) : null}
                <article className="h-full rounded-2xl border border-[#e8eef7] bg-white p-4 shadow-[0_22px_60px_rgba(21,37,68,0.06)]">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-primary text-base font-extrabold text-white shadow-[0_10px_26px_rgba(26,115,232,0.24)]">
                    {card.id}
                  </div>
                  <div className="rounded-[1.5rem] bg-[radial-gradient(circle_at_top,#f7fbff,#f3f7fd)] p-4">
                    <Image
                      src={card.image}
                      alt={card.title}
                      width={420}
                      height={320}
                      className="mx-auto h-auto w-full max-w-[250px]"
                    />
                  </div>
                  <h3 className="mt-6 text-[1.75rem] font-extrabold tracking-[-0.04em] text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-7 text-slate-600">
                    {card.description}
                  </p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8 pt-4 md:pb-12">
        <div className="mx-auto max-w-[1240px] px-5">
          <SectionTitle>{t("detailTitle")}</SectionTitle>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {detailCards.map((card) => (
              <article
                key={card.id}
                className="rounded-2xl border border-[#e8eef7] bg-white p-4 shadow-[0_22px_60px_rgba(21,37,68,0.06)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
                      {card.id}
                    </div>
                    <div className="rounded-[1.2rem] bg-[linear-gradient(180deg,#f8fbff,#f0f5ff)] p-3">
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={130}
                        height={130}
                        className="h-auto w-[74px]"
                      />
                    </div>
                  </div>
                  <h3 className="max-w-[220px] text-xl font-extrabold tracking-[-0.03em] text-slate-900">
                    {card.title}
                  </h3>
                </div>

                <ul className="mt-5 space-y-3">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-[15px] leading-6 text-slate-600"
                    >
                      <Check className="mt-1 size-4 shrink-0 text-success" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-10 pt-4 md:pb-14">
        <div className="mx-auto max-w-[1240px] px-5">
          <SectionTitle>{t("whyTitle")}</SectionTitle>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {whyCards.map((card) => (
              <article
                key={card.title}
                className="rounded-[1.25rem] border border-[#e7edf7] bg-white p-4 shadow-[0_14px_34px_rgba(21,37,68,0.05)]"
              >
                <div className="flex items-start gap-3">
                  <card.icon
                    className={`mt-0.5 size-5 shrink-0 ${card.color}`}
                    strokeWidth={1.85}
                  />
                  <h3 className="text-[1.05rem] font-extrabold tracking-[-0.03em] text-slate-950">
                    {card.title}
                  </h3>
                </div>
                <p className="mt-3 text-[13px] leading-6 text-slate-500">
                  {card.description}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[1.35rem] border border-[#f1e7d7] bg-[linear-gradient(180deg,#fffdf8,#fffaf2)] px-4 py-5 shadow-[0_14px_36px_rgba(66,43,3,0.05)] md:px-5 md:py-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-3">
              {timeline.map((item, index) => (
                <article key={item.title} className="relative text-center">
                  {index < timeline.length - 1 ? (
                    <div className="absolute left-[calc(50%+2.1rem)] top-5 hidden h-px w-[calc(100%-1rem)] border-t border-dashed border-[#d9dce3] xl:block" />
                  ) : null}

                  <div
                    className={`mx-auto flex size-10 items-center justify-center rounded-full border ${item.tone}`}
                  >
                    <item.icon className="size-4.5" />
                  </div>

                  <p className="mt-3 text-[13px] font-bold tracking-[-0.02em] text-slate-800">
                    {item.title}
                  </p>

                  <div className="mt-3 flex items-center justify-center">
                    <span
                      className={`inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-extrabold shadow-[0_8px_18px_rgba(15,23,42,0.05)] ${item.labelTone}`}
                    >
                      {item.value}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12 pt-4 md:pb-16">
        <div className="mx-auto max-w-[1240px] px-5">
          <SectionTitle>{t("faqTitle")}</SectionTitle>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[1.4rem] border border-[#e8eef7] bg-white px-6 shadow-[0_18px_48px_rgba(21,37,68,0.05)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold tracking-[-0.02em] text-slate-900 marker:hidden">
                  {faq.question}
                  <ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-[15px] leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14 pt-2">
        <div className="mx-auto max-w-[1240px] px-5">
          <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#081c3b,#0c2a58_58%,#0f3672)] px-6 py-10 text-white shadow-[0_32px_90px_rgba(6,22,48,0.28)] md:px-10 md:py-12">
            <div className="absolute left-6 top-8 hidden h-20 w-20 bg-[radial-gradient(circle,#f89f1b_1.2px,transparent_1.2px)] bg-[length:14px_14px] opacity-40 lg:block" />
            <div className="absolute -right-24 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full border-[36px] border-primary/30 lg:block" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-[460px]">
                <h2 className="text-[clamp(2rem,3vw,3rem)] font-extrabold leading-tight tracking-[-0.04em]">
                  {t("ctaTitle")}
                </h2>
                <p className="mt-4 text-lg leading-8 text-white/74">
                  {t("ctaText")}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/fiches-google"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-base font-extrabold text-white shadow-[0_20px_45px_rgba(26,115,232,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  {t("ctaSee")}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-accent px-7 text-base font-extrabold text-accent-foreground shadow-[0_20px_45px_rgba(248,159,27,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  {t("ctaTalk")}
                  <CheckCheck className="size-4" />
                </Link>
              </div>
            </div>

            <div className="relative mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6">
              {ctaTrust.map((item) => (
                <div
                  key={item.label}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/78"
                >
                  <item.icon className="size-4 text-success" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
