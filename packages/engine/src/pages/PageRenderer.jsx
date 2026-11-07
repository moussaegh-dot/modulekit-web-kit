// src/core/pages/PageRenderer.jsx

import {
    useMemo,
} from "react";

import ModuleNotFound
    from "./errors/ModuleNotFound";

import PageNotFound
    from "./errors/PageNotFound";

import ComponentNotFound
    from "./errors/ComponentNotFound";

import PageResolver
    from "./resolvers/PageResolver";


export default function PageRenderer({
    moduleKey,
    pageKey = "index",
    params = {},
    modules,
}) {

    const module =
        modules?.[moduleKey];


    const page = useMemo(
        () => {

            if (!module) {
                return null;
            }

            return PageResolver.resolve(
                module,
                pageKey
            );

        },
        [
            module,
            pageKey,
        ]
    );


    /*
    |--------------------------------------------------------------------------
    | MODULE NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!module) {

        return (
            <ModuleNotFound
                moduleKey={moduleKey}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | PAGE NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!page) {

        return (
            <PageNotFound
                moduleKey={moduleKey}
                pageKey={pageKey}
            />
        );
    }


    /*
    |--------------------------------------------------------------------------
    | COMPONENT NOT FOUND
    |--------------------------------------------------------------------------
    */

    if (!page.component) {

        return (
            <ComponentNotFound
                component={page.componentName}
                moduleKey={moduleKey}
                pageKey={pageKey}
            />
        );
    }


    const PageComponent =
        page.component;


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <PageComponent
            page={page}
            params={params}
        />
    );
}