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
