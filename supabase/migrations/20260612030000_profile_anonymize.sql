-- M4 — Suppression de compte = anonymisation (RGPD) au lieu d'un effacement en
-- cascade qui détruirait les factures (conservation légale ~10 ans).
-- On marque le profil anonymisé pour l'afficher avec un badge côté admin.
alter table public.profiles add column if not exists anonymized boolean not null default false;
