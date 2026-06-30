-- ============================================================
-- EkoLink — TOUTES les migrations (idempotentes), dans l'ordre.
-- À coller dans Supabase → SQL Editor → Run. Sans danger même si
-- certaines sont déjà appliquées (if not exists / on conflict / create or replace).
-- ============================================================

-- >>>>>>>>>> 20260606120000_init.sql <<<<<<<<<<
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


-- >>>>>>>>>> 20260606130000_reviews.sql <<<<<<<<<<
-- ============================================================
-- EkoMedia — Marketplace GBP : avis acheteurs (Phase 2, CDC §2.1)
-- À exécuter dans Supabase → SQL Editor après la migration initiale.
-- ============================================================

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  buyer_id    uuid not null references public.profiles(id) on delete cascade,
  rating      integer not null check (rating between 1 and 5),
  comment     text,
  author_name text,
  created_at  timestamptz not null default now(),
  unique (listing_id, buyer_id)   -- un seul avis par acheteur et par fiche
);
create index if not exists reviews_listing_idx on public.reviews (listing_id);

alter table public.reviews enable row level security;

-- Lecture publique des avis
drop policy if exists "reviews_read" on public.reviews;
create policy "reviews_read" on public.reviews for select using (true);

-- Insertion : uniquement par l'acheteur lui-même ET s'il a acheté la fiche
drop policy if exists "reviews_insert" on public.reviews;
create policy "reviews_insert" on public.reviews for insert
  with check (
    auth.uid() = buyer_id
    and exists (
      select 1 from public.orders o
      where o.listing_id = reviews.listing_id
        and o.buyer_id = auth.uid()
        and o.status in ('paid','in_progress','delivered','validated')
    )
  );

-- L'acheteur peut modifier/supprimer son propre avis ; l'admin gère tout
drop policy if exists "reviews_update" on public.reviews;
create policy "reviews_update" on public.reviews for update
  using (auth.uid() = buyer_id or public.is_admin())
  with check (auth.uid() = buyer_id or public.is_admin());
drop policy if exists "reviews_delete" on public.reviews;
create policy "reviews_delete" on public.reviews for delete
  using (auth.uid() = buyer_id or public.is_admin());


-- >>>>>>>>>> 20260608000000_dashboard.sql <<<<<<<<<<
-- ============================================================
-- EkoLink — Table "documents" (espace client « Mon compte » — CDC §4.2)
-- Documents liés aux achats (facture, guide de transfert, preuve…).
-- Idempotent.
-- ============================================================

create or replace function public.is_admin()
returns boolean language sql stable as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  name text not null,
  ext text,
  type text,                               -- facture | guide | preuve | confirmation | contrat
  linked_listing text,                     -- intitulé de la fiche liée
  size_bytes bigint,
  created_at timestamptz default now()
);

alter table public.documents enable row level security;

drop policy if exists doc_owner on public.documents;
create policy doc_owner on public.documents for select using (auth.uid() = owner_id or public.is_admin());

drop policy if exists doc_admin on public.documents;
create policy doc_admin on public.documents for all using (public.is_admin()) with check (public.is_admin());

-- ---------- RÔLES & PERMISSIONS (back-office) ----------
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  kind text default 'custom',              -- system | custom
  users_count int default 0,
  permissions_count int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);
alter table public.roles enable row level security;
drop policy if exists roles_read on public.roles;
create policy roles_read on public.roles for select using (true);
drop policy if exists roles_admin on public.roles;
create policy roles_admin on public.roles for all using (public.is_admin()) with check (public.is_admin());

insert into public.roles (name, description, kind, users_count, permissions_count) values
  ('Super administrateur','Accès complet à toutes les fonctionnalités','system',0,128),
  ('Administrateur','Gestion des utilisateurs, paramètres et rapports','custom',0,114),
  ('Gestionnaire','Gestion des ventes, commandes et clients','custom',0,86),
  ('Support client','Gestion des tickets et communication client','custom',0,45),
  ('Marketing','Campagnes, newsletters et codes promo','custom',0,32),
  ('Comptable','Factures, paiements et rapports financiers','custom',0,28),
  ('Invité / Lecture seule','Consultation uniquement (sans modification)','system',0,12)
on conflict (name) do nothing;


