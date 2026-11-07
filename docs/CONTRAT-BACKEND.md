# Contrat front ↔ modulekit-core

Ce que le kit lit et écrit, **déduit de la lecture du code** des packages (`ModuleProvider`, `RouteEngine`, `PageResolver`, `PageService`, `AuthProvider`, `authService`).
Il est exécutable : `lib/contract.mjs` (validateurs), `npm run check:contract -- <urlApi>` (contre une API en marche) et la page `/__kit` du playground (contre le manifeste chargé).
Toute divergence avec `modulekit-core` est un bug d'un des deux côtés : voir `CONVENTION.md` pour savoir qui corrige.

## Session (Laravel Sanctum, cookies + XSRF)
| Méthode | URL | Réponse attendue |
|---|---|---|
| GET | `/sanctum/csrf-cookie` | 204 + cookie `XSRF-TOKEN` |
| POST | `/api/auth/login` | session ouverte (corps ignoré) |
| POST | `/api/auth/register` | compte créé (le front enchaîne un login) |
| POST | `/api/auth/logout` | session fermée |
| GET | `/api/auth/user` | `{ user: { id, email, prenom, nom, photo_profil }, roles: [], permissions: ["<module>.<action>"], dashboard_route, navigation: [] }`, éventuellement enveloppé dans `data` ; 401 si non connecté |

`prenom`/`nom` ne sont requis que par `defaultMapUser` : une autre forme d'utilisateur se déclare avec la prop `mapUser` d'`<AuthProvider>`. URLs modifiables par `configureAuthEndpoints()`.

## Manifeste des modules
| Méthode | URL | Réponse |
|---|---|---|
| GET | `/api/modules/public-manifest` | `{ "data": { "<moduleKey>": Module } }` — sans authentification |
| GET | `/api/modules/manifest` | idem pour l'utilisateur connecté ; **fusionné par-dessus** le manifeste public (même clé = remplacée) |

```
Module = {
  identity: { key, label },                       // key : base de /api/<key>
  entity:   { singular, plural, description },
  ui: {
    layout,                                       // défaut des pages
    pages: {
      "<pageKey>": {
        component,                                // clé du ComponentRegistry (ex. "Crud/Page")
        route,                                    // "/institutions/{slug}" ; sans route = inatteignable (sauf routes système)
        layout?, variant?,
        bindings: { table, form, view, filters, actions,   // clé UNIQUE dans ui.tables / forms / views / filters / actions
                    widgets: [], metrics: [] }             // listes de clés dans ui.widgets / ui.metrics
      }
    },
    tables: {}, forms: {}, views: {}, filters: {},
    actions: { "<clé>": { row: [], bulk: [] } },
    widgets: {}, metrics: {}
  }
}
```

### Routage
- Le préfixe `/app` est retiré avant la recherche (`/app/evenements` ≡ `/evenements`).
- Les premiers segments `dashboard`, `auth`, `login`, `register` sont des **routes système** : le module du même nom, page `index`.
- Paramètres de route : `{nom}` (segment entier). Une `route` sans `{}` valide est comparée telle quelle ; deux pages ne doivent pas avoir la même route.
- Sans correspondance, mode « legacy » : `/<layout>/<module>/<page>/<params…>` (2 segments ou plus) ou `/<module>` (1 segment, page `index`).

## CRUD générique (`PageService`) — base `/api/<identity.key>`
| Méthode | URL | Note |
|---|---|---|
| GET | `/api/<key>` | pagination Laravel (`data`, `current_page`, `last_page`…) ; paramètres `page`, `per_page`, recherche, filtres, tri |
| GET | `/api/<key>/<id>` | détail |
| POST | `/api/<key>` | création ; **multipart** si un fichier est présent |
| PUT | `/api/<key>/<id>` | mise à jour ; en multipart : `POST` + `_method=PUT` |
| DELETE | `/api/<key>/<id>` | suppression |
| POST | `/api/<key>/<action>` ou `/api/<key>/<id>/<action>` | action personnalisée |

Validation : `422 { message, errors: { champ: [..] } }`.
Sécurité : `419` → le client rafraîchit le cookie CSRF et rejoue **une** fois ; `401` (hors `/api/auth/user`, `/api/auth/login`) → `onUnauthorized` (session vidée).

## Temps réel (optionnel)
`POST /api/broadcasting/auth` pour les canaux privés ; Reverb via `VITE_REVERB_*` ou `configureRealtime()`.
