"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Errors = Record<string, string>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const telRe = /^[+\d][\d\s.\-()]{6,}$/;

const PRICES: Record<string, number> = { starter: 149, pro: 299, agence: 599 };
const DELAYS: Record<string, string> = {
  starter: "72h ouvrées",
  pro: "48h ouvrées",
  agence: "48h ouvrées",
};
const LABELS: Record<string, string> = { starter: "Starter", pro: "Pro", agence: "Agence" };
const eur = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

function validateEl(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement): string {
  const v = (el.value || "").trim();
  const required = (el as HTMLInputElement).required;
  if (el instanceof HTMLInputElement && el.type === "checkbox") {
    if (required && !el.checked) return "Vous devez cocher cette case pour continuer.";
    return "";
  }
  if (required && v.length === 0) return "Ce champ est obligatoire.";
  if (el instanceof HTMLInputElement && el.type === "email" && v && !emailRe.test(v))
    return "Veuillez saisir un email valide.";
  if (el instanceof HTMLInputElement && el.type === "tel" && v && !telRe.test(v))
    return "Numéro de téléphone invalide.";
  if (el instanceof HTMLInputElement && el.type === "url" && v) {
    try {
      new URL(v);
    } catch {
      return "URL invalide.";
    }
  }
  return "";
}

