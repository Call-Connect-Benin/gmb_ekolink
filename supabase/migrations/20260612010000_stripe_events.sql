-- E1 — Idempotence du webhook Stripe : on mémorise les event.id déjà traités
-- pour ne pas rejouer (emails/factures/notifications dupliqués) lors des retries.
create table if not exists public.processed_stripe_events (
  event_id     text primary key,
  processed_at timestamptz not null default now()
);

-- Accès réservé au service_role (le webhook). RLS activée sans policy = aucun
-- accès public ; le service_role contourne la RLS.
alter table public.processed_stripe_events enable row level security;
