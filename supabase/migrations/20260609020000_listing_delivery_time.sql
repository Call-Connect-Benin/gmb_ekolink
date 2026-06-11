-- Délai de livraison éditable par fiche (texte libre, ex. « 24-48h », « 48h », « 3-5 j »).
alter table public.listings
  add column if not exists delivery_time text not null default '24-48h';
