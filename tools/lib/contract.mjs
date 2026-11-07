/**
 * Contrat front ↔ modulekit-core : validateurs purs (sans dépendance, sans réseau).
 * Source de vérité de ce que le kit lit dans le manifeste et dans /api/auth/user.
 * Utilisés par `npm run check:contract` et par la page /__kit du playground.
 */

const BINDING_SINGLE = { table: "tables", form: "forms", view: "views", filters: "filters", actions: "actions" };
const BINDING_LIST = { widgets: "widgets", metrics: "metrics" };

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

/**
 * @param {object} modules  contenu de `data` de /api/modules/(public-)manifest
 * @param {{ registeredComponents?: Iterable<string> }} [options]
 * @returns {{ level: "error"|"warn", path: string, message: string }[]}
 */
export function validateManifest(modules, { registeredComponents } = {}) {
  const out = [];
  const err = (path, message) => out.push({ level: "error", path, message });
  const warn = (path, message) => out.push({ level: "warn", path, message });
  const registered = registeredComponents ? new Set(registeredComponents) : null;

  if (!isObj(modules)) {
    err("data", "le manifeste doit être un objet { <moduleKey>: Module }");
    return out;
  }

  const routes = new Map(); // route normalisée -> "module.page"

  for (const [moduleKey, module] of Object.entries(modules)) {
    const at = (p) => `${moduleKey}${p ? "." + p : ""}`;

    if (!isObj(module)) { err(at(), "un module doit être un objet"); continue; }

    if (typeof module.identity?.key !== "string") err(at("identity.key"), "chaîne requise (sert de base à /api/<key>)");
    else if (module.identity.key !== moduleKey) warn(at("identity.key"), `différent de la clé du manifeste ("${moduleKey}")`);
    if (typeof module.identity?.label !== "string") warn(at("identity.label"), "absent (titre de page vide)");

    if (!isObj(module.ui)) { err(at("ui"), "objet requis"); continue; }
    if (!isObj(module.ui.pages)) { err(at("ui.pages"), "objet requis { <pageKey>: descripteur }"); continue; }

    for (const [pageKey, page] of Object.entries(module.ui.pages)) {
      const pat = at(`ui.pages.${pageKey}`);
      if (!isObj(page)) { err(pat, "un descripteur de page doit être un objet"); continue; }

      if (typeof page.component !== "string" || !page.component) err(`${pat}.component`, "chaîne requise (clé du ComponentRegistry)");
      else if (registered && !registered.has(page.component)) warn(`${pat}.component`, `"${page.component}" n'est pas enregistré dans ComponentRegistry`);

      if (page.route == null) {
        if (pageKey !== "index") warn(`${pat}.route`, "absent : page inatteignable (hors routes système dashboard/auth/login/register)");
      } else if (typeof page.route !== "string" || !page.route.startsWith("/")) {
        err(`${pat}.route`, 'doit être une chaîne commençant par "/" (paramètres : {slug})');
      } else {
        const bad = page.route.split("/").filter((s) => /[{}]/.test(s) && !/^\{[^{}]+\}$/.test(s));
        if (bad.length) err(`${pat}.route`, `segment de paramètre invalide : ${bad.join(", ")}`);
        const norm = page.route.replace(/\{[^}]+\}/g, "{}").replace(/\/+$/, "") || "/";
        if (routes.has(norm)) err(`${pat}.route`, `route "${page.route}" déjà utilisée par ${routes.get(norm)}`);
        else routes.set(norm, `${moduleKey}.${pageKey}`);
      }

      const bindings = page.bindings ?? {};
      if (!isObj(bindings)) { err(`${pat}.bindings`, "objet attendu"); continue; }

      for (const [bind, uiKey] of Object.entries(BINDING_SINGLE)) {
        if (bindings[bind] == null) continue;
        if (typeof bindings[bind] !== "string") err(`${pat}.bindings.${bind}`, "clé (chaîne) attendue");
        else if (!isObj(module.ui[uiKey]) || !(bindings[bind] in module.ui[uiKey]))
          err(`${pat}.bindings.${bind}`, `"${bindings[bind]}" absent de ui.${uiKey}`);
      }
      for (const [bind, uiKey] of Object.entries(BINDING_LIST)) {
        if (bindings[bind] == null) continue;
        if (!Array.isArray(bindings[bind])) { err(`${pat}.bindings.${bind}`, "tableau de clés attendu"); continue; }
        for (const k of bindings[bind])
          if (!isObj(module.ui[uiKey]) || !(k in module.ui[uiKey])) err(`${pat}.bindings.${bind}`, `"${k}" absent de ui.${uiKey}`);
      }

      if (page.component === "Crud/Page" && !bindings.table && !bindings.view)
        warn(`${pat}.bindings`, 'Crud/Page sans binding "table" ni "view" : rien à afficher');
    }

    for (const [key, actions] of Object.entries(module.ui.actions ?? {})) {
      if (!isObj(actions)) { err(at(`ui.actions.${key}`), "objet { row: [], bulk: [] } attendu"); continue; }
      for (const k of ["row", "bulk"])
        if (actions[k] != null && !Array.isArray(actions[k])) err(at(`ui.actions.${key}.${k}`), "tableau attendu");
    }
  }

  if (!Object.keys(modules).length) warn("data", "manifeste vide");
  return out;
}

/**
 * @param {object} payload  contenu (déballé) de GET /api/auth/user
 * @param {{ defaultMapUser?: boolean }} [options]  true si le front utilise defaultMapUser (champs prenom/nom)
 */
export function validateUserPayload(payload, { defaultMapUser = true } = {}) {
  const out = [];
  const err = (path, message) => out.push({ level: "error", path, message });
  const warn = (path, message) => out.push({ level: "warn", path, message });

  if (!isObj(payload) || !isObj(payload.user)) { err("user", "objet { user, roles, permissions, ... } requis"); return out; }
  if (payload.user.id == null) err("user.id", "requis");
  if (typeof payload.user.email !== "string") warn("user.email", "absent");
  if (defaultMapUser && payload.user.prenom == null && payload.user.nom == null)
    warn("user", "ni prenom ni nom : fullName vide avec defaultMapUser (sinon fournir mapUser)");

  if (!Array.isArray(payload.roles)) warn("roles", "tableau attendu (défaut : [])");
  if (!Array.isArray(payload.permissions)) warn("permissions", "tableau attendu (défaut : [])");
  else for (const p of payload.permissions)
    if (typeof p !== "string" || !/^[^.\s]+\.[^\s]+$/.test(p)) warn("permissions", `"${p}" ne suit pas le format "<module>.<action>"`);
  if (typeof payload.dashboard_route !== "string") warn("dashboard_route", 'absent : redirection "/" après connexion');
  if (payload.navigation != null && !Array.isArray(payload.navigation)) err("navigation", "tableau attendu");
  return out;
}

export const summarize = (issues) => ({
  errors: issues.filter((i) => i.level === "error").length,
  warnings: issues.filter((i) => i.level === "warn").length,
});
