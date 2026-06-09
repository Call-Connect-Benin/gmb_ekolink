-- ============================================================
-- Supprime les tables HORS périmètre CDC (modules retirés).
-- Le CDC ne prévoit que : listings, orders, profiles, categories,
-- reviews (Phase 2) et documents (Mon compte).
-- À exécuter dans Supabase → SQL Editor.
-- ============================================================
drop table if exists public.companies      cascade;
drop table if exists public.promo_codes    cascade;
drop table if exists public.campaigns       cascade;
drop table if exists public.newsletters    cascade;
drop table if exists public.tickets        cascade;
drop table if exists public.contacts       cascade;
drop table if exists public.notifications  cascade;
drop table if exists public.activity_log   cascade;
-- (roles conservée : page Rôles & Permissions réactivée à la demande)
