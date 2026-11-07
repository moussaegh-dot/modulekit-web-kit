// src/core/router/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

/**
 * 🛡 ProtectedRoute V2
 * 🎯 Access control layer (Auth + Permissions)
 */
export default function ProtectedRoute({
  children,
  permission = null,
  roles = null,
  fallback = null,
  redirectTo = "/auth",
}) {

  const {
    user,
    loading,
    can,
    hasRole,
  } = useAuth();

  /**
   * ⏳ AUTH LOADING
   */
  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="spinner-border" />
      </div>
    );
  }

  /**
   * 🔒 NOT AUTHENTICATED
   */
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  /**
   * 🔐 ROLE CHECK (optional)
   */
  if (roles) {

    const roleArray = Array.isArray(roles)
      ? roles
      : [roles];

    const allowed = roleArray.some(r => hasRole(r));

    if (!allowed) {
      return fallback || (
        <div className="p-4">
          403 - Role Forbidden
        </div>
      );
    }
  }

  /**
   * 🔐 PERMISSION CHECK (advanced)
   */
  if (permission) {

    /**
     * array permissions
     */
    if (Array.isArray(permission)) {

      const allowed = permission.some(p => can(p));

      if (!allowed) {
        return fallback || (
          <div className="p-4">
            403 - Permission Denied
          </div>
        );
      }
    }

    /**
     * single permission / callback / string
     */
    else if (!can(permission)) {

      return fallback || (
        <div className="p-4">
          403 - Forbidden
        </div>
      );
    }
  }

  /**
   * ✅ ACCESS GRANTED
   */
  return children;
}