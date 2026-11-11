// Assemblage du kit pour le playground : c'est le modèle à copier dans une nouvelle application.
import { configureKit } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";
import ComponentRegistry from "@moussaegh-dot/modulekit-engine/registries/ComponentRegistry.js";
import { registerCrud } from "@moussaegh-dot/modulekit-crud/register.js";
import { registerDashboard } from "@moussaegh-dot/modulekit-dashboard/register.js";

import HomePage from "./pages/HomePage";

export function bootstrapKit() {
  configureKit({
    brand: { name: "ModuleKit Playground", shortName: "Playground", version: "dev" },
    currency: "XOF",
    locale: "fr-FR",
  });

  // Page générique « Crud/Page » : tables + formulaires pilotés par le manifeste.
  registerCrud();

  // Page générique « Dashboard/Page » + widget « StatCard » (widgets filtrés par rôle, données par widget).
  registerDashboard();

  // Pages métier : la clé DOIT correspondre à `ui.pages.<page>.component` du manifeste émis par modulekit-core.
  ComponentRegistry.registerMany({
    "Playground/Home": HomePage,
  });
}