-- >>>>>>>>>> 20260608010000_drop_hors_cdc.sql <<<<<<<<<<
-- ============================================================
-- Supprime les tables HORS périmètre CDC (modules retirés).
-- Le CDC ne prévoit que : listings, orders, profiles, categories,
-- reviews (Phase 2) et documents (Mon compte).
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================
drop table if exists public.companies      cascade;
drop table if exists public.promo_codes    cascade;
drop table if exists public.campaigns       cascade;
drop table if exists public.newsletters    cascade;
drop table if exists public.tickets        cascade;
drop table if exists public.contacts       cascade;
drop table if exists public.notifications  cascade;
drop table if exists public.activity_log   cascade;
-- (roles conservée : page Rôles & Permissions réactivée à la demande)


-- >>>>>>>>>> 20260608020000_fix_listing_images.sql <<<<<<<<<<
-- ============================================================
-- Correction des images de fiches.
-- Le seed initial avait stocké des covers de blog (/assets/images/cover-*.webp)
-- comme image de fiche. On les remplace par les visuels métier de /assets/listings.
-- On ne touche qu'aux lignes encore sur une cover de blog (ou sans image),
-- pour préserver d'éventuelles images personnalisées par l'admin.
-- ============================================================

update public.listings
set images = array['/assets/listings/' || category_slug || '.png']
where category_slug in ('plombier', 'serrurier', 'electricien', 'macon', 'restaurant', 'dentiste', 'immobilier')
  and (array_length(images, 1) is null or images[1] like '/assets/images/cover-%');

-- Métiers sans visuel dédié → image par défaut.
update public.listings
set images = array['/assets/listings/default.png']
where category_slug not in ('plombier', 'serrurier', 'electricien', 'macon', 'restaurant', 'dentiste', 'immobilier')
  and (array_length(images, 1) is null or images[1] like '/assets/images/cover-%');


-- >>>>>>>>>> 20260608030000_listing_images_variety.sql <<<<<<<<<<
-- ============================================================
-- Attribue un visuel DISTINCT à chaque fiche du seed.
-- Plusieurs variantes existent par métier (générique + ville) : on les répartit
-- pour ne pas afficher deux fois la même image. L'admin reste libre de changer
-- l'image fiche par fiche ensuite (champ « Image » du formulaire).
-- ============================================================

update public.listings set images = array['/assets/listings/plombier.png']           where slug = 'plombier-paris-11';
update public.listings set images = array['/assets/listings/plombier-toulouse.png']   where slug = 'plombier-marseille';
update public.listings set images = array['/assets/listings/serrurier.png']           where slug = 'serrurier-lyon';
update public.listings set images = array['/assets/listings/serrurier-bordeaux.png']  where slug = 'serrurier-strasbourg';
update public.listings set images = array['/assets/listings/electricien.png']         where slug = 'electricien-bordeaux';
update public.listings set images = array['/assets/listings/electricien-rennes.png']  where slug = 'electricien-toulouse';
update public.listings set images = array['/assets/listings/restaurant.png']          where slug = 'restaurant-paris-9';
update public.listings set images = array['/assets/listings/restaurant-nantes.png']   where slug = 'restaurant-nice';
update public.listings set images = array['/assets/listings/macon.png']               where slug = 'macon-nantes';
update public.listings set images = array['/assets/listings/coiffeur.jpeg']           where slug = 'coiffeur-lille';


-- >>>>>>>>>> 20260609000000_listing_indicators.sql <<<<<<<<<<
-- ============================================================
-- Indicateurs de fiche éditables par l'admin (détail fiche).
-- Remplace les valeurs codées en dur (catégories optimisées, citations
-- locales, potentiel de visibilité) par de vraies colonnes éditables.
-- ============================================================

alter table public.listings
  add column if not exists categories_count integer not null default 3,
  add column if not exists local_citations integer not null default 0,
  add column if not exists visibility text not null default 'high'
    check (visibility in ('low', 'medium', 'high'));

