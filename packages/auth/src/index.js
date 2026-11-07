// API publique du package auth.
export {
  AuthProvider,
  AuthContext,
  useAuth,
  defaultMapUser,
} from "./AuthProvider.jsx";
export { AuthState } from "./authState.js";
export { default as AuthGuard } from "./AuthGuard.jsx";
export { default as ProtectedRoute } from "./ProtectedRoute.jsx";
export { default as ModulePermissionAdapter } from "./ModulePermissionAdapter.js";
export {
  login,
  logout,
  register,
  fetchUser,
  authEndpoints,
  configureAuthEndpoints,
} from "./authService.js";
