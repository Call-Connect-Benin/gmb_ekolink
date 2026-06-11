-- Ajoute le rôle 'super_admin' (3 rôles : buyer, admin, super_admin).
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('buyer', 'admin', 'super_admin'));
