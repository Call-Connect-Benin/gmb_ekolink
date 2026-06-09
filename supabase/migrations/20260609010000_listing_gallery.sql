-- ============================================================
-- Galerie d'images de fiche : l'admin peut ajouter plusieurs images,
-- chacune avec son titre (légende). Stocké en JSONB : [{ "url", "title" }].
-- Le tableau `images` (text[]) reste alimenté avec les URLs de la galerie
-- pour la compatibilité (vignette du catalogue = 1re image).
-- ============================================================

alter table public.listings
  add column if not exists gallery jsonb not null default '[]'::jsonb;

-- Backfill : convertit les images existantes en entrées de galerie (titre vide).
update public.listings
set gallery = coalesce(
  (
    select jsonb_agg(jsonb_build_object('url', img, 'title', ''))
    from unnest(images) as img
    where img is not null and img <> ''
  ),
  '[]'::jsonb
)
where gallery = '[]'::jsonb;
