/**
 * Fabrique un client d'API REST pour une ressource Laravel.
 *
 *   const evenements = createResourceApi(api, "api/evenements");
 *   evenements.list({ page: 1 });        // GET    api/evenements
 *   evenements.show(3);                  // GET    api/evenements/3
 *   evenements.create(data);             // POST   api/evenements
 *   evenements.update(3, data);          // PUT    api/evenements/3
 *   evenements.destroy(3);               // DELETE api/evenements/3
 *   evenements.action(3, "publier");     // POST   api/evenements/3/publier
 *   evenements.get("mes-evenements");    // GET    api/evenements/mes-evenements
 *
 * Chaque méthode renvoie `response.data` (déjà déballé).
 * `extend` ajoute des méthodes métier sans réécrire BASE_URL partout.
 */
export function createResourceApi(client, basePath, extend = {}) {
  const base = String(basePath).replace(/\/+$/, "");
  const seg = (value) => encodeURIComponent(value);
  const url = (...parts) => [base, ...parts.map(seg)].join("/");
  const data = (promise) => promise.then((response) => response.data);

  const resource = {
    base,

    list: (params = {}, config = {}) =>
      data(client.get(base, { ...config, params })),

    show: (id, params = {}, config = {}) =>
      data(client.get(url(id), { ...config, params })),

    create: (payload, config = {}) =>
      data(client.post(base, payload, config)),

    update: (id, payload, config = {}) =>
      data(client.put(url(id), payload, config)),

    destroy: (id, config = {}) => data(client.delete(url(id), config)),

    // Sous-chemin libre : resource.get("mes-evenements", { page: 2 })
    get: (subPath, params = {}, config = {}) =>
      data(client.get(`${base}/${subPath}`, { ...config, params })),

    post: (subPath, payload = {}, config = {}) =>
      data(client.post(`${base}/${subPath}`, payload, config)),

    // Action sur un enregistrement : POST {base}/{id}/{action}
    action: (id, name, payload = {}, config = {}) =>
      data(client.post(url(id, name), payload, config)),
  };

  return Object.assign(resource, extend);
}

export default createResourceApi;
