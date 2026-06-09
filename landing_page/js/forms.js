/* =============================================================
   Ekolink — forms.js
   Gestion partagée des formulaires (contact + tunnel de commande).
   Fonctions :
   - Génération d'un token anti-CSRF (cryptographiquement aléatoire)
   - Honeypot anti-bots
   - Validation HTML5 + messages d'erreur inline
   - Soumission en mode démo (mailto: + console.log)
   ============================================================= */
(function () {
    'use strict';

    /* ---------- Helpers ---------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ---------- Token CSRF (côté front, à valider côté serveur) ---------- */
    const generateToken = () => {
        if (window.crypto && window.crypto.getRandomValues) {
            const arr = new Uint8Array(24);
            window.crypto.getRandomValues(arr);
            return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
        }
        return Date.now().toString(36) + Math.random().toString(36).slice(2);
    };

    const TOKEN_KEY = 'ek_form_token';
    const getOrCreateToken = () => {
        try {
            let t = sessionStorage.getItem(TOKEN_KEY);
            if (!t) {
                t = generateToken();
                sessionStorage.setItem(TOKEN_KEY, t);
            }
            return t;
        } catch {
            return generateToken();
        }
    };

    /* ---------- Validation par champ ---------- */
    const validators = {
        required: (v) => v.trim().length > 0,
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
        tel: (v) => /^[+\d][\d\s.\-()]{6,}$/.test(v.trim()),
        minLength: (v, n) => v.trim().length >= n,
        url: (v) => {
            if (!v.trim()) return true;
            try { new URL(v.trim()); return true; } catch { return false; }
        }
    };

    const validateField = (field) => {
        const group = field.closest('.form-group');
        if (!group) return true;
        const errorEl = group.querySelector('.error-msg');
        let isValid = true;
        let message = '';

        if (field.required && !validators.required(field.value)) {
            isValid = false;
            message = 'Ce champ est obligatoire.';
        } else if (field.type === 'email' && field.value && !validators.email(field.value)) {
            isValid = false;
            message = 'Veuillez saisir un email valide.';
        } else if (field.type === 'tel' && field.value && !validators.tel(field.value)) {
            isValid = false;
            message = 'Numéro de téléphone invalide.';
        } else if (field.dataset.minLength && !validators.minLength(field.value, parseInt(field.dataset.minLength, 10))) {
            isValid = false;
            message = `Minimum ${field.dataset.minLength} caractères.`;
        } else if (field.type === 'url' && !validators.url(field.value)) {
            isValid = false;
            message = 'URL invalide.';
        } else if (field.type === 'checkbox' && field.required && !field.checked) {
            isValid = false;
            message = 'Vous devez cocher cette case pour continuer.';
        }

        group.classList.toggle('has-error', !isValid);
        if (errorEl) errorEl.textContent = message;
        return isValid;
    };

    const validateForm = (form) => {
        const fields = $$('input,textarea,select', form).filter(f =>
            f.type !== 'hidden' &&
            !f.classList.contains('form-honeypot-input') &&
            f.required || f.value
        );
        let isValid = true;
        fields.forEach(f => {
            if (!validateField(f)) isValid = false;
        });
        return isValid;
    };

    /* ---------- Statut visuel ---------- */
    const setStatus = (form, kind, message) => {
        const status = form.querySelector('.form-status');
        if (!status) return;
        status.className = `form-status is-visible is-${kind}`;
        status.textContent = message;
    };

    /* ---------- Anti-bot honeypot check ---------- */
    const isBot = (form) => {
        const hp = form.querySelector('.form-honeypot-input');
        return hp && hp.value.length > 0;
    };

    /* ---------- Soumission démo : mailto + console ---------- */
    const submitDemo = (form, data) => {
        const recipient = form.dataset.recipient || 'contact@ekolink.fr';
        const subject = form.dataset.subject || 'Demande depuis ekolink.dev';

        // Log structuré pour debug / intégration future
        console.info('[Ekolink Form Submission]', {
            form: form.id || form.name,
            timestamp: new Date().toISOString(),
            token: data.token,
            payload: data
        });

        // Compose un mailto: avec le contenu du form
        const lines = Object.entries(data)
            .filter(([key]) => key !== 'token' && key !== 'honeypot' && key !== 'consent')
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');

        const body = encodeURIComponent(`Nouveau message depuis ekolink.dev\n\n${lines}\n\n— Token: ${data.token}`);
        const sub = encodeURIComponent(subject);
        const mailto = `mailto:${recipient}?subject=${sub}&body=${body}`;

        // Petit délai pour visuel de chargement
        return new Promise((resolve) => {
            window.setTimeout(() => {
                window.location.href = mailto;
                resolve(true);
            }, 600);
        });
    };

    /* ---------- Setup de chaque form ayant data-ek-form ---------- */
    const initForm = (form) => {
        // Injection d'un token CSRF
        let tokenInput = form.querySelector('input[name="_token"]');
        if (!tokenInput) {
            tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            form.appendChild(tokenInput);
        }
        tokenInput.value = getOrCreateToken();

        // Validation en temps réel (blur)
        $$('input,textarea,select', form).forEach(field => {
            field.addEventListener('blur', () => {
                if (field.value || field.required) validateField(field);
            });
            field.addEventListener('input', () => {
                if (field.closest('.form-group')?.classList.contains('has-error')) {
                    validateField(field);
                }
            });
        });

        // Soumission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Anti-bot
            if (isBot(form)) {
                console.warn('[Ekolink] Honeypot triggered, submission ignored.');
                setStatus(form, 'success', 'Merci, votre demande a été envoyée.');
                form.reset();
                return;
            }

            if (!validateForm(form)) {
                setStatus(form, 'error', 'Merci de corriger les champs en erreur.');
                const firstError = form.querySelector('.form-group.has-error input, .form-group.has-error textarea, .form-group.has-error select');
                if (firstError) firstError.focus();
                return;
            }

            // Lock submit button + indicateur de chargement
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
            const originalLabel = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Envoi en cours…';
            }
            setStatus(form, 'success', 'Préparation de votre message…');

            // Collecter les données
            const formData = new FormData(form);
            const data = { token: tokenInput.value };
            formData.forEach((value, key) => {
                if (key !== '_token') data[key] = value;
            });

            try {
                await submitDemo(form, data);
                setStatus(form, 'success', 'Votre client mail s’est ouvert. Si rien ne s’est passé, contactez-nous directement à contact@ekolink.fr.');
                form.reset();
                // Rotation du token après usage
                sessionStorage.removeItem(TOKEN_KEY);
                tokenInput.value = getOrCreateToken();
            } catch (err) {
                console.error(err);
                setStatus(form, 'error', 'Une erreur est survenue. Veuillez nous contacter directement à contact@ekolink.fr.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalLabel;
                }
            }
        });
    };

    document.querySelectorAll('form[data-ek-form]').forEach(initForm);

    /* ---------- Tunnel de commande : navigation entre étapes ---------- */
    const initCheckout = () => {
        const wrapper = $('#checkout');
        if (!wrapper) return;

        const panels = $$('.checkout-step-panel', wrapper);
        const stepsUI = $$('.checkout-step', wrapper);
        const dividers = $$('.checkout-divider', wrapper);
        let current = 0;

        const goTo = (idx) => {
            if (idx < 0 || idx >= panels.length) return;
            current = idx;
            panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
            stepsUI.forEach((s, i) => {
                s.classList.toggle('is-active', i === idx);
                s.classList.toggle('is-done', i < idx);
            });
            dividers.forEach((d, i) => d.classList.toggle('is-active', i < idx));
            // Scroll en haut du tunnel
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Focus sur le premier champ de l'étape
            const first = panels[idx].querySelector('input,textarea,select,button');
            if (first) window.setTimeout(() => first.focus(), 320);
        };

        // Bouton "Suivant" et "Précédent"
        $$('[data-checkout-next]', wrapper).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const panel = panels[current];
                // Valider les champs visibles de l'étape avant d'avancer
                const fields = $$('input,textarea,select', panel).filter(f =>
                    f.type !== 'hidden' && !f.classList.contains('form-honeypot-input')
                );
                let ok = true;
                fields.forEach(f => { if (!validateField(f)) ok = false; });
                if (!ok) {
                    const first = panel.querySelector('.form-group.has-error input, .form-group.has-error textarea, .form-group.has-error select');
                    if (first) first.focus();
                    return;
                }
                goTo(current + 1);
            });
        });
        $$('[data-checkout-prev]', wrapper).forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                goTo(current - 1);
            });
        });

        // Pré-sélectionner le plan via paramètre URL ?plan=starter|pro|agence
        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');
        if (plan) {
            const planRadio = $(`input[name="plan"][value="${plan}"]`, wrapper);
            if (planRadio) {
                planRadio.checked = true;
                planRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    };
    initCheckout();
})();
