import {
    useCallback,
    useMemo,
    useRef,
    useState,
} from "react";

/**
 * 📁 useCrudEngine.js
 *
 * Central state engine for CRUD pages.
 */
export function useCrudEngine(
    page,
    initialState = {},
) {

    /*
    |--------------------------------------------------------------------------
    | Resources
    |--------------------------------------------------------------------------
    */

    const table =
        page?.resources?.table;

    const filters = useMemo(
        () => page?.resources?.filters?.fields ?? [],
        [page?.resources?.filters]
    );

    /*
    |--------------------------------------------------------------------------
    | Initial state
    |--------------------------------------------------------------------------
    */

    const initialStateRef = useRef({

        q: "",

        page: 1,

        per_page:
            table?.descriptor?.per_page ?? 10,

        sort_by:
            table?.descriptor?.default_sort?.column ?? null,

        sort_direction:
            table?.descriptor?.default_sort?.direction ?? "asc",

        ...initialState,

    });

    const [state, setState] = useState(
        initialStateRef.current
    );

    /*
    |--------------------------------------------------------------------------
    | Filter defaults
    |--------------------------------------------------------------------------
    */

    const filterDefaults = useMemo(() => (

        filters.reduce((carry, filter) => {

            if (filter.default !== undefined) {
                carry[filter.key] = filter.default;
            }

            return carry;

        }, {})

    ), [filters]);

    /*
    |--------------------------------------------------------------------------
    | Filters
    |--------------------------------------------------------------------------
    */

    const setFilter = useCallback((key, value) => {

        setState(previous => ({

            ...previous,

            [key]: value,

            page: 1,

        }));

    }, []);

    const setFilters = useCallback((values = {}) => {

        setState(previous => ({

            ...previous,

            ...values,

            page: 1,

        }));

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const setPage = useCallback((page) => {

        setState(previous => ({

            ...previous,

            page: Number(page) || 1,

        }));

    }, []);

    const setPerPage = useCallback((perPage) => {

        setState(previous => ({

            ...previous,

            per_page: Number(perPage) || 10,

            page: 1,

        }));

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Sorting
    |--------------------------------------------------------------------------
    */

    const setSort = useCallback((column) => {

        if (!column) {
            return;
        }

        setState(previous => ({

            ...previous,

            sort_by: column,

            sort_direction:
                previous.sort_by === column &&
                previous.sort_direction === "asc"
                    ? "desc"
                    : "asc",

            page: 1,

        }));

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    const reset = useCallback(() => {

        setState({

            ...initialStateRef.current,

            ...filterDefaults,

        });

    }, [filterDefaults]);

    /*
    |--------------------------------------------------------------------------
    | API params
    |--------------------------------------------------------------------------
    */

    const apiParams = useMemo(() => {

        const params = {

            q: state.q,

            page: state.page,

            per_page: state.per_page,

            sort_by: state.sort_by,

            sort_direction: state.sort_direction,

        };

        filters.forEach(filter => {

            const value = state[filter.key];

            if (
                value !== undefined &&
                value !== null &&
                value !== ""
            ) {
                params[filter.key] = value;
            }

        });

        return params;

    }, [state, filters]);

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    const hasSearch =
        Boolean(state.q);

    const hasSorting =
        Boolean(state.sort_by);

    const isFirstPage =
        state.page === 1;

    return {

        state,

        apiParams,

        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        setFilter,

        setFilters,

        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        setPage,

        setPerPage,

        /*
        |--------------------------------------------------------------------------
        | Sorting
        |--------------------------------------------------------------------------
        */

        setSort,

        /*
        |--------------------------------------------------------------------------
        | Reset
        |--------------------------------------------------------------------------
        */

        reset,

        /*
        |--------------------------------------------------------------------------
        | Helpers
        |--------------------------------------------------------------------------
        */

        hasSearch,

        hasSorting,

        isFirstPage,

    };

}