import { getApiConfig } from "../config.js";

// Notifie l'application d'une session perdue sans dépendre d'un module d'auth :
//  - 401 (session expirée) ;
//  - 403 portant un code déclaré dans unauthorizedErrorCodes (ex. « compte_inactif »).
export function registerAuthInterceptor(api) {
  api.interceptors.response.use(
    (res) => res,
    (error) => {
      const { authBootstrapUrls, onUnauthorized, unauthorizedErrorCodes } = getApiConfig();
      const status = error.response?.status;
      const code = error.response?.data?.code;
      const url = error.config?.url || "";

      const isBootstrap = authBootstrapUrls.some((u) => url.includes(u));

      const sessionLost =
        status === 401 ||
        (status === 403 && Array.isArray(unauthorizedErrorCodes) && unauthorizedErrorCodes.includes(code));

      if (sessionLost && !isBootstrap) {
        onUnauthorized?.(error);
      }

      return Promise.reject(error);
    }
  );
}
