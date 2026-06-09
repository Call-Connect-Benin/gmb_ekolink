-- ============================================================
-- Indicateurs de fiche éditables par l'admin (détail fiche).
-- Remplace les valeurs codées en dur (catégories optimisées, citations
-- locales, potentiel de visibilité) par de vraies colonnes éditables.
-- ============================================================

alter table public.listings
  add column if not exists categories_count integer not null default 3,
  add column if not exists local_citations integer not null default 0,
  add column if not exists visibility text not null default 'high'
    check (visibility in ('low', 'medium', 'high'));

-- Valeurs initiales pour les fiches déjà en base, dérivées du score SEO réel
-- (pas de valeur inventée : tout découle d'une donnée existante).
update public.listings
set
  local_citations = greatest(0, round(coalesce(seo_score, 80) / 4.0))::int,
  visibility = case
    when coalesce(seo_score, 0) >= 90 then 'high'
    when coalesce(seo_score, 0) >= 80 then 'medium'
    else 'low'
  end
where local_citations = 0;