-- Valeurs initiales pour les fiches déjà en base, dérivées du score SEO réel
-- (pas de valeur inventée : tout découle d'une donnée existante).
update public.listings
set
  local_citations = greatest(0, round(coalesce(seo_score, 80) / 4.0))::int,
  visibility = case
    when coalesce(seo_score, 0) >= 90 then 'high'
    when coalesce(seo_score, 0) >= 80 then 'medium'
    else 'low'
  end
where local_citations = 0;


-- >>>>>>>>>> 20260609010000_listing_gallery.sql <<<<<<<<<<
-- ============================================================
-- Galerie d'images de fiche : l'admin peut ajouter plusieurs images,
-- chacune avec son titre (légende). Stocké en JSONB : [{ "url", "title" }].
-- Le tableau `images` (text[]) reste alimenté avec les URLs de la galerie
-- pour la compatibilité (vignette du catalogue = 1re image).
-- ============================================================

alter table public.listings
  add column if not exists gallery jsonb not null default '[]'::jsonb;

-- Backfill : convertit les images existantes en entrées de galerie (titre vide).
update public.listings
set gallery = coalesce(
  (
    select jsonb_agg(jsonb_build_object('url', img, 'title', ''))
    from unnest(images) as img
    where img is not null and img <> ''
  ),
  '[]'::jsonb
)
where gallery = '[]'::jsonb;


-- >>>>>>>>>> 20260609020000_listing_delivery_time.sql <<<<<<<<<<
-- Délai de livraison éditable par fiche (texte libre, ex. « 24-48h », « 48h », « 3-5 j »).
alter table public.listings
  add column if not exists delivery_time text not null default '24-48h';


-- >>>>>>>>>> 20260611000000_storage_listings_bucket.sql <<<<<<<<<<
-- Bucket de stockage public pour les images des fiches (galerie admin).
-- Lecture publique (bucket public) ; écriture via le client service_role (admin),
-- qui contourne la RLS — aucune policy supplémentaire nécessaire.
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do update set public = true;


-- >>>>>>>>>> 20260611010000_categories_50.sql <<<<<<<<<<
-- 50 catégories de métiers locaux (les 6 du seed sont conservées via on conflict).
insert into public.categories (slug, name_fr, name_en, icon) values
  ('plombier',          'Plombier',                 'Plumber',              'droplet'),
  ('serrurier',         'Serrurier',                'Locksmith',            'lock'),
  ('electricien',       'Électricien',              'Electrician',          'lightbulb'),
  ('macon',             'Maçon',                    'Mason',                'hammer'),
  ('restaurant',        'Restaurant',               'Restaurant',           'utensils'),
  ('coiffeur',          'Coiffeur',                 'Hairdresser',          'scissors'),
  ('menuisier',         'Menuisier',                'Carpenter',            'ruler'),
  ('peintre',           'Peintre en bâtiment',      'Painter',              'paintbrush'),
  ('carreleur',         'Carreleur',                'Tiler',                'grid'),
  ('chauffagiste',      'Chauffagiste',             'Heating engineer',     'flame'),
  ('jardinier',         'Jardinier',                'Gardener',             'sprout'),
  ('paysagiste',        'Paysagiste',               'Landscaper',           'trees'),
  ('dentiste',          'Dentiste',                 'Dentist',              'stethoscope'),
  ('medecin',           'Médecin généraliste',      'General practitioner', 'stethoscope'),
  ('veterinaire',       'Vétérinaire',              'Veterinarian',         'paw'),
  ('pharmacie',         'Pharmacie',                'Pharmacy',             'pill'),
  ('kinesitherapeute',  'Kinésithérapeute',         'Physiotherapist',      'heart-pulse'),
  ('opticien',          'Opticien',                 'Optician',             'glasses'),
  ('avocat',            'Avocat',                   'Lawyer',               'scale'),
  ('notaire',           'Notaire',                  'Notary',               'stamp'),
  ('comptable',         'Comptable',                'Accountant',           'calculator'),
  ('architecte',        'Architecte',               'Architect',            'ruler'),
  ('agent-immobilier',  'Agent immobilier',         'Real estate agent',    'building'),
  ('boulangerie',       'Boulangerie',              'Bakery',               'croissant'),
  ('patisserie',        'Pâtisserie',               'Pastry shop',          'cake'),
  ('boucherie',         'Boucherie',                'Butcher',              'beef'),
  ('fleuriste',         'Fleuriste',                'Florist',              'flower'),
  ('epicerie',          'Épicerie',                 'Grocery store',        'basket'),
  ('cafe',              'Café',                     'Coffee shop',          'coffee'),
  ('bar',               'Bar',                      'Bar',                  'wine'),
  ('hotel',             'Hôtel',                    'Hotel',                'bed'),
  ('garage',            'Garage automobile',        'Auto garage',          'car'),
  ('carrossier',        'Carrossier',               'Body shop',            'car'),
  ('taxi',              'Taxi / VTC',               'Taxi & ride',          'car'),
  ('demenagement',      'Déménagement',             'Moving company',       'truck'),
  ('transport',         'Transport / Logistique',   'Transport',            'truck'),
  ('nettoyage',         'Société de nettoyage',     'Cleaning company',     'sparkles'),
  ('pressing',          'Pressing',                 'Dry cleaner',          'shirt'),
  ('cordonnerie',       'Cordonnerie',              'Shoe repair',          'footprints'),
  ('salle-de-sport',    'Salle de sport',           'Gym',                  'dumbbell'),
  ('coach-sportif',     'Coach sportif',            'Personal trainer',     'dumbbell'),
  ('yoga',              'Studio de yoga',           'Yoga studio',          'activity'),
  ('esthetique',        'Institut de beauté',       'Beauty salon',         'sparkles'),
  ('spa',               'Spa & bien-être',          'Spa & wellness',       'flower'),
  ('tatoueur',          'Tatoueur',                 'Tattoo artist',        'brush'),
  ('photographe',       'Photographe',              'Photographer',         'camera'),
  ('imprimerie',        'Imprimerie',               'Print shop',           'printer'),
  ('informatique',      'Dépannage informatique',   'IT support',           'laptop'),
  ('telephonie',        'Réparation mobile',        'Phone repair',         'smartphone'),
  ('assurance',         'Assurance',                'Insurance',            'umbrella')
on conflict (slug) do nothing;


-- >>>>>>>>>> 20260611020000_role_super_admin.sql <<<<<<<<<<
-- Ajoute le rôle 'super_admin' (3 rôles : buyer, admin, super_admin).
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('buyer', 'admin', 'super_admin'));


