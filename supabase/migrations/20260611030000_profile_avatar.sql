-- Photo de profil : colonne avatar_url + bucket de stockage public « avatars ».
-- L'upload se fait via le client service_role (admin) qui contourne la RLS,
-- la lecture est publique (bucket public) — aucune policy supplémentaire requise.
alter table public.profiles add column if not exists avatar_url text;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;
