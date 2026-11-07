// src/modules/auth/services/authService.js

import api from "@moussaegh-dot/modulekit-http/api/axiosClient.js";
import { unwrap } from "@moussaegh-dot/modulekit-http/utils/unwrap.js";

/**
 * Endpoints d'authentification (Laravel Sanctum par défaut).
 * Modifiables via configureAuthEndpoints().
 */
export const authEndpoints = {
  csrf: "/sanctum/csrf-cookie",
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
  user: "/api/auth/user",
};

export function configureAuthEndpoints(overrides = {}) {
  Object.assign(authEndpoints, overrides);
}

/**
 * 🔐 CSRF BOOTSTRAP (safe idempotent)
 */
const ensureCsrf = (() => {
  let csrfPromise = null;

  return async () => {
    if (!csrfPromise) {
      csrfPromise = api.get(authEndpoints.csrf)
        .catch((err) => {
          csrfPromise = null;
          throw err;
        });
    }

    return csrfPromise;
  };
})();

/**
 * 🚪 LOGIN
 */
export const login = async (data) => {
  await ensureCsrf();

  return unwrap(
    await api.post(authEndpoints.login, data)
  );
};

/**
 * 📝 REGISTER
 */
export const register = async (data) => {
  await ensureCsrf();

  return unwrap(
    await api.post(authEndpoints.register, data)
  );
};

/**
 * 🚪 LOGOUT
 */
export const logout = async () => {
  await ensureCsrf();

  return unwrap(
    await api.post(authEndpoints.logout)
  );
};

/**
 * 👤 CURRENT USER
 */
export const fetchUser = async () => {
  await ensureCsrf();

  try {
    return unwrap(
      await api.get(authEndpoints.user)
    );
  } catch (error) {

    if (error.response?.status === 401) {
      return null;
    }

    throw error;
  }
};

/**
 * 🔄 REFRESH USER
 */
export const refreshUser = async () => fetchUser();