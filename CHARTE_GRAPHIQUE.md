# Charte graphique — Marketplace GBP (EkoLink / EkoMedia)

Système de design implémenté (Tailwind v4 + shadcn/ui). Les variables sont définies
dans `app/globals.css` (bloc `:root` + `@theme inline`).

## 1. Marque
- **Nom :** EkoLink (« Eko » orange + « Link » bleu, capital L)
- **Logo :** hexagone interlinké + wordmark — `public/assets/icons/logo.png`
- **Baseline :** « Marketplace de fiches Google Business · Google Partner depuis 2015 »
- **Voix / ton :** clair, rassurant, expert, orienté résultat local. Pas de jargon inutile.

## 2. Couleurs

### Couleurs de marque
| Rôle | Hex | Variable | Usage |
|---|---|---|---|
| **Primaire (bleu)** | `#1A73E8` | `--primary` | Actions principales, liens, accents bleus, header CTA |
| Primaire (texte) | `#FFFFFF` | `--primary-foreground` | Texte sur primaire |
| **Accent (orange)** | `#F89F1B` | `--accent` | CTA secondaires d'emphase, badges, surbrillances |
| Accent (texte) | `#1A1206` | `--accent-foreground` | Texte sur orange |
| Lettermark « Link » | `#2D8FF7` | — | Variante bleue claire du logo |
| Lettermark « Eko » | `#F89F1B` | — | Orange du logo |

### Couleurs sémantiques
| Rôle | Hex | Variable | Usage |
|---|---|---|---|
| **Succès / disponible** | `#34A853` | `--success` | Badge « Disponible », validations, vert Google |
| **Erreur / vendu** | `#B42318` | `--destructive` | Badge « Vendu », suppression, alertes |
| Avertissement / réservé | `#F89F1B` | (accent) | Badge « Réservé » |
| Note / étoiles | `#FBBC04` | — | Étoiles d'avis |

### Neutres & surfaces
| Rôle | Hex | Variable |
|---|---|---|
| Encre (texte) | `#0E1116` | `--foreground` |
| Texte secondaire | `#5A5F6B` | `--muted-foreground` |
| Fond | `#FFFFFF` | `--background` |
| Surface douce (cream) | `#F4F0E5` | `--secondary` |
| Surface neutre | `#F6F7F9` | `--muted` |
| Carte | `#FFFFFF` | `--card` |
| Bordure | `#E5E2D9` | `--border` |
| Anneau de focus | `#1A73E8` | `--ring` |
| Fonds sombres (hero/footer/CTA) | `#0B1119` → `#10233F` | — |

## 3. Typographie
- **Police :** **Inter** (variable, auto-hébergée, RGPD — aucun appel Google Fonts).
- **Pile :** `Inter, "Segoe UI", system-ui, -apple-system, sans-serif`.
- **Échelle (titres) :**
  - H1 : `clamp(2.1rem, 5vw, 3.6rem)`, **800**, interlignage 1.05, tracking serré
  - H2 : `clamp(1.7rem, 3.4vw, 2.4rem)`, **800**
  - H3 : 1.125–1.25rem, **700**
- **Corps :** 0.875–1rem, 400/500 ; secondaire en `--muted-foreground`.
- **Eyebrow / labels :** 0.75rem, **700**, MAJUSCULES, `letter-spacing` large.

## 4. Formes & profondeur
- **Rayon de base :** `--radius: 0.625rem` (10px). Échelle : `sm` 6px · `md` 8px · `lg` 10px · `xl` 14px.
  - Cartes : `rounded-xl/2xl` · Boutons/champs : `rounded-md` · Badges/pills : `rounded-full`.
- **Ombres :** douces et diffuses (élévation faible). Ex. cartes : `shadow-sm` → `shadow-lg` au survol.
- **Bordures :** 1px `--border`, discrètes.
- **Survols :** légère élévation (`-translate-y-1`) + ombre renforcée.

## 5. Composants (shadcn/ui — `components/ui/`)
- **Button** : variantes `default` (bleu), `accent` (orange), `outline`, `secondary`, `ghost`, `link`, `destructive` ; tailles `sm` / `default` / `lg` / `icon` ; CTA souvent `rounded-full`.
- **Card** : surface blanche, bordure, `rounded-xl`, padding généreux.
- **Badge** : `success` (vert), `warning` (orange), `destructive` (rouge), `info` (bleu), `secondary`.
- **Input / Select / Textarea / Label** : hauteur 36px, bordure `--input`, focus = anneau `--ring`.

## 6. Iconographie
- **lucide-react** (style trait, cohérent avec Feather). Épaisseur 2px, taille 16–24px.
- Icônes métiers (catégories) : Wrench, Key, Zap, Hammer, Utensils, Scissors…

## 7. Mise en page
- **Largeur de contenu :** max `1240px`, gouttière `20px` (`px-5`).
- **Navbar :** claire, fixe, fond `white/70` + flou, ombre au scroll, hauteur 64px.
- **Sections :** alternance fond blanc / `secondary/40` (cream léger) ; padding vertical 80px (`py-20`).
- **Dashboards :** coque applicative = sidebar (240px, nav + déconnexion) + topbar (titre + actions) + tuiles KPI.
- **Espacement :** grille de 4px (échelle Tailwind), respiration généreuse.

## 8. Accessibilité
- Contraste ≥ 4.5:1 sur les textes · focus visible (anneau bleu) · navigation clavier · `prefers-reduced-motion` respecté · libellés ARIA.

---
*Référence d'implémentation : `app/globals.css` (tokens) et `components/ui/` (composants).*
