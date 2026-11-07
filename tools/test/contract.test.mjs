import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { validateManifest, validateUserPayload, summarize } from "../lib/contract.mjs";

const run = promisify(execFile);
const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../check-contract.mjs");

const goodModule = () => ({
  identity: { key: "evenements", label: "Événements" },
  entity: { singular: "événement", plural: "événements" },
  ui: {
    tables: { main: { columns: [] } },
    forms: { main: { fields: [] } },
    filters: { main: [] },
    actions: { main: { row: [], bulk: [] } },
    widgets: { w1: {} },
    metrics: { m1: {} },
    pages: {
      index: {
        component: "Crud/Page",
        route: "/evenements",
        bindings: { table: "main", form: "main", filters: "main", actions: "main", widgets: ["w1"], metrics: ["m1"] },
      },
      show: { component: "Crud/Page", route: "/evenements/{id}", bindings: { table: "main" } },
    },
  },
});

const levels = (issues) => issues.map((i) => `${i.level}:${i.path}`);

test("manifeste valide : aucune erreur ni avertissement", () => {
  const issues = validateManifest({ evenements: goodModule() }, { registeredComponents: ["Crud/Page"] });
  assert.deepEqual(issues, []);
});

test("manifeste : binding vers une ressource inexistante = erreur", () => {
  const m = goodModule();
  m.ui.pages.index.bindings.table = "absent";
  m.ui.pages.index.bindings.widgets = ["w1", "fantome"];
  const issues = validateManifest({ evenements: m });
  assert.ok(levels(issues).includes("error:evenements.ui.pages.index.bindings.table"));
  assert.equal(issues.filter((i) => i.message.includes("fantome")).length, 1);
});

test("manifeste : composant manquant/non enregistré, route invalide ou dupliquée", () => {
  const m = goodModule();
  delete m.ui.pages.show.component;
  m.ui.pages.index.route = "evenements";
  m.ui.pages.autre = { component: "Inconnu", route: "/x/{id", bindings: {} };
  const issues = validateManifest({ evenements: m }, { registeredComponents: ["Crud/Page"] });
  const l = levels(issues);
  assert.ok(l.includes("error:evenements.ui.pages.show.component"));
  assert.ok(l.includes("error:evenements.ui.pages.index.route"));
  assert.ok(l.includes("warn:evenements.ui.pages.autre.component"));
  assert.ok(l.includes("error:evenements.ui.pages.autre.route"));

  const dup = validateManifest({ a: goodModule(), b: { ...goodModule(), identity: { key: "b", label: "B" } } });
  assert.ok(dup.some((i) => i.level === "error" && i.message.includes("déjà utilisée")));
});

test("manifeste : structure racine invalide, page sans route, Crud/Page vide", () => {
  assert.equal(summarize(validateManifest([])).errors, 1);
  const m = goodModule();
  m.ui.pages.vide = { component: "Crud/Page", bindings: {} };
  const issues = validateManifest({ evenements: m });
  assert.ok(issues.some((i) => i.level === "warn" && i.path.endsWith("vide.route")));
  assert.ok(issues.some((i) => i.level === "warn" && i.path.endsWith("vide.bindings")));
  assert.equal(summarize(issues).errors, 0);
});

test("payload /api/auth/user", () => {
  const ok = { user: { id: 1, email: "a@b.c", prenom: "A", nom: "B" }, roles: ["admin"], permissions: ["users.view"], dashboard_route: "/app/dashboard", navigation: [] };
  assert.deepEqual(validateUserPayload(ok), []);

  const bad = validateUserPayload({ user: { email: "x" }, permissions: ["pas-de-point"], navigation: "x" });
  assert.ok(levels(bad).includes("error:user.id"));
  assert.ok(levels(bad).includes("error:navigation"));
  assert.ok(bad.some((i) => i.path === "permissions" && i.message.includes("<module>.<action>")));
  assert.equal(summarize(validateUserPayload(null)).errors, 1);
  // avec mapUser personnalisé, prenom/nom ne sont plus exigés
  assert.ok(!validateUserPayload({ user: { id: 1, email: "a@b.c" }, roles: [], permissions: [], dashboard_route: "/" }, { defaultMapUser: false }).length);
});

// --- Test de bout en bout du CLI contre une fausse API de type Sanctum ---
function fakeApi({ broken = false } = {}) {
  const module = goodModule();
  if (broken) module.ui.pages.index.bindings.table = "absent";
  return http.createServer((req, res) => {
    const send = (status, body, headers = {}) => {
      res.writeHead(status, { "Content-Type": "application/json", ...headers });
      res.end(body === null ? "" : JSON.stringify(body));
    };
    const authed = (req.headers.cookie ?? "").includes("session=ok");
    if (req.url === "/api/modules/public-manifest") return send(200, { data: { evenements: module } });
    if (req.url === "/sanctum/csrf-cookie") return send(204, null, { "Set-Cookie": "XSRF-TOKEN=tok%3D; Path=/" });
    if (req.url === "/api/auth/login" && req.method === "POST") {
      if (req.headers["x-xsrf-token"] !== "tok=") return send(419, { message: "CSRF token mismatch" });
      return send(204, null, { "Set-Cookie": "session=ok; Path=/" });
    }
    if (req.url === "/api/auth/user") {
      return authed
        ? send(200, { data: { user: { id: 1, email: "a@b.c", prenom: "A", nom: "B" }, roles: [], permissions: ["x.y"], dashboard_route: "/app/dashboard" } })
        : send(401, { message: "Unauthenticated" });
    }
    if (req.url === "/api/modules/manifest") return authed ? send(200, { data: { evenements: module } }) : send(401, {});
    if (req.url === "/api/auth/logout") return send(204, null);
    send(404, {});
  });
}
const listen = (srv) => new Promise((r) => srv.listen(0, "127.0.0.1", () => r(`http://127.0.0.1:${srv.address().port}`)));
const cli = (...a) => run("node", [CLI, ...a]).then((r) => ({ code: 0, out: r.stdout }), (e) => ({ code: e.code, out: e.stdout }));

test("CLI : API conforme (CSRF + session cookie) → code 0", async () => {
  const srv = fakeApi(); const url = await listen(srv);
  try {
    const r = await cli(url, "--email", "a@b.c", "--password", "x", "--components", "Crud/Page");
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /Contrat respecté/);
    assert.match(r.out, /GET \/api\/auth\/user — 0 erreur/);
    assert.match(r.out, /manifest \(connecté\)/);
  } finally { srv.close(); }
});

test("CLI : manifeste incohérent → code 1 et message précis", async () => {
  const srv = fakeApi({ broken: true }); const url = await listen(srv);
  try {
    const r = await cli(url);
    assert.equal(r.code, 1);
    assert.match(r.out, /"absent" absent de ui\.tables/);
  } finally { srv.close(); }
});