export default function CheckoutForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [planError, setPlanError] = useState("");
  const [status, setStatus] = useState<{ kind: "success" | "error"; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* Pré-sélection via ?plan=starter|pro|agence */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("plan");
    if (p && PRICES[p]) setPlan(p);
  }, []);

  const groupClass = (name: string) => `form-group${errors[name] ? " has-error" : ""}`;

  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const el = e.target;
    if (el.value || (el as HTMLInputElement).required)
      setErrors((p) => ({ ...p, [el.name]: validateEl(el) }));
  };

  const validatePanel = (panelId: string): boolean => {
    const form = formRef.current;
    if (!form) return false;
    const panel = form.querySelector<HTMLElement>(`#${panelId}`);
    if (!panel) return true;
    const fields = Array.from(
      panel.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input,textarea,select"
      )
    ).filter((f) => f.type !== "hidden" && !f.classList.contains("form-honeypot-input") && f.type !== "radio");
    const next: Errors = {};
    let ok = true;
    fields.forEach((f) => {
      const msg = validateEl(f);
      if (msg) ok = false;
      next[f.name] = msg;
    });
    setErrors((p) => ({ ...p, ...next }));
    return ok;
  };

  const goTo = (idx: number) => {
    setStep(idx);
    wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    if (step === 0) {
      if (!plan) {
        setPlanError("Veuillez choisir une formule.");
        return;
      }
      setPlanError("");
      goTo(1);
      return;
    }
    if (step === 1) {
      if (!validatePanel("step-2")) return;
      goTo(2);
      return;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const hp = form.elements.namedItem("website_trap") as HTMLInputElement | null;
    if (hp && hp.value.length > 0) {
      setStatus({ kind: "success", msg: "Merci, votre commande a été envoyée." });
      return;
    }

    const okInfos = validatePanel("step-2");
    const okPay = validatePanel("step-3");
    if (!plan) {
      setPlanError("Veuillez choisir une formule.");
      setStatus({ kind: "error", msg: "Merci de corriger les champs en erreur." });
      goTo(0);
      return;
    }
    if (!okInfos) {
      setStatus({ kind: "error", msg: "Merci de corriger les champs en erreur." });
      goTo(1);
      return;
    }
    if (!okPay) {
      setStatus({ kind: "error", msg: "Merci de corriger les champs en erreur." });
      return;
    }

    setSubmitting(true);
    setStatus({ kind: "success", msg: "Préparation de votre commande…" });

    const data: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") data[key] = value;
    });
    const lines = Object.entries(data)
      .filter(([k]) => k !== "website_trap" && k !== "cgv_accept")
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const body = encodeURIComponent(`Nouvelle commande depuis ekolink.dev\n\n${lines}`);
    const mailto = `mailto:contact@ekolink.fr?subject=${encodeURIComponent(
      "Nouvelle commande depuis ekolink.dev"
    )}&body=${body}`;

    await new Promise((r) => setTimeout(r, 600));
    window.location.href = mailto;
    setStatus({
      kind: "success",
      msg: "Votre client mail s'est ouvert pour finaliser. Si rien ne s'est passé, écrivez-nous à contact@ekolink.fr.",
    });
    setSubmitting(false);
  };

  const ttc = plan ? PRICES[plan] : 0;
  const ht = plan ? +(ttc / 1.2).toFixed(2) : 0;
  const tva = plan ? +(ttc - ht).toFixed(2) : 0;

  return (
    <div id="checkout" ref={wrapperRef}>
      <ol className="checkout-steps" aria-label="Étapes de la commande">
        <li className={`checkout-step${step === 0 ? " is-active" : ""}${step > 0 ? " is-done" : ""}`}>
          <span className="num"><span>1</span></span> Formule
        </li>
        <li className={`checkout-divider${step > 0 ? " is-active" : ""}`} aria-hidden="true"></li>
        <li className={`checkout-step${step === 1 ? " is-active" : ""}${step > 1 ? " is-done" : ""}`}>
          <span className="num"><span>2</span></span> Vos infos
        </li>
        <li className={`checkout-divider${step > 1 ? " is-active" : ""}`} aria-hidden="true"></li>
        <li className={`checkout-step${step === 2 ? " is-active" : ""}`}>
          <span className="num"><span>3</span></span> Paiement
        </li>
      </ol>

      <form
        className="checkout-grid"
        id="checkout-form"
        noValidate
        ref={formRef}
        onSubmit={onSubmit}
      >
        <div>
          {/* ÉTAPE 1 : Formule */}
          <div className={`checkout-step-panel form-card${step === 0 ? " is-active" : ""}`} id="step-1">
            <h2>1. Choisissez votre formule</h2>
            <p className="step-lead">Toutes les formules incluent la livraison sous 48h et la garantie 30 jours.</p>

            {[
              { value: "starter", title: "Starter", price: "149 €", badge: null, desc: "Création complète, optimisation SEO de base, livraison 72h, support email 15 jours." },
              { value: "pro", title: "Pro", price: "299 €", badge: "Recommandé", desc: "Tout Starter + 10 photos geo-tagged, 3 Google Posts, 10 Q&R, anti-suppression avis, livraison 48h, support 30 jours." },
              { value: "agence", title: "Agence", price: "599 €", badge: null, desc: "Tout Pro + 5 fiches incluses, dashboard multi-sites, marque blanche, chef de projet dédié, support 90 jours." },
            ].map((p) => (
              <label className="plan-radio" key={p.value}>
                <input
                  type="radio"
                  name="plan"
                  value={p.value}
                  required
                  checked={plan === p.value}
                  onChange={() => {
                    setPlan(p.value);
                    setPlanError("");
                  }}
                />
                <span className="plan-content">
                  <span className="plan-title">
                    {p.title} <span className="plan-price">— {p.price}</span>
                    {p.badge && <span className="plan-badge"> {p.badge}</span>}
                  </span>
                  <span className="plan-desc">{p.desc}</span>
                </span>
              </label>
            ))}
            <span className="error-msg">{planError}</span>

            <div className="form-actions">
              <button type="button" className="btn btn-primary" onClick={next}>
                Continuer
              </button>
            </div>
          </div>

          {/* ÉTAPE 2 : Informations */}
          <div className={`checkout-step-panel form-card${step === 1 ? " is-active" : ""}`} id="step-2">
            <h2>2. Informations de votre établissement</h2>
            <p className="step-lead">Ces données nous permettent de configurer votre fiche Google.</p>

            <div className="form-row">
              <div className={groupClass("firstname")}>
                <label htmlFor="c-firstname">Prénom<span className="req" aria-hidden="true">*</span></label>
                <input id="c-firstname" name="firstname" type="text" required autoComplete="given-name" maxLength={60} onBlur={onBlur} />
                <span className="error-msg">{errors.firstname}</span>
              </div>
              <div className={groupClass("lastname")}>
                <label htmlFor="c-lastname">Nom<span className="req" aria-hidden="true">*</span></label>
                <input id="c-lastname" name="lastname" type="text" required autoComplete="family-name" maxLength={60} onBlur={onBlur} />
                <span className="error-msg">{errors.lastname}</span>
              </div>
            </div>

            <div className="form-row">
              <div className={groupClass("email")}>
                <label htmlFor="c-email">Email<span className="req" aria-hidden="true">*</span></label>
                <input id="c-email" name="email" type="email" required autoComplete="email" maxLength={120} onBlur={onBlur} />
                <span className="error-msg">{errors.email}</span>
              </div>
              <div className={groupClass("phone")}>
                <label htmlFor="c-phone">Téléphone<span className="req" aria-hidden="true">*</span></label>
                <input id="c-phone" name="phone" type="tel" required autoComplete="tel" maxLength={20} placeholder="+33 6 12 34 56 78" onBlur={onBlur} />
                <span className="error-msg">{errors.phone}</span>
              </div>
            </div>

            <div className={groupClass("company")}>
              <label htmlFor="c-company">Nom de l'entreprise<span className="req" aria-hidden="true">*</span></label>
              <input id="c-company" name="company" type="text" required autoComplete="organization" maxLength={120} onBlur={onBlur} />
              <span className="error-msg">{errors.company}</span>
            </div>

            <div className="form-row">
              <div className={groupClass("business_type")}>
                <label htmlFor="c-business-type">Type d'activité<span className="req" aria-hidden="true">*</span></label>
                <select id="c-business-type" name="business_type" required onBlur={onBlur}>
                  <option value="">Choisissez…</option>
                  <option>Commerce / Magasin</option>
                  <option>Restaurant / Café / Hôtel</option>
                  <option>Artisan / Métier manuel</option>
                  <option>Profession libérale (avocat, médecin…)</option>
                  <option>Coach / Consultant</option>
                  <option>Agence / Service B2B</option>
                  <option>Autre</option>
                </select>
                <span className="error-msg">{errors.business_type}</span>
              </div>
              <div className={groupClass("zone")}>
                <label htmlFor="c-zone">Zone d'activité<span className="req" aria-hidden="true">*</span></label>
                <input id="c-zone" name="zone" type="text" required maxLength={120} placeholder="Ex. Paris 14e, Lyon, Bordeaux" onBlur={onBlur} />
                <span className="error-msg">{errors.zone}</span>
              </div>
            </div>

            <div className={groupClass("address")}>
              <label htmlFor="c-address">Adresse de l'établissement</label>
              <input id="c-address" name="address" type="text" maxLength={200} placeholder="Numéro, rue, code postal, ville" onBlur={onBlur} />
              <span className="hint">Optionnel. Indiquez votre adresse uniquement si vous accueillez du public.</span>
              <span className="error-msg">{errors.address}</span>
            </div>

            <div className={groupClass("website_url")}>
              <label htmlFor="c-website">Site web actuel</label>
              <input id="c-website" name="website_url" type="url" maxLength={200} placeholder="https://www.mon-site.fr" onBlur={onBlur} />
              <span className="hint">Optionnel. Nous aligne le NAP entre la fiche et votre site.</span>
              <span className="error-msg">{errors.website_url}</span>
            </div>

            <div className={groupClass("existing_listing")}>
              <label htmlFor="c-existing">Avez-vous déjà une fiche Google ?<span className="req" aria-hidden="true">*</span></label>
              <select id="c-existing" name="existing_listing" required onBlur={onBlur}>
                <option value="">Choisissez…</option>
                <option value="oui-actif">Oui, elle est active</option>
                <option value="oui-suspendue">Oui, mais elle est suspendue</option>
                <option value="non">Non, à créer de zéro</option>
                <option value="ne-sais-pas">Je ne sais pas</option>
              </select>
              <span className="error-msg">{errors.existing_listing}</span>
            </div>

            <div className={groupClass("notes")}>
              <label htmlFor="c-notes">Informations complémentaires</label>
              <textarea id="c-notes" name="notes" maxLength={1000} rows={4} placeholder="Spécialités, mots-clés ciblés, contraintes particulières…"></textarea>
              <span className="error-msg">{errors.notes}</span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => goTo(0)}>Retour</button>
              <button type="button" className="btn btn-primary" onClick={next}>Continuer vers le paiement</button>
            </div>
          </div>

          {/* ÉTAPE 3 : Paiement */}
          <div className={`checkout-step-panel form-card${step === 2 ? " is-active" : ""}`} id="step-3">
            <h2>3. Paiement sécurisé</h2>
            <p className="step-lead">Choisissez votre mode de paiement. Toutes les transactions sont chiffrées (TLS 1.3).</p>

            <div className="payment-options">
              <label className="payment-option">
                <input type="radio" name="payment_method" value="card" required defaultChecked />
                <svg width="32" height="22" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="1" y="1" width="22" height="14" rx="2" /><line x1="1" y1="6" x2="23" y2="6" /></svg>
                <span>Carte bancaire</span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment_method" value="paypal" required />
                <svg width="32" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 11h10M5 7h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>
                <span>PayPal</span>
              </label>
              <label className="payment-option">
                <input type="radio" name="payment_method" value="transfer" required />
                <svg width="32" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>
                <span>Virement</span>
              </label>
            </div>

            <div className="form-honeypot" aria-hidden="true">
              <label htmlFor="c-website-trap">Ne pas remplir</label>
              <input id="c-website-trap" name="website_trap" type="text" tabIndex={-1} autoComplete="off" className="form-honeypot-input" />
            </div>

            <div className={groupClass("cgv_accept")}>
              <label className="form-checkbox">
                <input type="checkbox" name="cgv_accept" required onBlur={onBlur} />
                <span>
                  J'accepte les <Link href="/cgv" target="_blank">conditions générales de vente</Link> et la{" "}
                  <Link href="/politique-confidentialite" target="_blank">politique de confidentialité</Link>.
                  <span className="req" aria-hidden="true">*</span>
                </span>
              </label>
              <span className="error-msg">{errors.cgv_accept}</span>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => goTo(1)}>Retour</button>
              <button type="submit" className="btn btn-accent btn-lg" disabled={submitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                {submitting ? "Validation…" : "Valider la commande"}
              </button>
            </div>

            <div className={`form-status${status ? ` is-visible is-${status.kind}` : ""}`} role="status" aria-live="polite">
              {status?.msg}
            </div>
          </div>
        </div>

        {/* Récap latéral */}
        <aside>
          <div className="recap-card">
            <h3>Récapitulatif</h3>
            <div className="recap-row">
              <span>Formule choisie</span>
              <strong id="recap-plan">{plan ? LABELS[plan] : "—"}</strong>
            </div>
            <div className="recap-row">
              <span>Délai de livraison</span>
              <strong id="recap-delay">{plan ? DELAYS[plan] : "48 à 72h"}</strong>
            </div>
            <div className="recap-row">
              <span className="muted">Sous-total HT</span>
              <span id="recap-subtotal">{plan ? eur(ht) : "—"}</span>
            </div>
            <div className="recap-row">
              <span className="muted">TVA (20%)</span>
              <span id="recap-tva">{plan ? eur(tva) : "—"}</span>
            </div>
            <div className="recap-row total">
              <span>Total TTC</span>
              <span id="recap-total">{plan ? eur(ttc) : "—"}</span>
            </div>
            <ul className="recap-features">
              {[
                "Garantie satisfait ou remboursé 30 jours",
                "Paiement sécurisé (TLS 1.3)",
                "Confidentialité RGPD",
                "Support inclus 15 à 90 jours",
              ].map((t) => (
                <li key={t}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg> {t}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}
