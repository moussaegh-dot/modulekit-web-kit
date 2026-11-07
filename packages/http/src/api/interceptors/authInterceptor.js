import { getApiConfig } from "../config.js";

// Notifie l'application d'une session expirée (401) sans dépendre d'un module d'auth.
export function registerAuthInterceptor(api) {
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const { authBootstrapUrls, onUnauthorized } = getApiConfig();
      const status = error.response?.status;
      const url = error.config?.url || "";

      const isBootstrap = authBootstrapUrls.some((u) => url.includes(u));

      if (status === 401 && !isBootstrap) {
        onUnauthorized?.(error);
      }

      return Promise.reject(error);
    }
  );
}
