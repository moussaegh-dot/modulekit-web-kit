import { useCallback, useEffect, useState } from "react";

import api from "@moussaegh-dot/modulekit-http/api/axiosClient.js";
import { unwrap } from "@moussaegh-dot/modulekit-http/utils/unwrap.js";

/**
 * Charge les données d'un widget : GET /api/{module}/widgets/{clé}
 * (réponse { success, data: { key, label, description, component, data } }).
 *
 * Un widget sans source côté serveur (`dynamic` faux) n'appelle rien :
 * il s'affiche à partir de sa description du manifeste.
 */
export default function useWidgetData(moduleKey, widget) {
  const key = widget?.key;
  const enabled = Boolean(widget?.dynamic);

  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: null });
      return undefined;
    }

    let cancelled = false;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    api
      .get(`/api/${encodeURIComponent(moduleKey)}/widgets/${encodeURIComponent(key)}`)
      .then((response) => {
        if (!cancelled) {
          setState({ data: unwrap(response)?.data ?? null, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [moduleKey, key, enabled, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}
