/**
 * Registre générique clé → composant.
 *
 * Les packages du kit ne connaissent AUCUNE page métier : l'application
 * enregistre les siennes au démarrage (voir src/bootstrap de l'application).
 */
export function createRegistry(name, initial = {}) {
  const entries = { ...initial };

  return {
    name,

    register(key, component) {
      entries[key] = component;
      return this;
    },

    registerMany(map = {}) {
      Object.assign(entries, map);
      return this;
    },

    resolve(key) {
      return entries[key] ?? null;
    },

    has(key) {
      return Boolean(entries[key]);
    },

    all() {
      return { ...entries };
    },

    keys() {
      return Object.keys(entries);
    },
  };
}

export default createRegistry;
