// src/modules/auth/context/AuthContext.jsx

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
    fetchUser,
} from "./authService";

import { AuthState } from "./authState";
import { configureApi } from "@moussaegh-dot/modulekit-http/api/axiosClient.js";
import ModulePermissionAdapter from "./ModulePermissionAdapter";


const AuthContext = createContext(null);

// Une 401 hors bootstrap vide la session (remplace l'ancien import direct du http vers l'auth).
configureApi({
    onUnauthorized: () => AuthState.setUser(null),
});

/**
 * Transforme la réponse de GET /api/auth/user en utilisateur du front.
 * Remplaçable via la prop `mapUser` de <AuthProvider>.
 */
export function defaultMapUser(payload) {
    const user = payload.user;

    return {
        id: user.id,
        fullName: `${user.prenom ?? ""} ${user.nom ?? ""}`.trim(),
        email: user.email,
        roles: payload.roles ?? [],
        permissions: payload.permissions ?? [],
        dashboardRoute: payload.dashboard_route ?? "/",
        photo_profil: user.photo_profil,
    };
}


/**
 * 🔐 AUTH PROVIDER
 *
 * Responsabilités :
 *
 * - conserver l'utilisateur courant
 * - exposer les permissions / rôles
 * - gérer login / register / logout
 * - permettre le chargement explicite de la session
 *
 * IMPORTANT :
 * Le provider ne charge PAS automatiquement l'utilisateur.
 *
 * Cela permet au contexte public de fonctionner sans appeler
 * /api/auth/user.
 */
export function AuthProvider({ children, mapUser = defaultMapUser }) {

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [user, setUser] = useState(
        AuthState.getUser()
    );

    const [userMenu, setUserMenu] = useState([]);

    const [loading, setLoading] = useState(false);

    const [authLoading, setAuthLoading] = useState(false);

    const [initialized, setInitialized] = useState(
        !!AuthState.getUser()
    );


    /*
    |--------------------------------------------------------------------------
    | SYNC GLOBAL AUTH STATE
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const unsubscribe =
            AuthState.subscribe(setUser);

        return unsubscribe;

    }, []);


    /*
    |--------------------------------------------------------------------------
    | DERIVED STATE
    |--------------------------------------------------------------------------
    */

    const isAuthenticated = useMemo(
        () => !!user?.id,
        [user]
    );


    /*
    |--------------------------------------------------------------------------
    | PERMISSION ADAPTER
    |--------------------------------------------------------------------------
    */

    const permissionAdapter = useMemo(
        () =>
            new ModulePermissionAdapter(
                user?.permissions ?? []
            ),
        [user?.permissions]
    );


    /*
    |--------------------------------------------------------------------------
    | AUTH HELPERS
    |--------------------------------------------------------------------------
    */

    const clearAuth = useCallback(() => {

        AuthState.setUser(null);

        setUserMenu([]);

    }, []);


    const hasRole = useCallback(
        (role) =>
            user?.roles?.includes(role) ?? false,
        [user]
    );


    const can = useCallback(
        (permission) =>
            permissionAdapter.can(permission),
        [permissionAdapter]
    );


    const canModule = useCallback(
        (moduleKey, action) =>
            permissionAdapter.canModule(
                moduleKey,
                action
            ),
        [permissionAdapter]
    );


    const getModulePermissions = useCallback(
        (moduleKey) =>
            permissionAdapter.getModule(
                moduleKey
            ),
        [permissionAdapter]
    );


    /*
    |--------------------------------------------------------------------------
    | LOAD CURRENT USER
    |--------------------------------------------------------------------------
    |
    | Cette fonction est volontairement explicite.
    |
    | Elle sera appelée par AuthGuard lorsqu'une route protégée
    | nécessite de connaître la session.
    |
    */

    const loadUser = useCallback(
        async (globalLoading = true) => {

            if (globalLoading) {
                setLoading(true);
            }

            try {

                const response =
                    await fetchUser();

                const userData =
                    response?.data ?? response;


                /*
                |--------------------------------------------------------------------------
                | NO AUTHENTICATED USER
                |--------------------------------------------------------------------------
                */

                if (!userData?.user) {

                    clearAuth();

                    return null;
                }


                /*
                |--------------------------------------------------------------------------
                | NORMALIZE USER
                |--------------------------------------------------------------------------
                */

                const formattedUser = mapUser(userData);


                /*
                |--------------------------------------------------------------------------
                | SAVE AUTH STATE
                |--------------------------------------------------------------------------
                */

                AuthState.setUser(
                    formattedUser
                );


                setUserMenu(
                    userData.navigation ?? []
                );


                return formattedUser;

            } catch (error) {

                clearAuth();

                return null;

            } finally {

                setInitialized(true);

                if (globalLoading) {
                    setLoading(false);
                }
            }
        },
        [clearAuth, mapUser]
    );


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    const login = useCallback(
        async (credentials) => {

            setAuthLoading(true);

            try {

                await loginRequest(
                    credentials
                );

                return await loadUser(false);

            } catch (error) {

                console.error(
                    "[Auth] login error",
                    error
                );

                throw error;

            } finally {

                setAuthLoading(false);
            }
        },
        [loadUser]
    );


    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

    const registerUser = useCallback(
        async (formData) => {

            setAuthLoading(true);

            try {

                await registerRequest(
                    formData
                );

                return await login({
                    email: formData.email,
                    password: formData.password,
                });

            } catch (error) {

                console.error(
                    "[Auth] register error",
                    error
                );

                throw error;

            } finally {

                setAuthLoading(false);
            }
        },
        [login]
    );


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const logout = useCallback(
        async (navigate) => {

            try {

                await logoutRequest();

            } catch (error) {

                console.error(
                    "[Auth] logout error",
                    error
                );

            } finally {

                clearAuth();

                navigate?.("/", {
                    replace: true,
                });
            }
        },
        [clearAuth]
    );


    /*
    |--------------------------------------------------------------------------
    | CONTEXT VALUE
    |--------------------------------------------------------------------------
    */

    const value = useMemo(
        () => ({

            /*
            |--------------------------------------------------------------------------
            | USER
            |--------------------------------------------------------------------------
            */

            user,
            userMenu,


            /*
            |--------------------------------------------------------------------------
            | STATE
            |--------------------------------------------------------------------------
            */

            loading,
            authLoading,
            initialized,

            isAuthenticated,


            /*
            |--------------------------------------------------------------------------
            | AUTHORIZATION
            |--------------------------------------------------------------------------
            */

            hasRole,
            can,
            canModule,
            getModulePermissions,


            /*
            |--------------------------------------------------------------------------
            | ACTIONS
            |--------------------------------------------------------------------------
            */

            login,
            logout,
            register: registerUser,

            refreshUser:
                loadUser,

        }),
        [
            user,
            userMenu,

            loading,
            authLoading,
            initialized,

            isAuthenticated,

            hasRole,
            can,
            canModule,
            getModulePermissions,

            login,
            logout,
            registerUser,
            loadUser,
        ]
    );


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


/**
 * 🔐 AUTH HOOK
 */
export { AuthContext };

export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used within AuthProvider"
        );
    }


    return context;
}