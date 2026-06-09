# EkoLink — Landing page « Fiches Google optimisées »

Landing page et site multi-pages pour la vente de fiches Google Business optimisées par **EkoLink S.A.S.** (agence Google Partner depuis 2015, Paris).

Conforme au cahier des charges v1.0 (HTML5 / CSS3 / JavaScript Vanilla, sans framework).

## Structure du projet

```
landing_page/
├── index.html                          # Landing page principale (11 sections)
├── commander.html                      # Tunnel de commande 3 étapes
├── contact.html                        # Formulaire de contact sécurisé
├── a-propos.html                       # Page « À propos » d'EkoLink
├── blog.html                           # Liste d'articles SEO local
├── mentions-legales.html
├── cgv.html                            # CGV complètes (12 articles)
├── politique-confidentialite.html      # Conforme RGPD
├── politique-cookies.html              # Conforme CNIL
├── css/
│   ├── style.css                       # Styles principaux + utilitaires
│   ├── animations.css                  # Reveal au scroll + reduced-motion
│   └── responsive.css                  # Mobile-first, 5 breakpoints
├── js/
│   ├── main.js                         # Header sticky, menu, smooth scroll, RGPD
│   ├── animations.js                   # Intersection Observer + compteurs
│   ├── faq.js                          # Accordéon exclusif
│   └── forms.js                        # Validation + CSRF + honeypot (mailto démo)
├── assets/
│   ├── icons/
│   │   ├── favicon.png                 # Marque hexagonale EkoLink (officielle, 1536×1024 PNG)
│   │   ├── logo.png                    # Wordmark "EkoLink" (officiel, 1536×1024 PNG)
│   │   ├── favicon.svg                 # Fallback SVG vectoriel
│   │   ├── logo.svg                    # Fallback SVG vectoriel
│   │   └── apple-touch-icon.svg        # Fallback SVG
│   └── images/
│       ├── og-cover.svg                # 1200×630 Open Graph
│       ├── product-cover.svg
│       ├── fiche-avant.svg             # <picture> – avant optimisation
│       └── fiche-apres.svg             # <picture> – après optimisation
├── fonts/                              # Polices auto-hébergées (voir README.txt)
├── sitemap.xml                         # 9 URLs réelles (sans fragments)
├── robots.txt
└── README.md
```

## Pages incluses (toutes fonctionnelles)

| Page | URL | Fonction |
|---|---|---|
| Accueil | `/` | Landing 11 sections — Hero, problèmes, solution, fonctionnalités, preuves sociales, tarifs, FAQ, garanties, CTA, footer |
| Commande | `/commander.html` | Tunnel 3 étapes : formule → infos entreprise → paiement (CB/PayPal/virement). Récap latéral en temps réel. Pré-sélection via `?plan=starter\|pro\|agence` |
| Contact | `/contact.html` | Formulaire complet (8 champs), validation HTML5+JS, anti-CSRF token (sessionStorage), honeypot, consentement RGPD |
| À propos | `/a-propos.html` | Histoire EkoLink, certifications (Google/Meta/Shopify Partner), équipe, valeurs |
| Blog | `/blog.html` | 6 articles SEO local (placeholders avec lien `contact.html`) |
| Mentions légales | `/mentions-legales.html` | Éditeur, hébergeur, propriété intellectuelle, RGPD, cookies, crédits |
| CGV | `/cgv.html` | 12 articles : objet, tarifs, commande, paiement, livraison, garantie, rétractation, médiation |
| Confidentialité | `/politique-confidentialite.html` | RGPD complet : finalités, base légale, durées, droits, CNIL |
| Cookies | `/politique-cookies.html` | Tableau détaillé, désactivation par navigateur, conformité CNIL |

## Conformité au cahier des charges

