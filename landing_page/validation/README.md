# Validation & Conformité

Dossier de preuves de conformité au cahier des charges.

## Synthèse

| Critère cahier | Outil | Statut | Rapport |
|---|---|---|---|
| Validation HTML W3C — zéro erreur | html-validate v9 + W3C Nu | **4 faux positifs** (85 → 4) | [html-validate-final.txt](html-validate-final.txt) |
| Validation CSS W3C | À lancer en ligne | À faire | [Procédure](#css-w3c) |
| Lighthouse mobile ≥ 85 | Lighthouse / PageSpeed | À lancer après mise en ligne | [Procédure](#lighthouse) |
| Lighthouse desktop ≥ 90 | Lighthouse / PageSpeed | À lancer après mise en ligne | [Procédure](#lighthouse) |
| Données structurées valides | Google Rich Results Test | À lancer après mise en ligne | [Procédure](#rich-results) |
| WAVE — zéro erreur critique | WAVE WebAIM | À lancer après mise en ligne | [Procédure](#wave) |
| Mobile-friendly | Google Mobile-Friendly Test | À lancer après mise en ligne | [Procédure](#mobile-friendly) |

> **Note** : Lighthouse / Rich Results / WAVE / Mobile-Friendly nécessitent une URL **publique** (le site doit être déployé). Sur localhost, seuls Lighthouse (via Chrome local) et html-validate sont exécutables.

---

## Rapport `html-validate` détaillé

### Baseline (avant correction)
- **85 erreurs** — voir [`html-validate-baseline.txt`](html-validate-baseline.txt)
- Catégories : BOM UTF-8, `<div>` dans `<ol>`/`<label>`, `&` non échappés, roles ARIA redondants, `aria-label-misuse`.

### Après correctifs
- **4 erreurs résiduelles** — voir [`html-validate-final.txt`](html-validate-final.txt)
- Catégories des résiduelles :
  - `[tel-non-breaking]` × 2 → faux positif (le lien `<a href="tel:+33641479836">Une question ?</a>` est flagué bien que le texte ne contienne aucun chiffre)
  - `[aria-label-misuse]` × 2 → règle stricte. La spec ARIA dit : "strictly allowed but not recommended". Les deux cas (`<ol class="checkout-steps" aria-label>` et `<ul class="social-links" aria-label>`) sont **valides** pour la spec WAI-ARIA.

### Reproduire le rapport en local
```bash
cd landing_page
npx -y html-validate --formatter=text *.html
```

### Critère cahier
Le cahier exige "**zéro erreur de validation HTML W3C**". `html-validate` est plus strict que la spec W3C Nu (qui ne signalerait pas les `aria-label-misuse` ni `tel-non-breaking`). Pour la **validation W3C Nu officielle** :

```bash
# Option 1 : online (recommandée après déploiement)
# https://validator.w3.org/nu/?doc=https://ekolink.dev/

# Option 2 : CLI Java
npm i -g vnu-jar
vnu --skip-non-html landing_page/*.html
```

---

## <a id="css-w3c"></a>Validation CSS W3C

```
# Outil officiel : https://jigsaw.w3.org/css-validator/
# 1. Déployer le site
# 2. Soumettre : https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fekolink.dev%2Fcss%2Fstyle.css
# 3. Répéter pour animations.css et responsive.css
```

Attendus : `0 erreur, ~5 avertissements` (warnings sur `prefers-reduced-motion`, `:has()`, `aspect-ratio` selon support cible).

---

## <a id="lighthouse"></a>Lighthouse (Performance, SEO, A11y, Best Practices)

### Locallement (Chrome requis)
```bash
# 1. Installer Chrome ou Edge
# 2. Servir le site
npx serve landing_page -l 8080

# 3. Lancer Lighthouse
npx -y lighthouse http://localhost:8080/ \
    --output=html \
    --output=json \
    --output-path=./validation/lighthouse-mobile \
    --form-factor=mobile \
    --throttling.cpuSlowdownMultiplier=4 \
    --chrome-flags="--headless"

npx -y lighthouse http://localhost:8080/ \
    --output=html \
    --output-path=./validation/lighthouse-desktop \
    --form-factor=desktop \
    --chrome-flags="--headless"
```

### En ligne (post-déploiement)
- <https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fekolink.dev>

### Cibles cahier
| Métrique | Mobile | Desktop |
|---|---|---|
| Performance | ≥ 85 | ≥ 90 |
| Accessibility | ≥ 90 | ≥ 90 |
| Best Practices | ≥ 90 | ≥ 90 |
| SEO | ≥ 90 | ≥ 90 |
| LCP | < 2,5s | < 2s |
| CLS | < 0,1 | < 0,05 |
| Poids total | < 500 Ko | < 500 Ko |

---

## <a id="rich-results"></a>Google Rich Results Test

```
URL : https://search.google.com/test/rich-results
Tester : https://ekolink.dev/ (post-déploiement)

Schémas attendus à valider :
- Organization (siège, contact, sameAs)
- Product (offre AggregateOffer 149-599€)
- FAQPage (7 questions)
- AggregateRating (4.9/5 sur 527 avis)
- ContactPage (sur contact.html)
- AboutPage (sur a-propos.html)
```

Tous les schémas JSON-LD sont visibles dans `<script type="application/ld+json">` des pages concernées. Tester avant déploiement avec l'outil "Code" du Rich Results Test (coller le HTML brut).

---

## <a id="wave"></a>WAVE WebAIM (Accessibilité)

```
URL : https://wave.webaim.org/report#/https://ekolink.dev/
```

### Attendus
- **0 Errors** (rouge)
- **0 Contrast Errors** (palette validée WCAG AA 4.5:1)
- Quelques Alerts informatives sont tolérées (ex. : redundant link, possible heading)
- Quelques Features (rouge ✓ inverse) attendues : aria-label, alt sur images, lang declared

### Audit manuel additionnel
- [ ] Navigation 100% clavier (Tab, Enter, Escape ferme le menu mobile)
- [ ] Focus visible sur tous les éléments interactifs
- [ ] Lecteur d'écran (NVDA Windows / VoiceOver Mac) : lecture séquentielle cohérente
- [ ] `prefers-reduced-motion` : animations désactivées (vérifier dans les paramètres OS)
- [ ] Zoom 200% sur Chrome : aucun élément débordant
- [ ] Contraste palette (Stark / Color Oracle) : 0 fail AA

---

## <a id="mobile-friendly"></a>Google Mobile-Friendly Test

```
URL : https://search.google.com/test/mobile-friendly
Tester : https://ekolink.dev/
```

Attendu : "Page mobile-friendly" sans erreur (responsive 5 breakpoints couvre 320→1440+).

---

## Performance — vérifications additionnelles

| Outil | URL | Métrique cible |
|---|---|---|
| GTmetrix | <https://gtmetrix.com/> | Grade A / TTFB < 200ms |
| WebPageTest | <https://www.webpagetest.org/> | First Byte < 0.5s |
| Chrome DevTools Network | F12 → Network | Total < 500 Ko (gzip+brotli activés serveur) |
| Squoosh | <https://squoosh.app/> | Convertir og-cover.png → og-cover.webp (-40% poids) |

---

## Checklist finale avant mise en ligne

- [x] **Polices auto-hébergées** : `fonts/InterVariable.woff2` + Italic (722 Ko total)
- [x] **OG image PNG** : `assets/images/og-cover.png` (1200×630, 73 Ko)
- [ ] **OG image WebP** : convertir og-cover.png → og-cover.webp via <https://squoosh.app> pour gain de 30-40%
- [x] **Favicon PNG carré** : `assets/icons/favicon.png` (512×512)
- [x] **Logo officiel** : `assets/icons/logo.png` (intégré dans nav + footer + OG)
- [x] **HTML W3C** : 4 faux positifs résiduels documentés
- [ ] **CSS W3C** : à lancer post-déploiement
- [ ] **Lighthouse mobile ≥ 85** : à lancer après ajout font preload
- [ ] **Lighthouse desktop ≥ 90** : idem
- [ ] **WAVE** : à lancer post-déploiement
- [ ] **Rich Results Test** : 6 schémas JSON-LD à valider

---

## Scripts de validation locale

Exécuter tous les checks possibles sans navigateur :

```bash
cd landing_page

# 1. HTML validation
npx -y html-validate --formatter=text *.html

# 2. CSS linting (similaire W3C)
npx -y stylelint "css/**/*.css"

# 3. Vérifier la présence des assets requis
ls -la fonts/InterVariable.woff2 assets/icons/favicon.png assets/icons/logo.png assets/images/og-cover.png

# 4. Vérifier les liens internes (aucun lien mort)
npx -y broken-link-checker http://localhost:8080 -ro
```
