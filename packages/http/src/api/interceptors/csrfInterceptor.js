import { getApiConfig } from "../config.js";

// Rejoue une fois la requête après un 419 (jeton CSRF expiré) en rafraîchissant le cookie Sanctum.
export function registerCsrfInterceptor(api) {
  api.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error.response?.status;

      if (status === 419 && error.config && !error.config._retry) {
        error.config._retry = true;

        await api.get(getApiConfig().csrfCookiePath);

        return api(error.config);
      }

      return Promise.reject(error);
    }
  );
}
