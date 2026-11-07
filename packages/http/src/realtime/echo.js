import Echo from "laravel-echo";
import Pusher from "pusher-js";

import api from "../api/axiosClient.js";

const viteEnv = (typeof import.meta !== "undefined" && import.meta.env) || {};

let options = {};
let instance = null;

/**
 * Surcharge la configuration Reverb (sinon variables VITE_REVERB_*).
 * Réinitialise l'instance : le prochain accès la recrée.
 */
export function configureRealtime(newOptions = {}) {
  options = { ...options, ...newOptions };
  instance = null;
}

/**
 * Instance Echo créée à la demande (plus d'effet de bord à l'import).
 */
export function getEcho() {
  if (instance) {
    return instance;
  }

  window.Pusher = Pusher;

  const port = Number(options.port ?? viteEnv.VITE_REVERB_PORT ?? 8080);
  const scheme = options.scheme ?? viteEnv.VITE_REVERB_SCHEME ?? "http";
  const authEndpoint = options.authEndpoint ?? "/api/broadcasting/auth";

  instance = new Echo({
    broadcaster: "reverb",
    key: options.key ?? viteEnv.VITE_REVERB_APP_KEY,
    wsHost: options.host ?? viteEnv.VITE_REVERB_HOST,
    wsPort: port,
    wssPort: port,
    forceTLS: scheme === "https",
    enabledTransports: ["ws", "wss"],
    authorizer: (channel) => ({
      authorize: (socketId, callback) => {
        api
          .post(authEndpoint, {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => callback(false, response.data))
          .catch((error) => callback(true, error));
      },
    }),
  });

  return instance;
}

// Compatibilité : `import echo from ".../echo.js"` continue de fonctionner (accès paresseux).
const echo = new Proxy(
  {},
  {
    get(_, prop) {
      const e = getEcho();
      const value = e[prop];
      return typeof value === "function" ? value.bind(e) : value;
    },
  }
);

export default echo;
