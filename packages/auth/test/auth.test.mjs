import test from "node:test";
import assert from "node:assert/strict";

import ModulePermissionAdapter from "../src/ModulePermissionAdapter.js";
import { AuthState } from "../src/authState.js";

test("ModulePermissionAdapter : index par module, can, canModule", () => {
  const p = new ModulePermissionAdapter(["users.view", "users.create", "roles.view.any", "mal-forme", 42, null]);

  assert.equal(p.can("users.view"), true);
  assert.equal(p.can("users.delete"), false);
  assert.equal(p.canModule("users", "create"), true);
  assert.equal(p.canModule("users", "delete"), false);
  // l'action peut contenir des points : seul le premier segment est le module
  assert.equal(p.canModule("roles", "view.any"), true);
  assert.deepEqual(p.getModule("users"), { view: true, create: true });
  assert.deepEqual(p.getModule("inconnu"), {});
  assert.deepEqual(Object.keys(p.getAll()).sort(), ["roles", "users"]);
});

test("ModulePermissionAdapter : entrée non tableau", () => {
  assert.deepEqual(new ModulePermissionAdapter(undefined).getAll(), {});
  assert.equal(new ModulePermissionAdapter("x").can("x"), false);
});

test("AuthState : abonnement, notification, désabonnement", () => {
  const seen = [];
  const off = AuthState.subscribe((u) => seen.push(u?.id ?? null));

  AuthState.setUser({ id: 7 });
  assert.equal(AuthState.getUser().id, 7);
  off();
  AuthState.setUser(null);

  assert.deepEqual(seen, [7]);
  assert.equal(AuthState.getUser(), null);
});
