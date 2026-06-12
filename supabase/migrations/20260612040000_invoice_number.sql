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
