import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook générique « liste paginée Laravel » : remplace les hooks useXxx
 * qui répétaient useState(loading/error) + fetch + params.
 *
 *   const { items, pagination, params, updateParams, loading, error, reload } =
 *     usePaginatedResource((p) => evenementsApi.list(p), { per_page: 20 });
 *
 * `fetcher(params, { signal })` doit renvoyer le corps JSON Laravel
 * ({ data: [...], current_page, last_page, ... }) ou un tableau simple.
 */
export function usePaginatedResource(
  fetcher,
  initialParams = {},
  {
    auto = true,
    errorMessage = "Impossible de charger les données.",
  } = {}
) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const initialRef = useRef(initialParams);
  const abortRef = useRef(null);

  const load = useCallback(
    async (customParams) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const body = await fetcherRef.current(customParams, {
          signal: controller.signal,
        });

        setItems(Array.isArray(body) ? body : body?.data ?? []);
        setPagination(Array.isArray(body) ? null : body ?? null);

        return body;
      } catch (err) {
        if (err?.name === "CanceledError" || err?.name === "AbortError") {
          return undefined;
        }

        setError(err?.response?.data?.message ?? errorMessage);
        throw err;
      } finally {
        if (abortRef.current === controller) {
          setLoading(false);
        }
      }
    },
    [errorMessage]
  );

  useEffect(() => {
    if (!auto) {
      return undefined;
    }

    load(params).catch(() => {});

    return () => abortRef.current?.abort();
  }, [auto, load, params]);

  const reload = useCallback(() => load(params), [load, params]);

  const updateParams = useCallback((next) => {
    setParams((current) => ({ ...current, ...next }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(initialRef.current);
  }, []);

  return {
    items,
    pagination,
    params,
    updateParams,
    resetParams,
    loading,
    error,
    reload,
  };
}

export default usePaginatedResource;
