-- Bucket de stockage public pour les images des fiches (galerie admin).
-- Lecture publique (bucket public) ; écriture via le client service_role (admin),
-- qui contourne la RLS — aucune policy supplémentaire nécessaire.
insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do update set public = true;
