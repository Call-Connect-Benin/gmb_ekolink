-- Nettoyage : les tables `documents` et `roles` ne sont ni lues ni écrites par
-- l'application (l'espace « Mes factures » lit `orders`, la page « Rôles » lit
-- `profiles`). `roles` exposait en plus un seed fictif (permissions_count) en
-- lecture publique. On les supprime.
drop table if exists public.documents cascade;
drop table if exists public.roles cascade;

-- Défense en profondeur storage : restreindre type MIME + taille des buckets
-- d'images (en plus de la validation applicative).
update storage.buckets
  set file_size_limit = 5242880,
      allowed_mime_types = array['image/png','image/jpeg','image/webp']
  where id in ('listings', 'avatars');
