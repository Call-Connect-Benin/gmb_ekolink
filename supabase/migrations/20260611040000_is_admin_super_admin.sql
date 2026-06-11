-- B1 — La RLS doit reconnaître le rôle super_admin.
-- La dernière définition appliquée (20260608000000_dashboard.sql) ne testait que
-- role = 'admin' et avait perdu le durcissement (security definer / search_path).
-- On redéfinit is_admin() pour inclure super_admin ET restaurer le durcissement.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;