-- >>>>>>>>>> 20260611030000_profile_avatar.sql <<<<<<<<<<
-- Photo de profil : colonne avatar_url + bucket de stockage public « avatars ».
-- L'upload se fait via le client service_role (admin) qui contourne la RLS,
-- la lecture est publique (bucket public) — aucune policy supplémentaire requise.
alter table public.profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;


-- >>>>>>>>>> 20260611040000_is_admin_super_admin.sql <<<<<<<<<<
-- B1 — La RLS doit reconnaître le rôle super_admin.
-- La dernière définition appliquée (20260608000000_dashboard.sql) ne testait que
-- role = 'admin' et avait perdu le durcissement (security definer / search_path).
-- On redéfinit is_admin() pour inclure super_admin ET restaurer le durcissement.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;


-- >>>>>>>>>> 20260611050000_trigger_phone.sql <<<<<<<<<<
-- M5 — Le téléphone saisi à l'inscription est envoyé dans les métadonnées auth
-- mais le trigger ne l'insérait pas dans profiles.phone. On le récupère désormais.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;


-- >>>>>>>>>> 20260612000000_rls_hardening.sql <<<<<<<<<<
-- ============================================================
-- Durcissement RLS (audit #3) — C1, M1, M2
-- ============================================================

-- C1 (CRITIQUE) — Escalade de privilèges : la policy profiles_self_update
-- autorisait un utilisateur à changer sa propre colonne `role` (→ admin).
-- RLS WITH CHECK ne peut pas comparer à l'ancienne valeur ; on pose donc un
-- trigger BEFORE UPDATE qui interdit tout changement de `role` sauf pour le
-- client service_role (back-office) ou un administrateur.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and coalesce(auth.role(), '') <> 'service_role'
     and not public.is_admin() then
    raise exception 'Modification du rôle non autorisée.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_prevent_role_change on public.profiles;
create trigger trg_prevent_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();

-- M1 — Commandes forgées : orders_self_insert n'imposait ni statut ni montant.
-- On force `status = 'pending'` (le passage à 'paid' se fait via le webhook en
-- service_role) et `amount` = prix réel de la fiche (anti amount=0).
drop policy if exists "orders_self_insert" on public.orders;
create policy "orders_self_insert" on public.orders for insert
  with check (
    auth.uid() = buyer_id
    and status = 'pending'
    and amount = (select price from public.listings where id = listing_id)
  );

-- M2 — Avis déplacé vers une fiche non achetée : le WITH CHECK de l'UPDATE ne
-- contrôlait que buyer_id. On réplique la garde d'achat de l'INSERT pour que la
-- fiche cible reste une fiche réellement achetée (ou que l'auteur soit admin).
drop policy if exists "reviews_update" on public.reviews;
create policy "reviews_update" on public.reviews for update
  using (auth.uid() = buyer_id or public.is_admin())
  with check (
    public.is_admin()
    or (
      auth.uid() = buyer_id
      and exists (
        select 1 from public.orders o
        where o.listing_id = reviews.listing_id
          and o.buyer_id = auth.uid()
          and o.status in ('paid','in_progress','delivered','validated')
      )
    )
  );


-- >>>>>>>>>> 20260612010000_stripe_events.sql <<<<<<<<<<
-- E1 — Idempotence du webhook Stripe : on mémorise les event.id déjà traités
-- pour ne pas rejouer (emails/factures/notifications dupliqués) lors des retries.
create table if not exists public.processed_stripe_events (
  event_id     text primary key,
  processed_at timestamptz not null default now()
);

-- Accès réservé au service_role (le webhook). RLS activée sans policy = aucun
-- accès public ; le service_role contourne la RLS.
alter table public.processed_stripe_events enable row level security;


-- >>>>>>>>>> 20260612020000_contacts.sql <<<<<<<<<<
-- E6 — Table des messages du formulaire de contact (envoi serveur réel).
create table if not exists public.contacts (
  id         uuid primary key default gen_random_uuid(),
  firstname  text,
  lastname   text,
  email      text not null,
  phone      text,
  company    text,
  subject    text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Écriture via le service_role (server action) ; lecture réservée aux admins.
alter table public.contacts enable row level security;
drop policy if exists contacts_admin_read on public.contacts;
create policy contacts_admin_read on public.contacts for select using (public.is_admin());


-- >>>>>>>>>> 20260612030000_profile_anonymize.sql <<<<<<<<<<
-- M4 — Suppression de compte = anonymisation (RGPD) au lieu d'un effacement en
-- cascade qui détruirait les factures (conservation légale ~10 ans).
-- On marque le profil anonymisé pour l'afficher avec un badge côté admin.
alter table public.profiles add column if not exists anonymized boolean not null default false;


-- >>>>>>>>>> 20260612040000_invoice_number.sql <<<<<<<<<<
-- Numérotation séquentielle des factures (art. 242 nonies A CGI : suite continue,
-- sans rupture). Un numéro est attribué au moment où la commande passe à 'paid',
-- via un trigger (le webhook n'a qu'à poser status='paid').
create sequence if not exists public.invoice_number_seq start 1;
alter table public.orders add column if not exists invoice_number bigint;

-- F13 — un numéro de facture légal ne doit jamais être dupliqué.
create unique index if not exists orders_invoice_number_key
  on public.orders (invoice_number) where invoice_number is not null;

create or replace function public.assign_invoice_number()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- M16 — seulement pour un paiement Stripe réel (présence d'une session),
  -- pas pour un passage manuel à 'paid' par un admin.
  if new.status = 'paid'
     and old.status is distinct from 'paid'
     and new.invoice_number is null
     and new.stripe_session_id is not null then
    new.invoice_number := nextval('public.invoice_number_seq');
  end if;
  return new;
end;
$$;

drop trigger if exists trg_assign_invoice_number on public.orders;
create trigger trg_assign_invoice_number
  before update on public.orders
  for each row execute function public.assign_invoice_number();


-- >>>>>>>>>> 20260612050000_role_change_service_role_only.sql <<<<<<<<<<
-- E1 — Escalade de privilèges : la version précédente du trigger autorisait un
-- changement de rôle dès que public.is_admin() était vrai → un simple admin
-- pouvait se promouvoir super_admin via un UPDATE sur son propre profil.
-- On restreint TOUT changement de `role` au seul client service_role (back-office) :
-- les actions admin légitimes (createUser/updateUserRole/createAdmin) passent déjà
-- par createAdminClient(), donc en service_role.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Modification du rôle non autorisée.';
  end if;
  return new;
end;
$$;


-- >>>>>>>>>> 20260612060000_stripe_events_index.sql <<<<<<<<<<
-- M17 — Index sur processed_at pour permettre la purge des vieux events Stripe
-- (table d'idempotence à croissance non bornée). Purge à planifier côté ops, ex. :
--   delete from public.processed_stripe_events where processed_at < now() - interval '30 days';
create index if not exists processed_stripe_events_processed_at_idx
  on public.processed_stripe_events (processed_at);


-- >>>>>>>>>> 20260612070000_order_billing_snapshot.sql <<<<<<<<<<
-- C2 — Snapshot de facturation figé sur la commande à l'achat.
-- La facture (conservée ~10 ans) doit garder l'identité du client et la
-- désignation à la date d'émission, même après anonymisation RGPD du profil.
alter table public.orders
  add column if not exists billing_name  text,
  add column if not exists billing_email text,
  add column if not exists listing_title text,
  add column if not exists listing_city  text;


-- >>>>>>>>>> 20260612080000_cleanup_and_bucket_limits.sql <<<<<<<<<<
-- Nettoyage : les tables `documents` et `roles` ne sont ni lues ni écrites par
-- l'application (l'espace « Mes factures » lit `orders`, la page « Rôles » lit
-- `profiles`). `roles` exposait en plus un seed fictif (permissions_count) en
-- lecture publique. On les supprime.
drop table if exists public.documents cascade;
drop table if exists public.roles cascade;

-- Défense en profondeur storage : restreindre type MIME + taille des buckets
-- d'images (en plus de la validation applicative).
update storage.buckets
  set file_size_limit = 5242880,
      allowed_mime_types = array['image/png','image/jpeg','image/webp']
  where id in ('listings', 'avatars');


-- >>>>>>>>>> 20260617000000_hardening_email_and_orders_fk.sql <<<<<<<<<<
-- ============================================================
-- Durcissement audit #4 — C1 (email non modifiable), C5 (factures préservées)
-- ============================================================

-- C1 — Anti-escalade de privilèges (défense en profondeur).
-- L'autorisation admin par email repose désormais, côté application, sur l'email
-- VÉRIFIÉ d'auth.users (lib/queries.ts). En complément, on interdit à l'utilisateur
-- de modifier lui-même sa colonne `profiles.email` (que la policy profiles_self_update
-- laissait éditable) : sinon il pourrait se faire passer pour un email d'ADMIN_EMAILS.
-- Le rôle était déjà verrouillé (20260612050000) ; on étend le même trigger à l'email.
-- Seul le client service_role (back-office / triggers SECURITY DEFINER) peut écrire
-- ces colonnes — handle_new_user (INSERT) n'est pas concerné (le trigger est BEFORE UPDATE).
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if new.role is distinct from old.role then
      raise exception 'Modification du rôle non autorisée.';
    end if;
    if new.email is distinct from old.email then
      raise exception 'Modification de l''email non autorisée.';
    end if;
  end if;
  return new;
end;
$$;
-- Le trigger trg_prevent_role_change (BEFORE UPDATE ON public.profiles) est déjà en place.

-- C5 — Conservation légale des factures (~10 ans, art. L102B LPF / 242 nonies A CGI).
-- orders.buyer_id était `not null references public.profiles(id) on delete cascade` :
-- supprimer un compte (auth.users → profiles en cascade) DÉTRUISAIT les commandes/factures,
-- contredisant la stratégie d'anonymisation (M4). On bascule en ON DELETE SET NULL :
-- l'identité de facturation reste figée dans le snapshot billing_* de la commande.
alter table public.orders alter column buyer_id drop not null;
alter table public.orders drop constraint if exists orders_buyer_id_fkey;
alter table public.orders
  add constraint orders_buyer_id_fkey
  foreign key (buyer_id) references public.profiles(id) on delete set null;


-- >>>>>>>>>> 20260617000000_invoice_number_manual.sql <<<<<<<<<<
-- Le paiement est désormais validé manuellement par l'admin (flux WhatsApp),
-- il n'y a plus de session Stripe. On attribue le numéro de facture séquentiel
-- dès le passage pending → paid, sans condition sur stripe_session_id.
create or replace function public.assign_invoice_number()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'paid'
     and old.status is distinct from 'paid'
     and new.invoice_number is null then
    new.invoice_number := nextval('public.invoice_number_seq');
  end if;
  return new;
end;
$$;


