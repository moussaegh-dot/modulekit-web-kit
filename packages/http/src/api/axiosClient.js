import axios from "axios";

import { configureApi as configure, getApiConfig } from "./config.js";
import { registerCsrfInterceptor } from "./interceptors/csrfInterceptor.js";
import { registerAuthInterceptor } from "./interceptors/authInterceptor.js";

/**
 * Instance axios unique du kit (Laravel Sanctum, cookies + XSRF).
 * Les intercepteurs sont enregistrés ICI, une seule fois : peu importe
 * quel fichier importe le client, il est toujours complet.
 */
const api = axios.create({
  baseURL: getApiConfig().baseURL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

registerCsrfInterceptor(api);
registerAuthInterceptor(api);

/**
 * Configure le client (baseURL, onUnauthorized, authBootstrapUrls...).
 * À appeler une fois au démarrage de l'application.
 */
export function configureApi(options = {}) {
  const config = configure(options);

  if (options.baseURL) {
    api.defaults.baseURL = options.baseURL;
  }

  return config;
}

export { getApiConfig };
export default api;
