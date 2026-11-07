/**
 * 🧠 ModulePermissionAdapter
 * 🎯 Indexe les permissions utilisateur pour le frontend.
 */
class ModulePermissionAdapter {

  constructor(userPermissions = []) {
    this.raw = Array.isArray(userPermissions)
      ? userPermissions
      : [];

    this.index = this.buildIndex(this.raw);
  }

  /**
   * 🧠 BUILD INDEX
   *
   * "users.view"
   * "users.create"
   *
   * →
   *
   * {
   *   users: {
   *     view: true,
   *     create: true
   *   }
   * }
   */
  buildIndex(permissions) {

    const index = {};

    permissions.forEach((permission) => {

      if (typeof permission !== "string") {
        return;
      }

      const separatorIndex =
        permission.indexOf(".");

      if (separatorIndex === -1) {
        return;
      }

      const module =
        permission.slice(0, separatorIndex);

      const action =
        permission.slice(separatorIndex + 1);

      if (!module || !action) {
        return;
      }

      if (!index[module]) {
        index[module] = {};
      }

      index[module][action] = true;
    });

    return index;
  }

  /**
   * 📦 RAW PERMISSION CHECK
   *
   * Exemple :
   * can("users.create")
   */
  can(permission) {

    return this.raw.includes(permission);
  }

  /**
   * 🧠 MODULE ACTION CHECK
   *
   * Exemple :
   * canModule("users", "create")
   */
  canModule(moduleKey, action) {

    return Boolean(
      this.index?.[moduleKey]?.[action]
    );
  }

  /**
   * 📊 GET MODULE PERMISSIONS
   *
   * Exemple :
   * getModule("users")
   *
   * →
   * {
   *   viewAny: true,
   *   view: true,
   *   create: true,
   *   update: true,
   *   delete: true
   * }
   */
  getModule(moduleKey) {

    return this.index?.[moduleKey] ?? {};
  }

  /**
   * 📊 GET FULL PERMISSION MAP
   */
  getAll() {

    return this.index;
  }
}

export default ModulePermissionAdapter;