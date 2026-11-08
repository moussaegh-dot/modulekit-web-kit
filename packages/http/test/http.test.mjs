import test from "node:test";
import assert from "node:assert/strict";

import { createResourceApi } from "../src/data/createResourceApi.js";
import { storageUrl } from "../src/utils/storageUrl.js";
import { configureApi, getApiConfig } from "../src/api/config.js";
import { registerAuthInterceptor } from "../src/api/interceptors/authInterceptor.js";
import { registerCsrfInterceptor } from "../src/api/interceptors/csrfInterceptor.js";
import { unwrap } from "../src/utils/unwrap.js";
import { extractErrors } from "../src/utils/extractErrors.js";

// Faux client axios : enregistre les appels et renvoie { data }.
function fakeClient() {
  const calls = [];
  const make = (method) => (...args) => {
    calls.push([method, ...args]);
    return Promise.resolve({ data: { ok: method } });
  };
  return { calls, get: make("get"), post: make("post"), put: make("put"), delete: make("delete") };
}

test("createResourceApi : routes REST standard", async () => {
  const c = fakeClient();
  const api = createResourceApi(c, "api/evenements/");

  assert.deepEqual(await api.list({ page: 2 }), { ok: "get" });
  await api.show(3);
  await api.create({ titre: "x" });
  await api.update(3, { titre: "y" });
  await api.destroy(3);

  assert.deepEqual(c.calls.map((x) => [x[0], x[1]]), [
    ["get", "api/evenements"],
    ["get", "api/evenements/3"],
    ["post", "api/evenements"],
    ["put", "api/evenements/3"],
    ["delete", "api/evenements/3"],
  ]);
  assert.deepEqual(c.calls[0][2].params, { page: 2 });
});

test("createResourceApi : actions, sous-chemins, encodage et extension", async () => {
  const c = fakeClient();
  const api = createResourceApi(c, "api/produits", {
    favoris: function () { return this.get("favoris"); },
  });

  await api.action("a/b", "valider si");
  await api.get("mes-demandes", { statut: "ok" });
  await api.favoris();

  assert.equal(c.calls[0][1], "api/produits/a%2Fb/valider%20si");
  assert.equal(c.calls[1][1], "api/produits/mes-demandes");
  assert.deepEqual(c.calls[1][2].params, { statut: "ok" });
  assert.equal(c.calls[2][1], "api/produits/favoris");
});

test("storageUrl : URL absolue, chemin storage/, chemin relatif, vide", () => {
  configureApi({ baseURL: "http://api.test/", storageBaseURL: null });

  assert.equal(storageUrl(null), null);
  assert.equal(storageUrl("https://cdn.test/a.png"), "https://cdn.test/a.png");
  assert.equal(storageUrl("storage/logos/a.png"), "http://api.test/storage/logos/a.png");
  assert.equal(storageUrl("\\logos\\a.png"), "http://api.test/storage/logos/a.png");

  configureApi({ storageBaseURL: "http://files.test" });
  assert.equal(storageUrl("logos/a.png"), "http://files.test/storage/logos/a.png");
});

test("authInterceptor : 401 notifie sauf sur les URLs de bootstrap", async () => {
  let handler;
  registerAuthInterceptor({ interceptors: { response: { use: (_ok, ko) => (handler = ko) } } });

  let called = 0;
  configureApi({ onUnauthorized: () => called++ });

  await assert.rejects(handler({ response: { status: 401 }, config: { url: "/api/evenements" } }));
  assert.equal(called, 1);

  await assert.rejects(handler({ response: { status: 401 }, config: { url: "/api/auth/user" } }));
  await assert.rejects(handler({ response: { status: 401 }, config: { url: "/api/auth/login" } }));
  await assert.rejects(handler({ response: { status: 500 }, config: { url: "/api/x" } }));
  assert.equal(called, 1);
});

test("csrfInterceptor : un 419 rafraîchit le cookie puis rejoue UNE seule fois", async () => {
  let handler;
  const gets = [];
  const api = Object.assign(
    (config) => Promise.resolve({ replayed: config.url }),
    {
      get: (url) => { gets.push(url); return Promise.resolve(); },
      interceptors: { response: { use: (_ok, ko) => (handler = ko) } },
    }
  );
  registerCsrfInterceptor(api);

  const config = { url: "/api/x" };
  const res = await handler({ response: { status: 419 }, config });
  assert.deepEqual(res, { replayed: "/api/x" });
  assert.deepEqual(gets, [getApiConfig().csrfCookiePath]);

  // deuxième 419 sur la même requête : pas de boucle infinie
  await assert.rejects(handler({ response: { status: 419 }, config }));
  assert.equal(gets.length, 1);
});

test("unwrap / extractErrors", () => {
  assert.deepEqual(unwrap({ data: { data: [1, 2] } }), [1, 2]);
  assert.deepEqual(unwrap({ data: { id: 1 } }), { id: 1 });
  assert.deepEqual(unwrap([1]), [1]);

  assert.deepEqual(extractErrors({ response: { data: { errors: { email: ["x"] }, message: "Invalide" } } }), {
    errors: { email: ["x"] },
    message: "Invalide",
  });
  assert.deepEqual(extractErrors(new Error("réseau")), { errors: {}, message: "Une erreur est survenue" });
});

test("authInterceptor : 403 ne notifie que pour un code déclaré dans unauthorizedErrorCodes", async () => {
  let handler;
  registerAuthInterceptor({ interceptors: { response: { use: (_ok, ko) => (handler = ko) } } });

  let called = 0;
  configureApi({ onUnauthorized: () => called++, unauthorizedErrorCodes: [] });

  // Aucun code déclaré : un 403 reste une simple erreur.
  await assert.rejects(handler({ response: { status: 403, data: { code: "compte_inactif" } }, config: { url: "/api/evenements" } }));
  assert.equal(called, 0);

  configureApi({ unauthorizedErrorCodes: ["compte_inactif"] });

  await assert.rejects(handler({ response: { status: 403, data: { code: "compte_inactif" } }, config: { url: "/api/evenements" } }));
  assert.equal(called, 1);

  // Autre code, ou pas de code : pas de notification.
  await assert.rejects(handler({ response: { status: 403, data: { code: "autre" } }, config: { url: "/api/evenements" } }));
  await assert.rejects(handler({ response: { status: 403, data: {} }, config: { url: "/api/evenements" } }));
  assert.equal(called, 1);

  // Sur une URL de bootstrap (connexion ratée d'un compte suspendu) : pas de notification.
  await assert.rejects(handler({ response: { status: 403, data: { code: "compte_inactif" } }, config: { url: "/api/auth/login" } }));
  assert.equal(called, 1);

  configureApi({ onUnauthorized: null, unauthorizedErrorCodes: [] });
});