### Technique
- HTML5 sémantique (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Une seule balise H1 par page, hiérarchie stricte H1→H2→H3
- CSS critique inline (≈220 lignes) + reste en preload async
- Vanilla JS uniquement (zéro dépendance externe)
- `defer` sur tous les scripts
- SVG inline pour toutes les icônes
- Intersection Observer pour les animations (zéro scroll listener)
- `<picture>` + `<source srcset>` pour les images raster
- Mobile-first, 5 breakpoints : 320 / 481 / 768 / 1024 / 1440+

### SEO
- Title ≤ 60 caractères sur toutes les pages
- Meta description 150-160 caractères
- `<link rel="canonical">` sur chaque page
- Open Graph + Twitter Cards complètes
- JSON-LD : `Organization`, `Product`, `FAQPage`, `AggregateRating`, `ContactPage`, `AboutPage`
- `sitemap.xml` (9 URLs canoniques sans fragments)
- `robots.txt` propre

### Accessibilité (WCAG 2.1 AA)
- `<html lang="fr">`, skip link, focus visible
- ARIA (`aria-expanded`, `aria-controls`, `aria-current`, `aria-label`, `aria-live`)
- Navigation clavier complète (Tab, Enter, Escape ferme menu)
- `prefers-reduced-motion` respecté
- Contraste ≥ 4,5:1 sur tous les textes
- `type="button"` sur tous les boutons non-submit
- Aucun style inline (0 — vérifié par grep)

### RGPD / Sécurité
- Bandeau cookies en JS pur, Google Analytics chargé après consentement uniquement
- Polices auto-hébergées (aucun appel externe Google Fonts)
- `rel="noopener noreferrer"` sur tous les liens externes
- Formulaires : token CSRF (sessionStorage), honeypot, validation HTML5 + JS, consentement obligatoire
- Politique de confidentialité conforme + droit à l'oubli
- Aucun lien mort (les anciens `href="#"` redirigent vers `contact.html`)

### Conversion (tunnel d'achat)
- Tunnel `commander.html` opérationnel en 3 étapes
- Validation par étape, indicateur visuel, récap latéral sticky
- Pré-sélection de la formule via URL `?plan=`
- Modes de paiement multiples (CB / PayPal / Virement) — simulation à brancher sur Stripe

## Démarrage local

Aucun build nécessaire — HTML/CSS/JS pur.

```bash
# Python
python -m http.server 8000

# ou Node
npx serve .
```

Ouvrir <http://localhost:8000>.

## Mise en production — checklist

### Bloquants
- [ ] Ajouter `fonts/inter-var.woff2` et `inter-var.woff` (téléchargeables sur <https://rsms.me/inter/>)
- [ ] Générer les versions WebP des SVG dans `assets/images/` (og-cover.webp, fiche-avant.webp, fiche-apres.webp) — outils : `cwebp` ou <https://squoosh.app>
- [ ] Remplacer `G-XXXXXXXXXX` dans `js/main.js` par l'ID GA4 réel d'EkoLink
- [ ] Brancher Stripe / PayPal sur le tunnel `commander.html` (point d'extension : `data-plan` + `submit` du form)

### Compléter dans les pages légales (balises `[À COMPLÉTER]`)
- Capital social, RCS complet, n° TVA intracommunautaire (mentions-legales.html)
- Coordonnées de l'hébergeur (mentions-legales.html + politique-confidentialite.html)
- Nom du directeur de publication
- Email du DPO / contact RGPD (politique-confidentialite.html)
- Coordonnées du médiateur de la consommation (cgv.html)

### Performance / sécurité serveur
- [ ] HTTPS + redirect HTTP→HTTPS
- [ ] En-têtes : `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Compression Brotli/Gzip
- [ ] Cache-Control sur les assets statiques
- [ ] Minification CSS/JS (recommandé : `terser` + `cssnano`)

## Identité de marque (Charte)

| Élément | Valeur |
|---|---|
| Nom de marque | **EkoLink** (capital L) |
| Couleur primaire | `#1A73E8` (bleu Google) |
| Brand orange | `#F89F1B` (lettermark « Eko », CTA primaires) |
| Brand blue | `#2D8FF7` (lettermark « Link ») |
| Couleur secondaire | `#34A853` (vert Google, success) |
| Couleur accent | `#EA4335` (rouge, alertes) |
| Texte principal | `#202124` |
| Texte secondaire | `#5F6368` |
| Police | Inter (variable, auto-hébergée) |
| Logo | Hexagone interlinké orange/bleu + dot |

## Coordonnées EkoLink

- **Siège** : 7 Rue Vulpian, 75013 Paris
- **Email** : <contact@ekolink.fr>
- **Téléphone** : +33 6 41 47 98 36
- **SIRET** : 1179695284
- **Forme juridique** : S.A.S.
- **Fondée** : 2015
- **Site agence** : <https://ekolink.dev>

### Réseaux sociaux
- LinkedIn : <https://www.linkedin.com/company/ekolink>
- Facebook : <https://web.facebook.com/people/Ekolink/100086166664875/>
- Instagram : <https://www.instagram.com/ekolink>
- YouTube : <https://www.youtube.com/@AlbertLanneAds>
- TikTok : <https://www.tiktok.com/@ekolink>

## Outils de validation

- Lighthouse : Chrome DevTools (cible : mobile ≥85, desktop ≥90)
- PageSpeed Insights : <https://pagespeed.web.dev>
- HTML W3C : <https://validator.w3.org>
- CSS W3C : <https://jigsaw.w3.org/css-validator>
- Données structurées : <https://search.google.com/test/rich-results>
- WAVE : <https://wave.webaim.org>

## Crédits

- Conception et développement : EkoLink S.A.S.
- Polices : Inter (Rasmus Andersson — SIL Open Font License)
- Icônes : Feather Icons (MIT License)
- Cahier des charges : « Landing Page Fiches Google » v1.0
