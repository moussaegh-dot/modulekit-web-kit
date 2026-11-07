const SYSTEM_ROUTES = [
    "dashboard",
    "auth",
    "login",
    "register",
];

class RouteEngine {

    /*
    |--------------------------------------------------------------------------
    | RESOLVE
    |--------------------------------------------------------------------------
    */

    resolve(pathname, modules = {}) {

        /*
        |--------------------------------------------------------------------------
        | 1. SYSTEM ROUTES
        |--------------------------------------------------------------------------
        */

        const systemRoute =
            this.resolveSystemRoute(pathname);

        if (systemRoute) {
            return systemRoute;
        }

        /*
        |--------------------------------------------------------------------------
        | 2. MANIFEST ROUTES
        |--------------------------------------------------------------------------
        */

        const manifestRoute =
            this.resolveManifestRoute(
                pathname,
                modules
            );

        if (manifestRoute) {
            return manifestRoute;
        }

        /*
        |--------------------------------------------------------------------------
        | 3. LEGACY
        |--------------------------------------------------------------------------
        */

        return {
            ...this.parse(pathname),
            source: "legacy",
        };
    }


    /*
    |--------------------------------------------------------------------------
    | SYSTEM ROUTES
    |--------------------------------------------------------------------------
    */

    resolveSystemRoute(pathname) {

        const segments =
            this.segments(pathname);

        if (!segments.length) {
            return null;
        }

        const first =
            segments[0];

        if (!SYSTEM_ROUTES.includes(first)) {
            return null;
        }

        return {
            layout: "system",
            moduleKey: first,
            pageKey: "index",
            params: segments.slice(1),
            isSystemRoute: true,
            source: "system",
        };
    }


    /*
    |--------------------------------------------------------------------------
    | NORMALIZE APP PATH
    |--------------------------------------------------------------------------
    |
    | /app/catalogue/produits
    |          ↓
    | /catalogue/produits
    |
    | /catalogue/produits
    |          ↓
    | /catalogue/produits
    |
    */

    normalizePath(pathname) {

        if (!pathname) {
            return "/";
        }

        let path =
            pathname.trim();

        if (!path.startsWith("/")) {
            path = `/${path}`;
        }

        /*
        |--------------------------------------------------------------------------
        | Remove trailing slash
        |--------------------------------------------------------------------------
        */

        if (
            path.length > 1 &&
            path.endsWith("/")
        ) {
            path =
                path.slice(0, -1);
        }

        /*
        |--------------------------------------------------------------------------
        | Remove /app prefix
        |--------------------------------------------------------------------------
        */

        if (path === "/app") {
            return "/";
        }

        if (path.startsWith("/app/")) {
            path =
                path.slice("/app".length);
        }

        return path || "/";
    }


    /*
    |--------------------------------------------------------------------------
    | MANIFEST ROUTES
    |--------------------------------------------------------------------------
    */

