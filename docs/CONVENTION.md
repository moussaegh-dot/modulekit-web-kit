# Convention modulekit-core ↔ modulekit-web

Deux dépôts, un contrat. `modulekit-core` (Laravel, Composer) **émet** ; `modulekit-web` (React, npm) **consomme**. Le contrat est décrit dans `CONTRAT-BACKEND.md` et exécutable (`npm run check:contract`).

## Qui possède quoi
| Sujet | Propriétaire | L'autre côté |
|---|---|---|
| Forme du manifeste (`identity`, `entity`, `ui.*`) | **core** | le kit la lit ; il ne devine pas |
| Clés de composants (`ui.pages.*.component`) | **l'application** | le core ne fait que les citer ; le front les enregistre (`ComponentRegistry`) |
| Format de `/api/auth/user` | **core** | le kit s'adapte via `mapUser` / `configureAuthEndpoints` |
| Rendu, composants UI, thèmes | **kit** | le core n'a rien à en savoir |
| Noms des variables d'environnement `VITE_*` | **kit** | les apps les définissent |

Règle : **le kit ne contient aucune clé de page ni aucun terme métier** (EduGuide, Car Rental…). Un mot du domaine dans `packages/` est un bug.

## Évolution du contrat (dans cet ordre)
1. Ouvrir la modification dans le dépôt qui possède le sujet (tableau ci-dessus).
2. Mettre à jour `docs/CONTRAT-BACKEND.md` **et** `tools/lib/contract.mjs` dans `modulekit-web` ; recopier le `.md` dans `modulekit-core/docs/`.
3. Ajouter ou adapter un test dans `tools/test/contract.test.mjs`.
4. Changement **cassant** (champ supprimé/renommé, forme modifiée) → version majeure (ou mineure tant qu'on est en `0.x`) des deux côtés et ligne ajoutée au tableau ci-dessous.
5. Changement **additif** (nouveau champ optionnel) → le kit ignore ce qu'il ne connaît pas : aucune coordination nécessaire.

## Versions compatibles
Même numéro mineur des deux côtés tant qu'on est en `0.x`. À compléter à chaque release :

| modulekit-web (packages `@moussaegh-dot/modulekit-*`) | modulekit-core | Notes |
|---|---|---|
| 0.1.x | 0.x (à préciser) | extraction initiale ; contrat = `CONTRAT-BACKEND.md` |

## Vérifier avant de livrer (dans chacun des deux dépôts)
```bash
# API lancée (php artisan serve) ; compte de test pour tester la session et le manifeste privé
npm run check:contract -- http://localhost:8000 --email admin@example.com --password secret \
    --components Crud/Page,Playground/Home
```
Sans identifiants, seul le manifeste public est vérifié. Le script teste aussi le cycle Sanctum complet (cookie CSRF → login → `/api/auth/user` → manifeste privé → logout). `--origin` doit correspondre à un domaine de `SANCTUM_STATEFUL_DOMAINS` (défaut `http://localhost:5173`).
Côté `modulekit-core`, le plus simple est un test de fonctionnalité qui appelle `/api/modules/public-manifest` et vérifie la même structure (liens dans `CONTRAT-BACKEND.md`).
