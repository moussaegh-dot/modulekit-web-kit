/**
 * 📁 src/core/crud/hooks/debug/useCrudDebug.js
 * 🎯 CRUD Debug Helper (DEV ONLY)
 */

import { useEffect } from "react";

/**
 * 🚀 useCrudDebug
 */
export const useCrudDebug = (

  config = {},

  data = [],

  meta = {},

  filters = {}

) => {

  /**
   * 🛑 DISABLE IN PRODUCTION
   */
  const isDev =
    import.meta.env.DEV;

  useEffect(() => {

    if (!isDev) {
      return;
    }

    /**
     * 🧠 DEBUG GROUP
     */
    console.groupCollapsed(

      `🧩 CRUD DEBUG → ${
        config?.entity?.plural ||
        "Unknown Module"
      }`

    );

    /**
     * 🧱 CONFIG
     */
    console.log(
      "⚙️ Config:",
      config
    );

    /**
     * 🔎 FILTERS
     */
    console.log(
      "🔎 Filters:",
      filters
    );

    /**
     * 📊 DATA
     */
    console.log(
      "📊 Rows:",
      data
    );

    /**
     * 📄 META
     */
    console.log(
      "📄 Meta:",
      meta
    );

    /**
     * 📈 STATS
     */
    console.table({

      rows:
        Array.isArray(data)
          ? data.length
          : 0,

      current_page:
        meta?.current_page || 1,

      last_page:
        meta?.last_page || 1,

      per_page:
        meta?.per_page || 0,

      total:
        meta?.total || 0

    });

    /**
     * 🔚 END GROUP
     */
    console.groupEnd();

  }, [

    isDev,

    config,

    data,

    meta,

    filters

  ]);

  /**
   * 🚫 NO UI
   */
  return null;
};