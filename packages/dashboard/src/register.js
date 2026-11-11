import ComponentRegistry from "@moussaegh-dot/modulekit-engine/registries/ComponentRegistry.js";
import WidgetRegistry from "@moussaegh-dot/modulekit-engine/registries/WidgetRegistry.js";

import DashboardPage from "./DashboardPage.jsx";
import ListCard from "./widgets/ListCard.jsx";
import StatCard from "./widgets/StatCard.jsx";

/**
 * Enregistre la page générique « Dashboard/Page » et les widgets « StatCard » et « ListCard ».
 * À appeler une fois au démarrage : registerDashboard();
 *
 * Les widgets propres à une application s'ajoutent avec
 * WidgetRegistry.register("NomDuComposant", Composant) : le nom doit
 * correspondre au `component` du widget dans le manifeste.
 */
export function registerDashboard() {
  ComponentRegistry.register("Dashboard/Page", DashboardPage);
  WidgetRegistry.register("StatCard", StatCard);
  WidgetRegistry.register("ListCard", ListCard);
}
