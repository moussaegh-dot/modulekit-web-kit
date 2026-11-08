// Configuration partagée du client HTTP (modifiable à l'exécution via configureApi).

const viteEnv = (typeof import.meta !== "undefined" && import.meta.env) || {};

const config = {
  baseURL: viteEnv.VITE_API_URL ?? "http://localhost:8000",
  storageBaseURL: viteEnv.VITE_STORAGE_URL ?? null,
  csrfCookiePath: "/sanctum/csrf-cookie",
  // Une 401 sur ces URLs ne déclenche pas onUnauthorized (bootstrap de la session).
  authBootstrapUrls: [
    "/api/user",
    "/api/auth/user",
    "/api/auth/login",
    "/sanctum/csrf-cookie",
  ],
  // Codes d'erreur (champ `code` de la réponse JSON) qui, avec un 403, signifient « session perdue »
  // (ex. compte suspendu) : ils déclenchent onUnauthorized comme une 401. Vide par défaut.
  unauthorizedErrorCodes: [],
  onUnauthorized: null,
};

export function configureApi(options = {}) {
  Object.assign(config, options);
  return config;
}

export function getApiConfig() {
  return config;
}
