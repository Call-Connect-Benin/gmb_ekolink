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
