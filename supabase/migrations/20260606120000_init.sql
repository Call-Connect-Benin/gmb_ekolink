-- ============================================================
-- EkoMedia — Marketplace GBP : schéma initial
-- À exécuter dans Supabase → SQL Editor (une seule fois).
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Table : categories (métiers) ----------
create table if not exists public.categories (
  id        uuid primary key default gen_random_uuid(),
  slug      text unique not null,
  name_fr   text not null,
  name_en   text not null,
  icon      text
);

-- ---------- Table : listings (fiches GBP en vente) ----------
create table if not exists public.listings (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text unique not null,
  category_slug text not null references public.categories(slug),
  city          text not null,
  postal_code   text,
  price         integer not null,                  -- euros TTC
  status        text not null default 'available'  -- available | reserved | sold
                check (status in ('available','reserved','sold')),
  state         text not null default 'vierge'     -- vierge | historique
                check (state in ('vierge','historique')),
  description   text,
  images        text[] not null default '{}',
  seo_score     integer,
  photos_count  integer not null default 0,
  reviews_count integer not null default 0,
  rating        numeric(2,1),
  created_at    timestamptz not null default now()
);
create index if not exists listings_category_idx on public.listings (category_slug);
create index if not exists listings_status_idx on public.listings (status);

-- ---------- Table : profiles (acheteurs) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text,
  phone      text,
  role       text not null default 'buyer' check (role in ('buyer','admin')),
  created_at timestamptz not null default now()
);

-- ---------- Table : orders (commandes) ----------
create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  listing_id        uuid not null references public.listings(id),
  buyer_id          uuid not null references public.profiles(id) on delete cascade,
  stripe_session_id text,
  status            text not null default 'pending'  -- pending|paid|in_progress|delivered|validated|cancelled
                    check (status in ('pending','paid','in_progress','delivered','validated','cancelled')),
  amount            integer not null,
  created_at        timestamptz not null default now()
);
create index if not exists orders_buyer_idx on public.orders (buyer_id);
create index if not exists orders_listing_idx on public.orders (listing_id);

-- ---------- Trigger : créer un profil à l'inscription ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Helper : l'utilisateur courant est-il admin ? ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.categories enable row level security;
alter table public.listings  enable row level security;
alter table public.profiles  enable row level security;
alter table public.orders    enable row level security;

-- categories : lecture publique, écriture admin
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories for select using (true);
drop policy if exists "categories_admin" on public.categories;
create policy "categories_admin" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- listings : lecture publique, écriture admin
drop policy if exists "listings_read" on public.listings;
create policy "listings_read" on public.listings for select using (true);
drop policy if exists "listings_admin" on public.listings;
create policy "listings_admin" on public.listings for all
  using (public.is_admin()) with check (public.is_admin());

-- profiles : chacun lit/modifie le sien ; admin lit tout
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles for select
  using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- orders : l'acheteur voit/crée les siennes ; admin gère tout
drop policy if exists "orders_self_read" on public.orders;
create policy "orders_self_read" on public.orders for select
  using (auth.uid() = buyer_id or public.is_admin());
drop policy if exists "orders_self_insert" on public.orders;
create policy "orders_self_insert" on public.orders for insert
  with check (auth.uid() = buyer_id);
drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

-- ============================================================
-- SEED : catégories (métiers) + 10 fiches de démonstration
-- ============================================================
insert into public.categories (slug, name_fr, name_en, icon) values
  ('plombier',     'Plombier',            'Plumber',      'wrench'),
  ('serrurier',    'Serrurier',           'Locksmith',    'key'),
  ('electricien',  'Électricien',         'Electrician',  'zap'),
  ('macon',        'Maçon',               'Mason',        'home'),
  ('restaurant',   'Restaurant',          'Restaurant',   'utensils'),
  ('coiffeur',     'Coiffeur',            'Hairdresser',  'scissors')
on conflict (slug) do nothing;

insert into public.listings
  (title, slug, category_slug, city, postal_code, price, status, state, description, images, seo_score, photos_count, reviews_count, rating)
