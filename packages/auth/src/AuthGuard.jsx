// src/context/AuthGuard.jsx

import {
    useEffect,
} from "react";

import {
    Navigate,
    useLocation,
} from "react-router-dom";

import { useAuth } from "./AuthProvider";


function DefaultFallback() {
    return (
        <div style={{ padding: "3rem", textAlign: "center" }}>
            Chargement...
        </div>
    );
}

export default function AuthGuard({
    children,
    fallback = <DefaultFallback />,
    redirectTo = "/auth",
}) {

    const location =
        useLocation();

    const {
        user,
        loading,
        initialized,
        refreshUser,
    } = useAuth();


    /*
    |--------------------------------------------------------------------------
    | INITIALIZE AUTH
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (initialized) {
            return;
        }

        refreshUser();

    }, [
        initialized,
        refreshUser,
    ]);


    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading || !initialized) {

        return fallback;
    }


    /*
    |--------------------------------------------------------------------------
    | UNAUTHENTICATED
    |--------------------------------------------------------------------------
    */

    if (!user) {

        return (
            <Navigate
                to={redirectTo}
                replace
                state={{
                    from: location,
                }}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATED
    |--------------------------------------------------------------------------
    */

    return children;
}