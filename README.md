# ModuleKit Web

Kit front **React + Vite piloté par manifeste**, pendant de [`modulekit-core`](../modulekit) (Laravel) : le backend décrit les modules (pages, tables, formulaires, actions, permissions), le front les rend. Aucune page ni terme métier dans le kit : chaque application enregistre les siennes.

```
packages/
  http     client Sanctum (CSRF 419, 401), utilitaires, createResourceApi, usePaginatedResource, Echo/Reverb paresseux
  auth     AuthProvider, useAuth, AuthGuard, ProtectedRoute, permissions par module
  engine   ModuleProvider, résolveurs de pages, RouteEngine, registres, configureKit
  shell    MainLayout, Sidebar, Topbar, toasts, thème
  crud     moteur CRUD (table/filtres/pagination) + moteur de formulaires et modales
playground/  application de test du kit (connexion, inspecteur de contrat /__kit)
tools/       check-imports, check-exports, check-contract (+ tests)
docs/        CONTRAT-BACKEND.md · CONVENTION.md · DEVELOPPEMENT.md
```

Couches, sans cycle : `http ← auth ← engine ← shell ← crud`.

## Démarrer
```bash
npm install
cp playground/.env.example playground/.env      # VITE_API_URL → une API modulekit-core
npm run dev                                     # http://localhost:5173
npm run verify                                  # imports + exports + tests, avant chaque commit
npm run check:contract -- http://localhost:8000 --email … --password …   # l'API respecte-t-elle le contrat ?
```

## Brancher le kit dans une application
```js
// src/bootstrap.js — exécuté avant le premier rendu
import { configureKit } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";
import ComponentRegistry from "@moussaegh-dot/modulekit-engine/registries/ComponentRegistry.js";
import { registerCrud } from "@moussaegh-dot/modulekit-crud/register.js";

configureKit({ brand: { name: "Mon App" }, currency: "XOF" });
registerCrud();                                                // page générique "Crud/Page"
ComponentRegistry.registerMany({ "Public/Home": HomePage });   // clés = ui.pages.*.component du manifeste
```
Modèle complet : `playground/src/{bootstrap.js,main.jsx,App.jsx}`. Mode d'emploi, liens locaux et publication : `docs/DEVELOPPEMENT.md`. Règles entre les deux dépôts : `docs/CONVENTION.md`.

## Outils fournis
```js
const evenementsApi = createResourceApi(api, "api/evenements", {
  mesEvenements(params) { return this.get("mes-evenements", params); },
});
const { items, pagination, params, updateParams, loading, error, reload } =
  usePaginatedResource((p, { signal }) => evenementsApi.list(p, { signal }), { per_page: 20 });
```

## Statut
- Vérifié sans bundler : aucune erreur de syntaxe JSX, imports et exports résolus avec la casse exacte, aucun cycle, tests unitaires verts (`http`, `auth`, `engine`, validateurs de contrat, et le CLI de contrat contre une fausse API Sanctum).
- Éprouvé dans l'application EduGuide Mali (branchée sur ces packages).
- **Non exécuté ici** : `npm install`, `vite build` et le playground dans un navigateur.
- Packages publiés en source (JSX) : consommables par un projet Vite/bundler uniquement.
