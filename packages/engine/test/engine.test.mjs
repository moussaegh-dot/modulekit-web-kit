import test from "node:test";
import assert from "node:assert/strict";

import { createRegistry } from "../src/registries/createRegistry.js";
import ComponentRegistry from "../src/registries/ComponentRegistry.js";
import { configureKit, getKitConfig } from "../src/config/kitConfig.js";
import Page from "../src/pages/helpers/Page.js";

test("createRegistry : register, registerMany, resolve, has, copie défensive", () => {
  const r = createRegistry("demo", { A: 1 });
  r.register("B", 2).registerMany({ C: 3 });

  assert.equal(r.resolve("B"), 2);
  assert.equal(r.resolve("Z"), null);
  assert.equal(r.has("C"), true);
  assert.deepEqual(r.keys(), ["A", "B", "C"]);

  const copy = r.all();
  copy.A = 99;
  assert.equal(r.resolve("A"), 1);
});

test("ComponentRegistry démarre vide : aucune page métier dans le kit", () => {
  assert.deepEqual(ComponentRegistry.keys(), []);
  ComponentRegistry.register("Public/Home", () => null);
  assert.equal(ComponentRegistry.has("Public/Home"), true);
});

test("configureKit : fusion profonde brand/routes/badgeColors", () => {
  const before = getKitConfig().routes.dashboard;
  configureKit({
    brand: { name: "Mon App" },
    routes: { profile: "/app/moi" },
    badgeColors: { manager: "success" },
    currency: "XOF",
  });

  const c = getKitConfig();
  assert.equal(c.brand.name, "Mon App");
  assert.equal(c.brand.version, "1.0"); // conservé
  assert.equal(c.routes.profile, "/app/moi");
  assert.equal(c.routes.dashboard, before); // conservé
  assert.equal(c.badgeColors.manager, "success");
  assert.equal(c.badgeColors.actif, "success"); // défaut conservé
});

test("Page helper : endpoint, libellés par défaut, titres de modale", () => {
  const page = {
    module: {
      identity: { key: "evenements", label: "Événements" },
      entity: { singular: "événement", plural: "événements" },
    },
    descriptor: { component: "Crud/Page", bindings: { table: "main" } },
    resources: { table: { columns: [] } },
  };

  assert.equal(Page.endpoint(page), "/api/evenements");
  assert.equal(Page.title(page), "Événements");
  assert.equal(Page.modalTitle("create", page), "Créer événement");
  assert.equal(Page.modalTitle("unknown", page), "événement");
  assert.equal(Page.singular({}), "Élément");
  assert.equal(Page.plural({}), "Éléments");
  assert.deepEqual(Page.widgets({}), []);
  assert.deepEqual(Page.bindings(page), { table: "main" });
});
