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
