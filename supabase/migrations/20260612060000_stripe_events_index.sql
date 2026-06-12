-- M17 — Index sur processed_at pour permettre la purge des vieux events Stripe
-- (table d'idempotence à croissance non bornée). Purge à planifier côté ops, ex. :
--   delete from public.processed_stripe_events where processed_at < now() - interval '30 days';
create index if not exists processed_stripe_events_processed_at_idx
  on public.processed_stripe_events (processed_at);
