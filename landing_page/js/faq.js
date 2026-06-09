/* =============================================================
   FicheBoost — faq.js
   Accordéon FAQ avec comportement exclusif (une seule question
   ouverte à la fois) + accessibilité clavier (Enter / Espace).
   Note : on s'appuie sur <details>/<summary> natif, on ajoute
   seulement la logique d'exclusivité.
   ============================================================= */
(function () {
    'use strict';

    const items = document.querySelectorAll('.faq-list .faq-item');
    if (!items.length) return;

    items.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                // Ferme les autres items ouverts
                items.forEach(other => {
                    if (other !== item && other.open) other.open = false;
                });
            }
        });
    });

    /* ---------- Ouverture automatique si ancre #faq-X ---------- */
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target && target.classList && target.classList.contains('faq-item')) {
            target.open = true;
        }
    }
})();
