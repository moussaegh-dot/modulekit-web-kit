// src/routes/RouteRenderer.jsx

import {
    useMemo,
} from "react";

import {
    useLocation,
} from "react-router-dom";

import RouteEngine from "./RouteEngine";

import {
    useModules,
} from "../pages/ModuleProvider";

import PageRenderer from "../pages/PageRenderer";
import PageLoader from "../ui/PageLoader";


export default function RouteRenderer() {

    const {
        modules,
        loading,
    } = useModules();


    const {
        pathname,
    } = useLocation();


    /*
    |--------------------------------------------------------------------------
    | RESOLVE ROUTE
    |--------------------------------------------------------------------------
    */

    const route = useMemo(
        () =>
            RouteEngine.resolve(
                pathname,
                modules
            ),
        [
            pathname,
            modules,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | MODULE LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (
            <div>
                <PageLoader />
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | NO MODULE
    |--------------------------------------------------------------------------
    */

    if (!route.moduleKey) {

        return (
            <div>
                Aucun module associé à cette route.
            </div>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | PAGE
    |--------------------------------------------------------------------------
    */

    return (
        <PageRenderer

            moduleKey={
                route.moduleKey
            }

            pageKey={
                route.pageKey
            }

            params={
                route.params
            }

            modules={
                modules
            }

        />
    );
}