# Développer le kit avec d'autres applications

## Le dépôt
```
packages/    les 5 packages publiables (http, auth, engine, shell, crud)
playground/  application de test du kit (connexion, /__kit, une page enregistrée)
tools/       check-imports, check-exports, check-contract (+ tests)
docs/        contrat, convention, ce guide
```
Les vraies applications (EduGuide, Car Rental, …) vivent **dans leurs propres dépôts** et consomment le kit.

## Boucle de travail quotidienne
```bash
npm install
cp playground/.env.example playground/.env       # VITE_API_URL vers une API modulekit-core
npm run dev                                      # playground sur http://localhost:5173
npm run verify                                   # imports, exports, tests : avant chaque commit
```
Pour l'API : `SANCTUM_STATEFUL_DOMAINS=localhost:5173`, CORS avec `supports_credentials => true` et `sanctum/csrf-cookie` dans les chemins CORS.

## Brancher une application externe pendant qu'on modifie le kit
Deux méthodes, au choix (à vérifier chez toi, je n'ai pas pu les exécuter) :

**A. Liens locaux** (modifications visibles tout de suite, rechargement à chaud)
```bash
cd mon-app && npm install ../modulekit-web/packages/{http,auth,engine,shell,crud}
```
Dans le `vite.config.js` de l'application :
```js
resolve: { dedupe: ["react", "react-dom", "react-router-dom", "axios", "mdb-react-ui-kit", "prop-types"] },
server:  { fs: { allow: [".."] } },
```
Sans `dedupe`, deux copies de React donnent « Invalid hook call ».

**B. Archives** (comportement le plus proche d'un vrai paquet npm)
```bash
cd modulekit-web && npm pack --workspaces --pack-destination ../kit-tarballs
cd ../mon-app && npm install ../kit-tarballs/moussaegh-dot-modulekit-*.tgz
```
À refaire après chaque modification du kit.

## Créer une nouvelle application
Copier le modèle du playground : `src/bootstrap.js` (configuration + enregistrement des pages), `src/main.jsx` (CSS + `bootstrapKit()` avant le rendu), `src/App.jsx` (providers : Toast → Theme → Auth → Module → Modal ; `AuthGuard` ; `MainLayout` ; `RouteRenderer`), une page de connexion. Puis :
1. `npm run check:contract -- <api> --email … --password … --components <vos clés>` ;
2. ouvrir `/__kit` : tout écart (composant non enregistré, binding orphelin, route en double) y est listé.

## Publier
Quand le kit est stable : remplacer `"*"` par `"^0.1.0"` entre packages, ajouter `repository` et `publishConfig.access = "public"` dans chaque `package.json`, créer le scope npm `@moussaegh-dot`, puis `npm publish --workspaces`. Les applications passent alors de liens locaux à `npm install @moussaegh-dot/modulekit-engine@^0.1.0`.
Les packages sont publiés **en source** (JSX, résolu par Vite) : pas d'étape de build, consommables seulement par un projet Vite/bundler.

## Règles de contribution
- Aucun terme métier dans `packages/` (voir `CONVENTION.md`).
- Un package ne dépend que des packages « plus bas » : `http ← auth ← engine ← shell ← crud` (vérifié par `check-imports`).
- Un nouveau comportement configurable passe par `configureKit` / `configureApi` / une prop, jamais par une constante en dur.
- Tout comportement du contrat modifié → `contract.mjs` + test + `CONTRAT-BACKEND.md` dans le même commit.
