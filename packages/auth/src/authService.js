// src/modules/auth/services/authService.js

import api from "@moussaegh-dot/modulekit-http/api/axiosClient.js";
import { unwrap } from "@moussaegh-dot/modulekit-http/utils/unwrap.js";

import { authEndpoints, fillEndpoint } from "./endpoints.js";

// Réexport : l'API publique du package ne change pas.
export { authEndpoints, configureAuthEndpoints } from "./endpoints.js";

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

/**
 * 🚪 LOGOUT ALL — ferme toutes les sessions et révoque tous les jetons du compte.
 */
export const logoutAll = async () => {
  await ensureCsrf();

  return unwrap(
    await api.post(authEndpoints.logoutAll)
  );
};

/**
 * 📧 MOT DE PASSE OUBLIÉ — envoie le lien de réinitialisation.
 * La réponse est identique que l'adresse existe ou non (pas d'énumération de comptes).
 */
export const forgotPassword = async (email) => {
  await ensureCsrf();

  return unwrap(
    await api.post(authEndpoints.forgotPassword, { email })
  );
};

/**
 * 🔑 RÉINITIALISATION — { token, email, password, password_confirmation }.
 */
export const resetPassword = async (data) => {
  await ensureCsrf();

  return unwrap(
    await api.post(authEndpoints.resetPassword, data)
  );
};

/**
 * 🔒 CHANGEMENT DE MOT DE PASSE (connecté) — { current_password, password, password_confirmation }.
 */
export const changePassword = async (data) => {
  await ensureCsrf();

  return unwrap(
    await api.put(authEndpoints.changePassword, data)
  );
};

/**
 * ✅ VÉRIFICATION D'E-MAIL — `query` = paramètres du lien reçu (expires, signature),
 * renvoyés tels quels : le serveur contrôle la signature.
 */
export const verifyEmail = async (id, hash, query = {}) =>
  unwrap(
    await api.get(fillEndpoint(authEndpoints.verifyEmail, { id, hash }), { params: query })
  );

/**
 * 📨 RENVOI du lien de vérification (connecté).
 */
export const resendVerification = async () => {
  await ensureCsrf();

  return unwrap(
    await api.post(authEndpoints.resendVerification)
  );
};

