-- ============================================================
-- Correction des images de fiches.
-- Le seed initial avait stocké des covers de blog (/assets/images/cover-*.webp)
-- comme image de fiche. On les remplace par les visuels métier de /assets/listings.
-- On ne touche qu'aux lignes encore sur une cover de blog (ou sans image),
-- pour préserver d'éventuelles images personnalisées par l'admin.
-- ============================================================

update public.listings
set images = array['/assets/listings/' || category_slug || '.png']
where category_slug in ('plombier', 'serrurier', 'electricien', 'macon', 'restaurant', 'dentiste', 'immobilier')
  and (array_length(images, 1) is null or images[1] like '/assets/images/cover-%');

-- Métiers sans visuel dédié → image par défaut.
update public.listings
set images = array['/assets/listings/default.png']
where category_slug not in ('plombier', 'serrurier', 'electricien', 'macon', 'restaurant', 'dentiste', 'immobilier')
  and (array_length(images, 1) is null or images[1] like '/assets/images/cover-%');
