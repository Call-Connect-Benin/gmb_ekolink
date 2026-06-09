-- ============================================================
-- Attribue un visuel DISTINCT à chaque fiche du seed.
-- Plusieurs variantes existent par métier (générique + ville) : on les répartit
-- pour ne pas afficher deux fois la même image. L'admin reste libre de changer
-- l'image fiche par fiche ensuite (champ « Image » du formulaire).
-- ============================================================

update public.listings set images = array['/assets/listings/plombier.png']           where slug = 'plombier-paris-11';
update public.listings set images = array['/assets/listings/plombier-toulouse.png']   where slug = 'plombier-marseille';
update public.listings set images = array['/assets/listings/serrurier.png']           where slug = 'serrurier-lyon';
update public.listings set images = array['/assets/listings/serrurier-bordeaux.png']  where slug = 'serrurier-strasbourg';
update public.listings set images = array['/assets/listings/electricien.png']         where slug = 'electricien-bordeaux';
update public.listings set images = array['/assets/listings/electricien-rennes.png']  where slug = 'electricien-toulouse';
update public.listings set images = array['/assets/listings/restaurant.png']          where slug = 'restaurant-paris-9';
update public.listings set images = array['/assets/listings/restaurant-nantes.png']   where slug = 'restaurant-nice';
update public.listings set images = array['/assets/listings/macon.png']               where slug = 'macon-nantes';
update public.listings set images = array['/assets/listings/coiffeur.jpeg']           where slug = 'coiffeur-lille';
