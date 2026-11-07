import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";

import PageService from "@moussaegh-dot/modulekit-engine/pages/services/PageService.js";

export function useCrudData(
    page,
    params = {},
) {

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [data, setData] = useState([]);

    const [meta, setMeta] = useState({});

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | Refs
    |--------------------------------------------------------------------------
    */

    const abortRef = useRef(null);

    /*
    |--------------------------------------------------------------------------
    | Keys
    |--------------------------------------------------------------------------
    */

    const moduleKey = page?.module?.identity?.key;

    const pageKey = page?.pageKey;

    /*
    |--------------------------------------------------------------------------
    | Fetch
    |--------------------------------------------------------------------------
    */

    const fetchData = useCallback(async () => {

        if (!page) {
            return;
        }

        abortRef.current?.abort();

        const controller = new AbortController();

        abortRef.current = controller;

        setLoading(true);
        setError(null);

        try {

            const response = await PageService.list(
                page,
                params,
                {
                    signal: controller.signal,
                }
            );

                // console.log("CRUD API RESPONSE", response);
                // console.log("CRUD SET DATA", response.data);
            setData(response?.data ?? []);

            setMeta(response);

        } catch (error) {

            if (error.name !== "CanceledError") {
                setError(error);
            }

        } finally {

            setLoading(false);

        }

    }, [
        page,
        params,
        moduleKey,
        pageKey,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Effects
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        fetchData();

        return () => abortRef.current?.abort();

    }, [fetchData]);

    /*
    |--------------------------------------------------------------------------
    | API
    |--------------------------------------------------------------------------
    */
// console.log(
//     "FETCH PARAMS",
//     params
// );
    return {

        data,

        meta,

        loading,

        error,

        refresh: fetchData,

    };

}