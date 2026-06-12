-- C2 — Snapshot de facturation figé sur la commande à l'achat.
-- La facture (conservée ~10 ans) doit garder l'identité du client et la
-- désignation à la date d'émission, même après anonymisation RGPD du profil.
alter table public.orders
  add column if not exists billing_name  text,
  add column if not exists billing_email text,
  add column if not exists listing_title text,
  add column if not exists listing_city  text;
