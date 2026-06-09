# Tableau de conformité — CDC Marketplace GBP EkoMedia

Statut au regard du cahier des charges v1.0. ✅ Fait · 🟡 Partiel · ⚪ À configurer (clé/accès) · ❌ Non fait

## §2.1 — Modules

| Fonctionnalité | Priorité | Phase | Statut | Où |
|---|---|---|---|---|
| Catalogue de fiches par métier | Critique | 1 | ✅ | `/fiches-google` + filtres |
| Fiche produit détaillée (GBP) | Critique | 1 | ✅ | `/fiches-google/[slug]` |
| Système de paiement (Stripe) | Critique | 1 | ✅ | `/api/checkout` + webhook |
| Inscription / Auth acheteur | Haute | 1 | ✅ | Supabase (email + Google OAuth*) |
| Back-office admin (gestion fiches) | Haute | 1 | ✅ | `/admin` (CRUD, commandes, KPIs, CSV) |
| Système de livraison de la fiche | Haute | 1 | ✅ | statuts commande + suivi `/compte` + email n8n⚪ |
| Multilingue FR / EN | Haute | 1 | ✅ | next-intl + sélecteur (cookie) |
| Recherche et filtres avancés | Moyenne | 2 | ✅ | mot-clé + tri + filtres |
| Avis acheteurs | Moyenne | 2 | ✅ | table `reviews` + RLS + formulaire fiche |
| Tableau de bord acheteur | Moyenne | 2 | ✅ | `/compte` |
| API partenaires (vendeurs tiers) | Basse | 3 | ❌ | Phase 3 |
| Application mobile | Basse | 3 | ❌ | Phase 3 (hors web) |

\* Google OAuth : code prêt, à activer dans Supabase (provider Google + identifiants Google Cloud).

## §2.2–2.4 — Catalogue / Fiche / Achat
- Filtres métier / ville / prix / état ✅ · badge Disponible / Réservé / Vendu ✅ · photos / avis / note ✅
- Fiche : nom, catégorie, localisation, description, prix, indicateurs SEO, mention transfert ✅
- Parcours : catalogue → inscription/connexion → Stripe (CB ; virement SEPA via dashboard Stripe ⚪) → email n8n ⚪ → suivi `/compte` ✅

## §2.5 — Back-office
CRUD fiches ✅ · gestion commandes + statut ✅ · **gestion des acheteurs** ✅ (`/admin/utilisateurs`) · export CSV ✅ · KPIs (revenus, vendues, stock) ✅

## §3 — Stack
| Composant | CDC | Réalisé |
|---|---|---|
| Framework | Next.js 14+ App Router, TS strict | ✅ Next 16.2.7, strict |
| UI / Styling | Tailwind + **shadcn/ui** | ✅ shadcn/ui (Button, Card, Input, Label, Select, Textarea, Badge) |
| Base de données | Supabase (PostgreSQL, auth, storage) | ✅ auth + DB + RLS ; Storage ⚪ (bucket `listings`) |
| ORM | Prisma OU Supabase JS | ✅ Supabase JS |
| Paiement | Stripe Checkout + Webhooks | ✅ |
| Emails | n8n | ⚪ prêt (`N8N_WEBHOOK_URL` → événement `order.paid`) |
| Hébergement | Vercel + Supabase cloud | ✅ compatible (déploiement à faire) |
| Multilingue | next-intl | ✅ |
| Automatisation | n8n | ⚪ webhook prêt |

## §3.3 — Données
Tables `listings`, `orders`, `profiles`, `categories` (+ `reviews`) avec les colonnes du CDC + RLS. ✅
Migrations : `supabase/migrations/`.

## §3.4 — Intégrations
Stripe ✅ · Supabase Auth ✅ · **GA4** ✅ (après consentement, `NEXT_PUBLIC_GA_ID` ⚪) · **WhatsApp** ✅ (bouton flottant) · n8n ⚪ (prêt)

## §3.5 — Sécurité / RGPD
HTTPS (prod) · RLS ✅ · mentions légales / confidentialité / CGV ✅ · bannière cookies ✅ · auth Supabase (hash géré) ✅

## §4 — SEO
URLs propres ✅ · Title/meta par page ✅ · Schema.org Product (fiches) + Organization (home) + ContactPage ✅ · sitemap.xml / robots.txt ✅

## §4.2 — Pages clés
Accueil ✅ · Catalogue ✅ · Fiche produit ✅ · **Comment ça marche** ✅ · FAQ ✅ (home) · À propos ✅ · CGV & Mentions ✅ · Mon compte ✅

---

## Reste à faire / configurer
- ⚪ **Clés à fournir** pour activer : n8n (`N8N_WEBHOOK_URL`), GA4 (`NEXT_PUBLIC_GA_ID`), virement Stripe (dashboard), Google OAuth, Supabase Storage bucket — voir `MARKETPLACE_SETUP.md`.
- 🟡 **Pages de contenu** (légales, articles de blog, à-propos, blog) : rendues via une feuille de style « prose » d'origine (couche `legacy`) — fonctionnelles ; conversion shadcn cosmétique non prioritaire.
- ❌ **Phase 3** : API partenaires, application mobile native (hors périmètre web).
