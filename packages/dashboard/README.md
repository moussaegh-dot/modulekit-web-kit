# @moussaegh-dot/modulekit-dashboard

Page de tableau de bord pilotée par le manifeste (pendant front du module `dashboard` de modulekit-core ≥ 0.2).

## Brancher
```js
// bootstrap.js, avant le premier rendu
import { registerDashboard } from "@moussaegh-dot/modulekit-dashboard/register.js";
registerDashboard();                       // « Dashboard/Page » + widget « StatCard »

// widgets propres à l'application
import WidgetRegistry from "@moussaegh-dot/modulekit-engine/registries/WidgetRegistry.js";
WidgetRegistry.register("RevenueSummaryCard", RevenueSummaryCard);
```
Côté noyau, la page du module déclare `component: 'Dashboard/Page'` et chaque widget un `component` (`'StatCard'`, ou le nom d'un widget de l'application).

## Comment ça marche
1. Le manifeste privé ne contient que les widgets autorisés pour les rôles de l'utilisateur.
2. `DashboardPage` affiche ceux listés dans `bindings.widgets` (les clés absentes sont ignorées), dans une grille Bootstrap selon `colSpan`.
3. Chaque widget charge ses données (`GET /api/<module>/widgets/<clé>`) : chargement, erreur et « Réessayer » sont propres à chaque carte.
4. Un composant reçoit `{ widget, data }`. Deux composants génériques sont fournis :
   - `StatCard` (un chiffre) : `data = { value, unit?, details?: [{ label, value?, tone? }] }` ;
   - `ListCard` (une courte liste) : `data = { items: [{ title, subtitle?, meta?, badge?: { label, tone? } }], empty? }`.
   `tone` : `success | warning | danger | info | neutral`.

Aucun terme métier dans ce package : les widgets propres à un métier (revenus, commissions…) vivent dans l'application.
