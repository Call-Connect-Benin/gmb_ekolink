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
