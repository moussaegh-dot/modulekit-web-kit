import { getApiConfig } from "../api/config.js";

/**
 * Construit l'URL publique d'un fichier du storage Laravel.
 * Base : VITE_STORAGE_URL, sinon l'URL de l'API (configureApi).
 */
export function storageUrl(path) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const { storageBaseURL, baseURL } = getApiConfig();
  const base = String(storageBaseURL ?? baseURL ?? "").replace(/\/+$/, "");

  const cleanPath = String(path).replace(/\\/g, "/").replace(/^\/+/, "");

  // Le backend renvoie déjà /storage/... ; sinon chemin relatif au disque public.
  return cleanPath.startsWith("storage/")
    ? `${base}/${cleanPath}`
    : `${base}/storage/${cleanPath}`;
}