    resolveManifestRoute(
        pathname,
        modules
    ) {

        const normalizedPath =
            this.normalizePath(pathname);

        const routes = [];


        /*
        |--------------------------------------------------------------------------
        | COLLECT
        |--------------------------------------------------------------------------
        */

        for (
            const [moduleKey, module]
            of Object.entries(modules || {})
        ) {

            const pages =
                module?.ui?.pages || {};

            for (
                const [pageKey, page]
                of Object.entries(pages)
            ) {

                if (!page?.route) {
                    continue;
                }

                routes.push({
                    moduleKey,
                    pageKey,
                    page,
                });
            }
        }


        /*
        |--------------------------------------------------------------------------
        | PRIORITY
        |--------------------------------------------------------------------------
        |
        | Static routes before dynamic routes.
        |
        | /catalogue/produits
        | /catalogue/produits/{produit}
        |
        */

        routes.sort((a, b) => {

            const aSegments =
                this.segments(
                    a.page.route
                );

            const bSegments =
                this.segments(
                    b.page.route
                );

            /*
            |--------------------------------------------------------------------------
            | More segments first
            |--------------------------------------------------------------------------
            */

            if (
                aSegments.length !==
                bSegments.length
            ) {

                return (
                    bSegments.length -
                    aSegments.length
                );
            }


            /*
            |--------------------------------------------------------------------------
            | Fewer dynamic parameters first
            |--------------------------------------------------------------------------
            */

            const aDynamic =
                aSegments.filter(
                    segment =>
                        this.isDynamicSegment(segment)
                ).length;

            const bDynamic =
                bSegments.filter(
                    segment =>
                        this.isDynamicSegment(segment)
                ).length;

            return (
                aDynamic -
                bDynamic
            );
        });


        /*
        |--------------------------------------------------------------------------
        | MATCH
        |--------------------------------------------------------------------------
        */

        for (
            const {
                moduleKey,
                pageKey,
                page,
            }
            of routes
        ) {

            const match =
                this.match(
                    normalizedPath,
                    page.route
                );

            if (!match) {
                continue;
            }

            return {

                /*
                |--------------------------------------------------------------------------
                | Page layout > Module layout > app
                |--------------------------------------------------------------------------
                */

                layout:
                    page.layout ??
                    modules?.[moduleKey]?.ui?.layout ??
                    "app",

                moduleKey,

                pageKey,

                params:
                    match.params,

                source:
                    "manifest",
            };
        }

        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | MATCH
    |--------------------------------------------------------------------------
    */

    match(
        pathname,
        route
    ) {

        const routeSegments =
            this.segments(route);

        const pathSegments =
            this.segments(pathname);


        /*
        |--------------------------------------------------------------------------
        | SEGMENT COUNT
        |--------------------------------------------------------------------------
        */

        if (
            routeSegments.length !==
            pathSegments.length
        ) {
            return null;
        }


        const params = {};


        /*
        |--------------------------------------------------------------------------
        | SEGMENTS
        |--------------------------------------------------------------------------
        */

        for (
            let i = 0;
            i < routeSegments.length;
            i++
        ) {

            const routeSegment =
                routeSegments[i];

            const pathSegment =
                pathSegments[i];


            /*
            |--------------------------------------------------------------------------
            | DYNAMIC
            |--------------------------------------------------------------------------
            */

            const parameter =
                routeSegment.match(
                    /^\{([^}]+)\}$/
                );

            if (parameter) {

                params[
                    parameter[1]
                ] =
                    decodeURIComponent(
                        pathSegment
                    );

                continue;
            }


            /*
            |--------------------------------------------------------------------------
            | STATIC
            |--------------------------------------------------------------------------
            */

            if (
                routeSegment !==
                pathSegment
            ) {

                return null;
            }
        }


        return {
            params,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | DYNAMIC SEGMENT
    |--------------------------------------------------------------------------
    */

    isDynamicSegment(segment) {

        return (
            typeof segment === "string" &&
            /^\{[^}]+\}$/.test(segment)
        );
    }


    /*
    |--------------------------------------------------------------------------
    | SEGMENTS
    |--------------------------------------------------------------------------
    */

    segments(pathname) {

        if (!pathname) {
            return [];
        }

        return pathname
            .replace(/^\/+|\/+$/g, "")
            .split("/")
            .filter(Boolean);
    }


    /*
    |--------------------------------------------------------------------------
    | LEGACY PARSER
    |--------------------------------------------------------------------------
    */

    parse(pathname) {

        const segments =
            this.segments(pathname);

        let layout = "default";
        let moduleKey = null;
        let pageKey = "index";
        let params = [];


        /*
        |--------------------------------------------------------------------------
        | ROOT
        |--------------------------------------------------------------------------
        */

        if (!segments.length) {

            return {
                layout,
                moduleKey,
                pageKey,
                params,
            };
        }


        const first =
            segments[0];


        /*
        |--------------------------------------------------------------------------
        | SYSTEM
        |--------------------------------------------------------------------------
        */

        if (
            SYSTEM_ROUTES.includes(first)
        ) {

            return {

                layout: "system",

                moduleKey:
                    first,

                pageKey:
                    "index",

                params:
                    segments.slice(1),

                isSystemRoute:
                    true,
            };
        }


        /*
        |--------------------------------------------------------------------------
        | /layout/module/page
        |--------------------------------------------------------------------------
        */

        if (segments.length >= 2) {

            layout =
                segments[0];

            moduleKey =
                segments[1];

            pageKey =
                segments[2] || "index";

            params =
                segments.slice(3);

            return {
                layout,
                moduleKey,
                pageKey,
                params,
            };
        }


        /*
        |--------------------------------------------------------------------------
        | /module
        |--------------------------------------------------------------------------
        */

        if (segments.length === 1) {

            moduleKey =
                segments[0];

            return {
                layout,
                moduleKey,
                pageKey,
                params,
            };
        }


        return {
            layout,
            moduleKey,
            pageKey,
            params,
        };
    }


    /*
    |--------------------------------------------------------------------------
    | BUILD
    |--------------------------------------------------------------------------
    */

    build(
        layout,
        moduleKey,
        pageKey = "index",
        params = []
    ) {

        return [
            "",
            layout,
            moduleKey,
            pageKey,
            ...params,
        ].join("/");
    }
}


export default new RouteEngine();
