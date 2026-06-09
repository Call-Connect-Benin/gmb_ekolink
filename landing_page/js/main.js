/* =============================================================
   FicheBoost — main.js
   Scripts principaux : header sticky, menu mobile, smooth scroll,
   année footer, bandeau cookies (RGPD), gestion des CTA tarifs.
   ============================================================= */
(function () {
    'use strict';

    /* ---------- Helpers ---------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ---------- 1. Sticky header avec ombre au scroll ---------- */
    const header = $('#header');
    if (header) {
        let ticking = false;
        const updateHeader = () => {
            if (window.scrollY > 8) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });
        updateHeader();
    }

    /* ---------- 2. Menu mobile (hamburger) ---------- */
    const toggle = $('#nav-toggle');
    const menu = $('#nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        // Fermer le menu après clic sur un lien d'ancre
        $$('#nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        // Fermer le menu avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                toggle.click();
                toggle.focus();
            }
        });
    }

    /* ---------- 3. Smooth scroll fallback (pour anciens navigateurs) ---------- */
    if (!('scrollBehavior' in document.documentElement.style)) {
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const id = link.getAttribute('href');
                if (id && id.length > 1) {
                    const target = document.querySelector(id);
                    if (target) {
                        e.preventDefault();
                        const offset = header ? header.offsetHeight : 0;
                        const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
                        window.scrollTo({ top, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    /* ---------- 4. Année courante dans le footer ---------- */
    const yearEl = $('#current-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ---------- 5. CTA tarifs : tracking analytics avant navigation ---------- */
    // La navigation est gérée nativement par href="html/commander.html?plan=X".
    // On ajoute juste un événement de tracking si Analytics est chargé.
    $$('[data-plan]').forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.getAttribute('data-plan');
            if (window.fbTrack) window.fbTrack('checkout_start', { plan });
        });
    });

    /* ---------- 6. Bandeau cookies (RGPD) ---------- */
    const CONSENT_KEY = 'fb_consent_v1';
    const banner = $('#cookie-banner');
    const acceptBtn = $('#cookie-accept');
    const rejectBtn = $('#cookie-reject');

    const getConsent = () => {
        try { return JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null'); }
        catch { return null; }
    };
    const setConsent = (value) => {
        try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, date: new Date().toISOString() })); }
        catch { /* localStorage indisponible */ }
    };
    const showBanner = () => { if (banner) banner.hidden = false; };
    const hideBanner = () => { if (banner) banner.hidden = true; };

    /**
     * Charge Google Analytics uniquement après consentement explicite.
     * Remplacer 'G-XXXXXXXXXX' par votre ID GA4 réel.
     */
    const loadAnalytics = () => {
        if (window._gaLoaded) return;
        window._gaLoaded = true;
        const GA_ID = 'G-XXXXXXXXXX'; // <-- À remplacer
        if (GA_ID === 'G-XXXXXXXXXX') return; // garde-fou : ne charge pas si non configuré
        const s = document.createElement('script');
        s.async = true;
        s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, { anonymize_ip: true });
        window.fbTrack = (event, params) => window.gtag('event', event, params || {});
    };

    const consent = getConsent();
    if (!consent) {
        // Délai pour ne pas pénaliser le LCP/FCP
        window.setTimeout(showBanner, 1200);
    } else if (consent.value === 'accept') {
        loadAnalytics();
    }

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
        setConsent('accept');
        hideBanner();
        loadAnalytics();
    });
    if (rejectBtn) rejectBtn.addEventListener('click', () => {
        setConsent('reject');
        hideBanner();
    });

    /* ---------- 7. Bouton flottant retour en haut ---------- */
    const backToTopBtn = document.createElement('button');
    backToTopBtn.type = 'button';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Remonter en haut de la page');
    backToTopBtn.setAttribute('title', 'Remonter en haut');
    backToTopBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 19V5"></path>
            <path d="M5 12l7-7 7 7"></path>
        </svg>
    `;
    document.body.appendChild(backToTopBtn);

    const toggleBackToTop = () => {
        const isVisible = window.scrollY > 420;
        backToTopBtn.classList.toggle('is-visible', isVisible);
    };

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(toggleBackToTop);
    }, { passive: true });
    toggleBackToTop();

    /* ---------- 8. Active link tracking (highlight la section visible dans la nav) ---------- */
    const navLinks = $$('#nav-menu a[href^="#"]');
    if (navLinks.length && 'IntersectionObserver' in window) {
        const sections = navLinks
            .map(a => document.querySelector(a.getAttribute('href')))
            .filter(Boolean);
        const linkMap = new Map(navLinks.map(a => [a.getAttribute('href').slice(1), a]));
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(l => l.removeAttribute('aria-current'));
                    const link = linkMap.get(entry.target.id);
                    if (link) link.setAttribute('aria-current', 'true');
                }
            });
        }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
        sections.forEach(s => obs.observe(s));
    }
})();
