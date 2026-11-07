import ComponentRegistry from "@moussaegh-dot/modulekit-engine/registries/ComponentRegistry.js";

import CrudPage from "./CrudPage.jsx";

/**
 * Enregistre la page générique « Crud/Page » (tables + formulaires pilotés par le manifeste).
 * À appeler une fois au démarrage : registerCrud();
 */
export function registerCrud() {
  ComponentRegistry.register("Crud/Page", CrudPage);
}
