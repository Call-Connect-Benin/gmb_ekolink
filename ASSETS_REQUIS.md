# Assets à fournir pour reproduire la maquette au pixel

Dépose chaque fichier **exactement au chemin indiqué** (sous `public/`). WebP ou PNG/JPG/SVG acceptés.
Une fois en place, je les branche dans le code.

## 🅰 Prioritaire — visuels qui changent tout

### Logo de marque
| Asset | Emplacement | Format | Dim. |
|---|---|---|---|
| Logo EkoLink (hexagone + texte) | `public/assets/icons/logo.png` *(remplace l'existant)* | PNG transparent ou SVG | ~280×96 |
| (option) Logo vectoriel | `public/assets/icons/logo.svg` | SVG | — |
| Favicon | `app/favicon.ico` *(remplace)* | ICO/PNG | 48×48 |

### « Fiches disponibles » — 6 photos métiers
| Asset | Emplacement | Dim. |
|---|---|---|
| Plombier Toulouse | `public/assets/listings/plombier-toulouse.webp` | 400×300 |
| Serrurier Bordeaux | `public/assets/listings/serrurier-bordeaux.webp` | 400×300 |
| Dentiste Nice | `public/assets/listings/dentiste-nice.webp` | 400×300 |
| Agence Immobilière Lille | `public/assets/listings/immobilier-lille.webp` | 400×300 |
| Restaurant Nantes | `public/assets/listings/restaurant-nantes.webp` | 400×300 |
| Électricien Rennes | `public/assets/listings/electricien-rennes.webp` | 400×300 |

### « Comment ça marche » — 3 illustrations
| Asset | Emplacement | Format | Dim. |
|---|---|---|---|
| Étape 1 (écran + loupe) | `public/assets/illustrations/etape-1-choisir.svg` | SVG/PNG | ~96×96 |
| Étape 2 (carte bancaire + bouclier) | `public/assets/illustrations/etape-2-payer.svg` | SVG/PNG | ~96×96 |
| Étape 3 (enveloppe + check) | `public/assets/illustrations/etape-3-recevoir.svg` | SVG/PNG | ~96×96 |

### Bandeau « Vous avez des fiches à céder ? »
| Asset | Emplacement | Format | Dim. |
|---|---|---|---|
| Illustration mini-dashboard + map | `public/assets/illustrations/partenaire.svg` | SVG/PNG | ~520×360 |

## 🅱 Secondaire — fidélité fine

### Hero — 3 aperçus Google Maps (dans les cartes GBP)
| Asset | Emplacement | Dim. |
|---|---|---|
| Map Serrurier Lyon | `public/assets/maps/serrurier-lyon.webp` | 380×160 |
| Map Plombier Paris | `public/assets/maps/plombier-paris.webp` | 380×160 |
| Map Dentiste Marseille | `public/assets/maps/dentiste-marseille.webp` | 380×160 |
*(ou un seul aperçu générique réutilisé : `public/assets/maps/preview.webp`)*

### « Ressources & conseils » — 3 vignettes d'articles
| Asset | Emplacement | Dim. |
|---|---|---|
| Choisir une fiche | `public/assets/blog/choisir-fiche.webp` | 600×340 |
| SEO local 2026 | `public/assets/blog/seo-local.webp` | 600×340 |
| Revendiquer en 5 étapes | `public/assets/blog/revendiquer-5-etapes.webp` | 600×340 |

### Témoignage
| Asset | Emplacement | Dim. |
|---|---|---|
| Avatar Thomas R. | `public/assets/avatars/thomas.webp` | 96×96 |

## 🅲 Optionnel (sinon je garde mes équivalents)
- Icônes catégories exactes → `public/assets/icons/categories/{plombier,serrurier,dentiste,immobilier,restaurant,electricien}.svg` *(sinon : icônes lucide actuelles)*
- Logos paiement (footer) → `public/assets/payments/{visa,mastercard,paypal,apple-pay}.svg` *(sinon : SVG inline actuels)*
- Formes décoratives du hero → `public/assets/illustrations/hero-shapes.svg` *(sinon : dégradés CSS actuels)*

---

## ⭐ Encore mieux que les assets : le **Figma**
Si tu as le fichier **Figma** de la maquette, partage‑le (ou exporte) : j'en tire les **assets** + les **valeurs exactes** (codes hex, police, tailles, espacements, rayons) → reproduction réellement au pixel.

À défaut, donne‑moi au moins ces **specs** : police utilisée, et 4–5 codes couleur hex exacts du design.
