import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "@moussaegh-dot/modulekit-http/api/axiosClient.js";
import { useAuth } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";


/*
|--------------------------------------------------------------------------
| CONTEXT
|--------------------------------------------------------------------------
*/

export const ModuleContext = createContext({
    modules: {},

    publicModules: {},
    privateModules: {},

    loading: true,
    publicLoading: true,
    privateLoading: false,

    refreshModules: async () => {},
    refreshPublicModules: async () => {},
    refreshPrivateModules: async () => {},
});


/*
|--------------------------------------------------------------------------
| PROVIDER
|--------------------------------------------------------------------------
*/

export function ModuleProvider({ children }) {

    const {
        isAuthenticated,
        initialized: authInitialized,
    } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [publicModules, setPublicModules] = useState({});
    const [privateModules, setPrivateModules] = useState({});

    const [publicLoading, setPublicLoading] = useState(true);
    const [privateLoading, setPrivateLoading] = useState(false);


    /*
    |--------------------------------------------------------------------------
    | PUBLIC MANIFEST
    |--------------------------------------------------------------------------
    */

    const loadPublicModules = useCallback(
        async () => {

            setPublicLoading(true);

            try {

                const {
                    data: response,
                } = await axios.get(
                    "/api/modules/public-manifest"
                );

                setPublicModules(
                    response?.data ?? {}
                );

            } catch (error) {

                console.error(
                    "[ModuleProvider] Public manifest",
                    error.response?.data ?? error
                );

                setPublicModules({});

            } finally {

                setPublicLoading(false);
            }
        },
        []
    );


    /*
    |--------------------------------------------------------------------------
    | PRIVATE MANIFEST
    |--------------------------------------------------------------------------
    */

    const loadPrivateModules = useCallback(
        async () => {

            if (!isAuthenticated) {

                setPrivateModules({});
                setPrivateLoading(false);

                return;
            }

            setPrivateLoading(true);

            try {

                const {
                    data: response,
                } = await axios.get(
                    "/api/modules/manifest"
                );

    // console.log(
    //     "[ModuleProvider] PRIVATE MANIFEST:",
    //     response
    // );

                setPrivateModules(
                    response?.data ?? {}
                );

            } catch (error) {

                console.error(
                    "[ModuleProvider] Private manifest",
                    error.response?.data ?? error
                );

                setPrivateModules({});

            } finally {

                setPrivateLoading(false);
            }
        },
        [
            isAuthenticated,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | INITIAL PUBLIC MANIFEST
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadPublicModules();

    }, [
        loadPublicModules,
    ]);


    /*
    |--------------------------------------------------------------------------
    | INITIAL PRIVATE MANIFEST
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!authInitialized) {
            return;
        }

        loadPrivateModules();

    }, [
        authInitialized,
        loadPrivateModules,
    ]);


    /*
    |--------------------------------------------------------------------------
    | MERGED MODULES
    |--------------------------------------------------------------------------
    */

    const modules = useMemo(
        () => ({
            ...publicModules,
            ...privateModules,
        }),
        [
            publicModules,
            privateModules,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | GLOBAL LOADING
    |--------------------------------------------------------------------------
    |
    | Le routage public ne doit PAS attendre l'authentification.
    |
    */

    const loading =
        publicLoading ||
        (
            isAuthenticated &&
            privateLoading
        );


    /*
    |--------------------------------------------------------------------------
    | REFRESH
    |--------------------------------------------------------------------------
    */

    const refreshModules = useCallback(
        async () => {

            await loadPublicModules();

            if (isAuthenticated) {
                await loadPrivateModules();
            }

        },
        [
            isAuthenticated,
            loadPublicModules,
            loadPrivateModules,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | CONTEXT VALUE
    |--------------------------------------------------------------------------
    */

    const value = useMemo(
        () => ({

            modules,

            publicModules,
            privateModules,

            loading,
            publicLoading,
            privateLoading,

            refreshModules,

            refreshPublicModules:
                loadPublicModules,

            refreshPrivateModules:
                loadPrivateModules,

        }),
        [
            modules,

            publicModules,
            privateModules,

            loading,
            publicLoading,
            privateLoading,

            refreshModules,
            loadPublicModules,
            loadPrivateModules,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <ModuleContext.Provider value={value}>
            {children}
        </ModuleContext.Provider>
    );
}


/*
|--------------------------------------------------------------------------
| HOOK
|--------------------------------------------------------------------------
*/

export function useModules() {

    return useContext(
        ModuleContext
    );
}