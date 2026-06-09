# Marketplace GBP — Mise en route

Le site fonctionne **sans configuration** (les pages affichent un bandeau « non configuré »).
Pour activer l'authentification, le catalogue dynamique, le paiement et les dashboards,
suivez ces étapes.

## 1. Variables d'environnement

Copiez le modèle puis renseignez vos clés :

```bash
cp .env.local.example .env.local
```

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | idem (clé **service_role**, serveur uniquement) |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API keys (mode **test**) |
| `STRIPE_WEBHOOK_SECRET` | voir étape 4 |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` en local |
| `ADMIN_EMAILS` | votre email, pour accéder au back-office `/admin` |

## 2. Base de données Supabase

La migration `supabase/migrations/20260606120000_init.sql` crée les tables
(`categories`, `listings`, `profiles`, `orders`), les politiques **RLS**, le trigger
de création de profil à l'inscription, et **10 fiches de démonstration**.

### Option A — Supabase local (recommandé pour développer, nécessite Docker)

```bash
# prérequis : Docker Desktop installé et démarré
npx supabase init        # répondre N à la question Deno/VS Code
npx supabase start       # démarre Postgres+Auth+Storage et APPLIQUE la migration
```

`supabase start` affiche les valeurs à mettre dans `.env.local` :

| Affiché par la CLI | `.env.local` |
|---|---|
| `API URL` (http://127.0.0.1:54321) | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon key` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role key` | `SUPABASE_SERVICE_ROLE_KEY` |

- Studio local (pour voir les données) : http://127.0.0.1:54323
- Emails de test (confirmation, magic link) : http://127.0.0.1:54324 (Inbucket)
- Si tu modifies le SQL ensuite : `npx supabase db reset` (réapplique tout + le seed).

**Migrer vers le cloud plus tard :**
```bash
npx supabase link --project-ref <ref-du-projet-cloud>
npx supabase db push     # pousse la migration vers Supabase cloud
```

### Option B — Supabase cloud directement

Dans Supabase → **SQL Editor**, colle le contenu de
`supabase/migrations/20260606120000_init.sql` et clique **Run**.

> Screenshots de fiches : crée un bucket public `listings` (Storage → New bucket),
> ou conserve les images `/assets/...` par défaut.

## 3. Authentification

- **Email / mot de passe** : activé par défaut. Pour tester sans confirmation email,
  désactivez « Confirm email » dans Supabase → Authentication → Providers → Email.
- **Google OAuth** (bouton « Continuer avec Google ») : activez le provider Google dans
  Supabase → Authentication → Providers, et ajoutez l'URL de redirection
  `…/auth/callback`.

## 4. Stripe (paiement + webhook)

En local, écoutez les webhooks et copiez le secret affiché :

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# → copiez le "whsec_..." dans STRIPE_WEBHOOK_SECRET
```

Le webhook met la commande à `paid` et la fiche à `sold` après paiement.
En production, déclarez l'endpoint `https://VOTRE-DOMAINE/api/webhooks/stripe`
(événement `checkout.session.completed`).

## 5. Devenir administrateur

Le back-office `/admin` est accessible si :
- votre email est dans `ADMIN_EMAILS`, **ou**
- votre `role` vaut `admin` dans la table `profiles` :

```sql
update public.profiles set role = 'admin' where email = 'vous@exemple.fr';
```

## 6. Lancer

```bash
npm run dev
```

## Parcours utilisateur

1. **Commander maintenant** (header) → `/inscription`
2. Après inscription → redirigé vers le **catalogue** `/fiches-google`
3. Clic sur une fiche → page produit → **Acheter** → Stripe Checkout
4. Paiement → webhook → retour sur **`/compte`** (suivi de commande)
5. Back-office : **`/admin`** (KPIs, gestion des fiches et commandes, export CSV)

## Reste à brancher (CDC, hors périmètre actuel)

- Multilingue FR/EN (`next-intl`)
- Emails transactionnels (n8n) — actuellement le statut est géré en base
- Avis acheteurs, recherche avancée, API partenaires (Phases 2–3 du CDC)
