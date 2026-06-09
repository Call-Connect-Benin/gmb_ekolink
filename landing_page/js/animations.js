/* =============================================================
   FicheBoost — animations.js
   Animations au scroll via Intersection Observer (zéro listener
   de scroll, performant) + compteurs animés statistiques.
   ============================================================= */
(function () {
    'use strict';

    /* Respect des préférences utilisateur */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Apparition fluide des éléments .reveal ---------- */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            // Fallback : tout devient visible immédiatement
            revealElements.forEach(el => el.classList.add('is-visible'));
        } else {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target); // animation une seule fois
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -8% 0px',
                threshold: 0.12
            });
            revealElements.forEach(el => observer.observe(el));
        }
    }

    /* ---------- 2. Compteurs animés (data-counter) ---------- */
    const counters = document.querySelectorAll('[data-counter]');
    if (counters.length) {
        const animateCounter = (el) => {
            const target = parseFloat(el.getAttribute('data-counter'));
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const duration = 1600;
            const start = performance.now();

            const tick = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuart
                const eased = 1 - Math.pow(1 - progress, 4);
                const value = target * eased;
                el.textContent = value.toLocaleString('fr-FR', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                });
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target.toLocaleString('fr-FR', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                });
            };
            requestAnimationFrame(tick);
        };

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            counters.forEach(el => {
                const target = parseFloat(el.getAttribute('data-counter'));
                const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
                el.textContent = target.toLocaleString('fr-FR', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                });
            });
        } else {
            const counterObserver = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            counters.forEach(el => counterObserver.observe(el));
        }
    }
})();
