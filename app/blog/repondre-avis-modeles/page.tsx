/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */

import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { getLocale } from "next-intl/server";
import ArticleSidebar from "@/app/components/ArticleSidebar";
import BackToBlog from "@/app/components/BackToBlog";
import ArticleCta from "@/app/components/ArticleCta";

export const metadata: Metadata = {
  title: "Répondre aux avis Google : 20 modèles à copier-coller",
  description:
    "Avis positifs, neutres, négatifs ou diffamants : 20 modèles de réponses testés en agence pour montrer un service client exemplaire et améliorer votre SEO local.",
  alternates: { canonical: "/blog/repondre-avis-modeles" },
};

export default async function ArticleRepondreAvis() {
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
            <MessageSquare className="size-3.5" /> {en ? "Tutorial" : "Tutoriel"}
          </span>
          <h1 className="mt-4 max-w-[880px] text-[clamp(2rem,4.4vw,3.2rem)] font-extrabold leading-[1.08] tracking-tight">{en ? "Replying to Google reviews: 20 copy-paste templates" : "Répondre aux avis Google : 20 modèles à copier-coller"}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{en ? "Positive, neutral, negative or defamatory reviews: our agency-tested templates to show exemplary customer service." : "Avis positifs, neutres, négatifs ou diffamants : nos modèles testés en agence pour montrer un service client exemplaire."}</p>
          <p className="mt-4 text-sm text-muted-foreground">{en ? "April 2, 2026 · 7 min read · By " : "2 avril 2026 · 7 min de lecture · Par "}<strong className="text-foreground">EkoLink</strong></p>
        </div>
      </section>

      <figure className="article-cover">
        <picture>
          <img src="/assets/images/cover-repondre-avis.png" alt="" width={1200} height={675} loading="eager" decoding="async" />
        </picture>
      </figure>

      <div className="mx-auto max-w-[1180px] px-5 pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="page-content !mx-0 !max-w-none">
            {en ? (
              <>
                <h2>Why reply to ALL reviews</h2>
                <p>Replying to a review is not just politeness: it's a <strong>direct SEO signal</strong>. According to Google, listings where 100% of reviews have a reply rank on average <strong>4.2% higher</strong> than those with none. That's the equivalent of gaining 1 to 2 positions in the Local Pack.</p>
                <p>Beyond SEO, your reply is read by <strong>89% of future prospects</strong> before getting in touch. A well-worded reply turns an average review into a sales argument.</p>

                <h2>Golden rules for an effective reply</h2>
                <ul>
                  <li><strong>Reply within 48h</strong> — beyond that, the SEO effect drops by 60%</li>
                  <li><strong>Personalize</strong> — mention the customer's first name if visible, refer to their order/visit</li>
                  <li><strong>Include 1 local keyword</strong> from your listing (e.g. "our bakery in the 14<sup>th</sup>")</li>
                  <li><strong>120-200 characters</strong> ideally — enough to personalize, not too long to stay readable</li>
                  <li><strong>Never a defensive argument</strong> on negative reviews — to prospects, the customer is always right</li>
                </ul>

                <h2>5-star reviews (positive) — 5 templates</h2>
                <ol>
                  <li>"Thank you so much [First name] for this feedback, it means a lot to us! We look forward to seeing you again soon at [your business] in [city]."</li>
                  <li>"[First name], thank you for these stars! It's with customers like you that this job makes full sense. See you very soon."</li>
                  <li>"What a joy to read your message [First name]! We'll share your feedback with the whole team. Thank you for trusting us."</li>
                  <li>"A thousand thanks [First name]! Your support motivates us to keep offering the best. Can't wait to welcome you again."</li>
                  <li>"A big thank you [First name] for this testimonial. All the best, and feel free to come see us again at [address]."</li>
                </ol>

                <h2>4-star reviews (positive with a nuance) — 5 templates</h2>
                <ol>
                  <li>"Thank you [First name] for this feedback! Could you tell us what could have earned the 5<sup>th</sup> star? Your feedback helps us improve."</li>
                  <li>"Thank you [First name]. If anything could be improved, write to us at contact@... — we'll pay attention to it."</li>
                  <li>"Glad you enjoyed the experience [First name]. We remain at your service to make it perfect next time."</li>
                  <li>"Thank you for your trust [First name]. Our team is working to deliver the 5-star experience — see you very soon!"</li>
                  <li>"[First name], thank you! We're noting your feedback and hope to see you again soon to do even better."</li>
                </ol>

                <ArticleCta />

                <h2>3-star reviews (mixed) — 5 templates</h2>
                <ol>
                  <li>"[First name], thank you for your honesty. We take your feedback very seriously. Could you write to us at contact@... so we can dig into it together?"</li>
                  <li>"Thank you for this feedback [First name]. We're sorry the experience didn't meet expectations. Our team will review it to improve."</li>
                  <li>"[First name], thank you for choosing us despite an imperfect experience. We'd be happy to see you again and prove we can do better."</li>
                  <li>"Thank you for your transparency [First name]. Your remarks are valuable — feel free to ask for [the manager] on your next visit."</li>
                  <li>"Hello [First name], we're sorry about this mixed experience. Could you give us more details at contact@...? We want to understand."</li>
                </ol>

                <h2>1-2 star reviews (negative) — 5 templates</h2>
                <ol>
                  <li>"Hello [First name], we are sincerely sorry. This does not reflect our standards. Could you contact us at contact@... so we can fix this?"</li>
                  <li>"[First name], thank you for taking the time. We deeply regret it. Our [manager] would like to call you — can we talk?"</li>
                  <li>"Dear [First name], we take your feedback to heart. Such an experience is unacceptable and we want to put it right. Email contact@..."</li>
                  <li>"Hello [First name], this incident is rare and we deplore it. We're already working on a fix. Writing to us privately would be valuable: contact@..."</li>
                  <li>"[First name], we understand your disappointment. Our commitment was not met and we apologize. How can we make it up to you?"</li>
                </ol>

                <h2>Special case: defamatory or fake review</h2>
                <p>If the review is <strong>defamatory</strong> (insults, false accusations, malicious competitor), <strong>never</strong> reply publicly in an aggressive way. Follow this procedure:</p>
                <ol>
                  <li>Report the review via the 3 dots <i>"Report as inappropriate"</i></li>
                  <li>Choose the reason (Spam, Conflict of interest, Offensive content, etc.)</li>
                  <li>Wait 5 to 20 days for Google moderation</li>
                  <li>In parallel, reply publicly and briefly: <em>"We have no record of your visit to our establishment. If you are confusing us with another business, feel free to write to us at contact@..."</em></li>
                </ol>

                <div className="info-box info-box--centered">
                  <strong>Custom templates for your business</strong>
                  {" "}EkoLink provides with each listing a kit of 20 templates adapted to your trade (restaurant, doctor, craftsman, B2B...){" "}
                  <Link href="/fiches-google">Order my listing →</Link>
                </div>
              </>
            ) : (
              <>
                <h2>Pourquoi répondre à TOUS les avis</h2>
                <p>Répondre à un avis n'est pas une politesse : c'est un <strong>signal SEO direct</strong>. Selon Google, les fiches dont 100 % des avis ont une réponse rankent en moyenne <strong>4,2 % plus haut</strong> que celles qui n'en ont aucune. C'est l'équivalent de gagner 1 à 2 positions dans le Pack Local.</p>
                <p>Au-delà du SEO, votre réponse est lue par <strong>89 % des futurs prospects</strong> avant de prendre contact. Une réponse bien tournée transforme un avis moyen en argument de vente.</p>

                <h2>Règles d'or pour une réponse efficace</h2>
                <ul>
                  <li><strong>Réponse sous 48 h</strong> — au-delà, l'effet SEO baisse de 60 %</li>
                  <li><strong>Personnaliser</strong> — citer le prénom du client si visible, mentionner sa commande/visite</li>
                  <li><strong>Inclure 1 mot-clé local</strong> de votre fiche (ex. « notre boulangerie du 14<sup>e</sup> »)</li>
                  <li><strong>120-200 caractères</strong> idéalement — assez pour personnaliser, pas trop pour rester lu</li>
                  <li><strong>Jamais d'argumentaire défensif</strong> sur les avis négatifs — l'autre partie regardée a toujours raison aux yeux des prospects</li>
                </ul>

                <h2>Avis 5 étoiles (positifs) — 5 modèles</h2>
                <ol>
                  <li>« Merci infiniment [Prénom] pour ce retour qui nous touche beaucoup ! Au plaisir de vous revoir bientôt dans [votre commerce] à [ville]. »</li>
                  <li>« [Prénom], merci pour ces étoiles ! C'est avec des clients comme vous que ce métier prend tout son sens. À très vite. »</li>
                  <li>« Quelle joie de lire votre message [Prénom] ! Nous allons partager votre retour avec toute l'équipe. Merci de nous faire confiance. »</li>
                  <li>« Mille mercis [Prénom] ! Votre soutien nous motive à continuer d'offrir le meilleur. Hâte de vous accueillir à nouveau. »</li>
                  <li>« Un grand merci [Prénom] pour ce témoignage. Bonne continuation et n'hésitez pas à revenir nous voir au [adresse]. »</li>
                </ol>

                <h2>Avis 4 étoiles (positifs avec nuance) — 5 modèles</h2>
                <ol>
                  <li>« Merci [Prénom] pour ce retour ! Pouvez-vous nous indiquer ce qui aurait pu mériter la 5<sup>e</sup> étoile ? Votre feedback nous aide à progresser. »</li>
                  <li>« Merci [Prénom]. Si quelque chose pouvait être amélioré, écrivez-nous à contact@... — nous y serons attentifs. »</li>
                  <li>« Ravis que l'expérience vous ait plu [Prénom]. Nous restons à votre écoute pour qu'elle soit parfaite la prochaine fois. »</li>
                  <li>« Merci pour votre confiance [Prénom]. Notre équipe travaille à offrir l'expérience 5 étoiles — à très bientôt ! »</li>
                  <li>« [Prénom], merci ! On note vos retours et on espère vous revoir bientôt pour faire encore mieux. »</li>
                </ol>

                <ArticleCta />

                <h2>Avis 3 étoiles (mitigés) — 5 modèles</h2>
                <ol>
                  <li>« [Prénom], merci de votre franchise. Nous prenons votre retour très au sérieux. Pouvez-vous nous écrire à contact@... pour qu'on creuse ensemble ? »</li>
                  <li>« Merci pour ce retour [Prénom]. Nous regrettons que l'expérience n'ait pas été à la hauteur. Notre équipe va analyser pour s'améliorer. »</li>
                  <li>« [Prénom], merci de nous avoir choisis malgré une expérience perfectible. On serait heureux de vous revoir et de vous prouver qu'on peut faire mieux. »</li>
                  <li>« Merci de votre transparence [Prénom]. Vos remarques sont précieuses — n'hésitez pas à demander [le gérant] lors de votre prochaine visite. »</li>
                  <li>« Bonjour [Prénom], nous regrettons cette expérience mitigée. Pouvez-vous nous donner plus de détails à contact@... ? Nous voulons comprendre. »</li>
                </ol>

                <h2>Avis 1-2 étoiles (négatifs) — 5 modèles</h2>
                <ol>
                  <li>« Bonjour [Prénom], nous sommes sincèrement désolés. Cela ne reflète pas nos standards. Pourriez-vous nous contacter à contact@... pour qu'on règle cela ? »</li>
                  <li>« [Prénom], merci d'avoir pris le temps. Nous regrettons profondément. Notre [responsable] souhaite vous appeler — peut-on échanger ? »</li>
                  <li>« Cher [Prénom], nous prenons votre retour très à cœur. Une telle expérience est inacceptable et nous voulons la rectifier. Email à contact@... »</li>
                  <li>« Bonjour [Prénom], cet incident est rare et nous le déplorons. Nous travaillons déjà à corriger. Vous écrire en privé serait précieux : contact@... »</li>
                  <li>« [Prénom], nous comprenons votre déception. Notre engagement n'a pas été tenu et nous nous excusons. Comment pouvons-nous nous rattraper ? »</li>
                </ol>

                <h2>Cas spécifique : avis diffamant ou faux</h2>
                <p>Si l'avis est <strong>diffamatoire</strong> (insultes, fausses accusations, concurrent malveillant), ne répondez <strong>jamais</strong> publiquement de manière agressive. Suivez cette procédure :</p>
                <ol>
                  <li>Signaler l'avis via les 3 points <i>"Signaler comme inapproprié"</i></li>
                  <li>Choisir le motif (Spam, Conflit d'intérêts, Contenu offensant, etc.)</li>
                  <li>Attendre 5 à 20 jours pour la modération Google</li>
                  <li>En parallèle, répondre publiquement et brièvement : <em>« Nous n'avons pas de trace de votre passage dans notre établissement. Si vous nous confondez avec un autre commerce, n'hésitez pas à nous écrire à contact@... »</em></li>
                </ol>

                <div className="info-box info-box--centered">
                  <strong>Modèles personnalisés pour votre activité</strong>
                  {" "}EkoLink fournit avec chaque fiche un kit de 20 modèles adaptés à votre métier (restaurant, médecin, artisan, B2B...){" "}
                  <Link href="/fiches-google">Commander ma fiche →</Link>
                </div>
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
