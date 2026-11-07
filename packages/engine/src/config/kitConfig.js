/**
 * Configuration d'identité et de présentation du kit.
 * Remplace les valeurs en dur (nom de l'app, devise, routes, couleurs de badge).
 *
 *   configureKit({ brand: { name: "Mon App" }, currency: "XOF" });
 */
const config = {
  brand: {
    name: "ModuleKit",
    shortName: "ModuleKit",
    version: "1.0",
  },

  // Routes de l'espace connecté utilisées par le shell (Topbar, Sidebar...).
  routes: {
    login: "/auth",
    home: "/",
    dashboard: "/app/dashboard",
    profile: "/app/profil",
    notifications: "/app/notifications",
  },

  locale: "fr-FR",
  currency: "XOF",

  // Couleurs de badge par valeur (view-badge-{couleur}), fusionnées avec les défauts.
  badgeColors: {
    actif: "success",
    inactif: "neutral",
    en_attente: "warning",
    bloque: "danger",
    admin: "danger",
  },
};

export function configureKit(options = {}) {
  const { brand, routes, badgeColors, ...rest } = options;

  Object.assign(config, rest);

  if (brand) config.brand = { ...config.brand, ...brand };
  if (routes) config.routes = { ...config.routes, ...routes };
  if (badgeColors) config.badgeColors = { ...config.badgeColors, ...badgeColors };

  return config;
}

export function getKitConfig() {
  return config;
}
