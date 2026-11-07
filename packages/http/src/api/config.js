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
  onUnauthorized: null,
};

export function configureApi(options = {}) {
  Object.assign(config, options);
  return config;
}

export function getApiConfig() {
  return config;
}
