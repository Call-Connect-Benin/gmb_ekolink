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
