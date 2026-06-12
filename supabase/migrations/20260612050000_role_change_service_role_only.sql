-- E1 — Escalade de privilèges : la version précédente du trigger autorisait un
-- changement de rôle dès que public.is_admin() était vrai → un simple admin
-- pouvait se promouvoir super_admin via un UPDATE sur son propre profil.
-- On restreint TOUT changement de `role` au seul client service_role (back-office) :
-- les actions admin légitimes (createUser/updateUserRole/createAdmin) passent déjà
-- par createAdminClient(), donc en service_role.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Modification du rôle non autorisée.';
  end if;
  return new;
end;
$$;
