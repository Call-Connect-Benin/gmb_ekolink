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
