// API publique du package http.
export { default as api, configureApi, getApiConfig } from "./api/axiosClient.js";
export { unwrap } from "./utils/unwrap.js";
export { extractErrors } from "./utils/extractErrors.js";
export { default as toFormData } from "./utils/toFormData.js";
export { storageUrl } from "./utils/storageUrl.js";
export { createResourceApi } from "./data/createResourceApi.js";
export { usePaginatedResource } from "./data/usePaginatedResource.js";
// Temps réel : importer explicitement "@moussaegh-dot/modulekit-http/realtime/echo.js"
// (laravel-echo et pusher-js sont des dépendances optionnelles).
