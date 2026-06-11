/* eslint-disable react/no-unescaped-entities */

import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { getLocale } from "next-intl/server";
import ArticleSidebar from "@/app/components/ArticleSidebar";
import BackToBlog from "@/app/components/BackToBlog";
import ArticleCta from "@/app/components/ArticleCta";

export const metadata: Metadata = {
  title: "Pourquoi Google supprime vos avis (et comment l'éviter)",
  description:
    "Comprendre les critères de l'algorithme anti-avis-frauduleux de Google et appliquer les bonnes pratiques pour préserver tous vos avis légitimes.",
  alternates: { canonical: "/blog/avis-google-supprimes" },
  openGraph: { images: ["/assets/images/cover-avis-supprimes.png"] },
};

export default async function ArticleAvisSupprimes() {
  const en = (await getLocale()) === "en";

  return (
    <main id="main">
      <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#ffffff_55%,#f4f8ff_100%)] pb-12 pt-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-[-6rem] top-10 hidden h-80 w-80 rounded-full bg-[radial-gradient(circle,#e3edff,transparent_60%)] lg:block" />
          <div className="absolute bottom-[-4rem] left-[-5rem] hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,#fff1dc,transparent_62%)] lg:block" />
        </div>
        <div className="relative mx-auto max-w-[1180px] px-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <Lightbulb className="size-3.5" /> {en ? "Tutorial" : "Tutoriel"}
          </span>
          <h1 className="mt-4 max-w-[880px] text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight">{en ? "Why Google removes your reviews (and how to avoid it)" : "Pourquoi Google supprime vos avis (et comment l'éviter)"}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{en ? "Google's anti-fraud review algorithm causes a lot of collateral damage. Understanding its criteria lets you preserve all your legitimate reviews." : "L'algorithme anti-avis-frauduleux de Google fait beaucoup de dégâts collatéraux. Comprendre ses critères vous permet de préserver tous vos avis légitimes."}</p>
          <p className="mt-4 text-sm text-muted-foreground">{en ? "May 10, 2026 · 6 min read · By " : "10 mai 2026 · 6 min de lecture · Par "}<strong className="text-foreground">EkoLink</strong></p>
        </div>
      </section>

      <figure className="article-cover">
        <picture>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/cover-avis-supprimes.png" alt="" width={1200} height={675} loading="eager" decoding="async" />
        </picture>
      </figure>

      <div className="mx-auto max-w-[1180px] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="page-content !mx-0 !max-w-none">
            {en ? (
              <>
                <h2>The problem: legitimate reviews that disappear</h2>
                <p>You received a nice 5-star review this morning. By the evening, it's gone. You did nothing — it's Google's algorithm that removed it automatically, without notice. This phenomenon affects <strong>about 15% of reviews</strong> posted on poorly configured Google Business listings.</p>

                <h2>The 6 signals that trigger a removal</h2>
                <h3>1. Incomplete Google profile of the author</h3>
                <p>A review posted from a Google account with no photo, no full first name, no history of other reviews, is immediately suspicious to the algorithm. The "emptier" the profile, the more fragile the review.</p>
                <h3>2. Several reviews from the same IP address</h3>
                <p>If you ask your customers to write their review from your Wi-Fi (at the counter), Google detects that all the reviews come from the same IP. It's the #1 cause of mass removals.</p>
                <h3>3. Vocabulary or structure that is too similar</h3>
                <p>Reviews that look alike ("Excellent! I recommend.") or that contain the same keywords as your SEO description are flagged as "written by the owner".</p>
                <h3>4. Reviews posted too close together in time</h3>
                <p>Receiving 10 five-star reviews within the same hour is suspicious. Google expects a natural distribution over time.</p>
                <h3>5. NAP inconsistency of your listing</h3>
                <p>If your name/address/phone is not consistent across Google, your website and directories, your trust signals are low. The algorithm becomes stricter about moderating reviews.</p>
                <h3>6. Reviews edited after publication</h3>
                <p>When an author edits their review (adds text, changes the rating), Google re-evaluates. It's often at that moment that the removal happens.</p>

                <ArticleCta />

                <h2>The 5 best practices to preserve reviews</h2>
                <ul>
                  <li><strong>Diversify the sources</strong>: ask customers to post <em>from home</em>, not from your Wi-Fi. A QR code on the bottom of the receipt or a post-visit email works very well.</li>
                  <li><strong>100% consistent NAP</strong> across all your online presence points.</li>
                  <li><strong>Reply to all reviews</strong> within 48h. A review with an owner reply is less likely to be removed.</li>
                  <li><strong>Avoid cliché phrasing</strong> in reviews. Ask customers to write spontaneously, not to copy a template.</li>
                  <li><strong>Spread out the requests</strong> over time: 1 to 3 new reviews per week maximum.</li>
                </ul>

                <h2>Recovering a removed review: possible?</h2>
                <p>For reviews that are genuinely legitimate but wrongly removed, you can file a <strong>review request</strong> via the <a href="https://support.google.com/business/gethelp" target="_blank" rel="noopener noreferrer">Google Business Help Center</a>. The restoration rate is about 30%, with a 5- to 20-business-day turnaround.</p>
              </>
            ) : (
              <>
                <h2>Le problème : des avis légitimes qui disparaissent</h2>
                <p>Vous avez reçu un bel avis 5 étoiles ce matin. Le soir, il n'est plus là. Vous n'avez rien fait — c'est l'algorithme de Google qui l'a supprimé automatiquement, sans préavis. Ce phénomène touche <strong>environ 15 % des avis</strong> postés sur les fiches Google Business mal configurées.</p>

                <h2>Les 6 signaux qui déclenchent une suppression</h2>
                <h3>1. Profil Google de l'auteur incomplet</h3>
                <p>Un avis posté depuis un compte Google sans photo, sans prénom complet, sans historique d'autres avis, est immédiatement suspect aux yeux de l'algorithme. Plus le profil est « vide », plus l'avis sera fragile.</p>
                <h3>2. Plusieurs avis depuis la même adresse IP</h3>
                <p>Si vous demandez à vos clients d'écrire leur avis depuis votre Wi-Fi (en caisse), Google détecte que tous les avis viennent de la même IP. C'est la cause #1 de suppressions massives.</p>
                <h3>3. Vocabulaire ou structure trop similaires</h3>
                <p>Les avis qui se ressemblent (« Excellent ! Je recommande. ») ou qui contiennent les mêmes mots-clés que votre description SEO sont flagués comme « écrits par le propriétaire ».</p>
                <h3>4. Avis postés trop rapprochés dans le temps</h3>
                <p>Recevoir 10 avis 5 étoiles dans la même heure est suspect. Google attend une distribution naturelle dans le temps.</p>
                <h3>5. Incohérence NAP de votre fiche</h3>
                <p>Si votre nom/adresse/téléphone n'est pas cohérent entre Google, votre site et les annuaires, vos signaux de confiance sont bas. L'algorithme devient plus strict sur la modération des avis.</p>
                <h3>6. Avis modifiés post-publication</h3>
                <p>Quand un auteur modifie son avis (ajoute du texte, change la note), Google ré-évalue. C'est souvent à ce moment que la suppression tombe.</p>

                <ArticleCta />

                <h2>Les 5 bonnes pratiques pour préserver les avis</h2>
                <ul>
                  <li><strong>Diversifier les sources</strong> : demander aux clients de poster <em>depuis chez eux</em>, pas depuis votre Wi-Fi. Un QR code sur la note de bas de carte ou un email post-visite marche très bien.</li>
                  <li><strong>NAP cohérent à 100 %</strong> sur tous vos points de présence en ligne.</li>
                  <li><strong>Répondre à tous les avis</strong> sous 48 h. Un avis avec une réponse du propriétaire est moins susceptible d'être supprimé.</li>
                  <li><strong>Éviter les formules-clichés</strong> dans les avis. Demander aux clients d'écrire spontanément, pas de copier un template.</li>
                  <li><strong>Étaler les demandes</strong> dans le temps : 1 à 3 avis nouveaux par semaine maximum.</li>
                </ul>

                <h2>Récupérer un avis supprimé : possible ?</h2>
                <p>Pour les avis effectivement légitimes mais supprimés à tort, vous pouvez faire une <strong>demande de réexamen</strong> via la <a href="https://support.google.com/business/gethelp" target="_blank" rel="noopener noreferrer">Google Business Help Center</a>. Le taux de restauration est d'environ 30 %, et le délai 5 à 20 jours ouvrés.</p>
              </>
            )}
            <BackToBlog />
          </article>

          <ArticleSidebar />
        </div>
      </div>
    </main>
  );
}
