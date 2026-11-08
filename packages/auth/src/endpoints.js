// Endpoints d'authentification (Laravel Sanctum par défaut).
// Fichier sans dépendance : testable seul et modifiable via configureAuthEndpoints().

export const authEndpoints = {
  csrf: "/sanctum/csrf-cookie",
  login: "/api/auth/login",
  register: "/api/auth/register",
  logout: "/api/auth/logout",
  user: "/api/auth/user",

  // Cycle de vie du compte (modulekit-core / backend de l'application).
  logoutAll: "/api/auth/logout-all",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
  changePassword: "/api/auth/password",
  verifyEmail: "/api/auth/email/verify/{id}/{hash}",
  resendVerification: "/api/auth/email/verification-notification",
};

export function configureAuthEndpoints(overrides = {}) {
  Object.assign(authEndpoints, overrides);
}

/** Remplace les {paramètres} d'un endpoint par des valeurs encodées : fillEndpoint("/a/{id}", { id: "x y" }) → "/a/x%20y". */
export function fillEndpoint(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (_, nom) => encodeURIComponent(String(params[nom] ?? "")));
}