values
  ('Plombier chauffagiste — Paris 11e', 'plombier-paris-11', 'plombier', 'Paris', '75011', 349, 'available', 'historique',
   'Fiche optimisée : catégorie principale Plombier, 8 catégories secondaires, description SEO 750 caractères, zone de service 10 km, 12 photos géotaggées.',
   array['/assets/images/cover-pack-local.webp'], 92, 12, 34, 4.8),
  ('Serrurier dépannage 24/7 — Lyon', 'serrurier-lyon', 'serrurier', 'Lyon', '69003', 299, 'available', 'vierge',
   'Fiche vierge optimisée, prête à revendiquer. NAP cohérent, attributs urgence/24-7, zone de service multi-arrondissements.',
   array['/assets/images/cover-repondre-avis.webp'], 88, 9, 0, null),
  ('Électricien certifié RGE — Bordeaux', 'electricien-bordeaux', 'electricien', 'Bordeaux', '33000', 329, 'available', 'historique',
   'Fiche avec historique d''avis préservé. Catégories optimales, 10 Q&R pré-rédigées, 3 Google Posts programmés.',
   array['/assets/images/cover-photos-gmb.webp'], 90, 14, 21, 4.9),
  ('Maçon — rénovation & gros œuvre — Nantes', 'macon-nantes', 'macon', 'Nantes', '44000', 279, 'available', 'vierge',
   'Fiche vierge optimisée pour le Pack Local. Description keyword-rich, zone de service départementale.',
   array['/assets/images/cover-cas-boulangerie.webp'], 85, 8, 0, null),
  ('Restaurant bistronomique — Paris 9e', 'restaurant-paris-9', 'restaurant', 'Paris', '75009', 449, 'available', 'historique',
   'Fiche premium avec 27 avis, menu, réservations activées, 18 photos professionnelles. Top 3 Pack Local.',
   array['/assets/images/cover-update-maps-2026.webp'], 95, 18, 27, 4.7),
  ('Coiffeur — salon de quartier — Lille', 'coiffeur-lille', 'coiffeur', 'Lille', '59000', 249, 'available', 'vierge',
   'Fiche vierge optimisée. Prise de rendez-vous, attributs accessibilité, 6 photos.',
   array['/assets/images/cover-avis-supprimes.webp'], 82, 6, 0, null),
  ('Plombier — interventions express — Marseille', 'plombier-marseille', 'plombier', 'Marseille', '13006', 319, 'reserved', 'vierge',
   'Fiche optimisée en cours de réservation. Zone de service 8e/6e/7e arrondissements.',
   array['/assets/images/cover-pack-local.webp'], 87, 10, 3, 4.5),
  ('Électricien — domotique & bornes — Toulouse', 'electricien-toulouse', 'electricien', 'Toulouse', '31000', 359, 'available', 'historique',
   'Fiche avec 19 avis, spécialisation domotique et bornes de recharge. 11 photos.',
   array['/assets/images/cover-photos-gmb.webp'], 91, 11, 19, 4.8),
  ('Serrurier — agréé assurances — Strasbourg', 'serrurier-strasbourg', 'serrurier', 'Strasbourg', '67000', 289, 'sold', 'vierge',
   'Fiche déjà vendue (exemple d''état « Vendu »).',
   array['/assets/images/cover-repondre-avis.webp'], 84, 7, 0, null),
  ('Restaurant — cuisine du marché — Nice', 'restaurant-nice', 'restaurant', 'Nice', '06000', 429, 'available', 'historique',
   'Fiche avec 33 avis, réservations, menu détaillé, 16 photos. Excellente note moyenne.',
   array['/assets/images/cover-update-maps-2026.webp'], 94, 16, 33, 4.9)
on conflict (slug) do nothing;

-- ============================================================
-- STORAGE (optionnel) : bucket public pour les screenshots de fiches.
-- À créer via le dashboard Supabase → Storage → New bucket « listings » (public),
-- ou décommenter :
-- insert into storage.buckets (id, name, public) values ('listings','listings',true)
--   on conflict (id) do nothing;
-- ============================================================
