import test from "node:test";
import assert from "node:assert/strict";

import ModulePermissionAdapter from "../src/ModulePermissionAdapter.js";
import { AuthState } from "../src/authState.js";
import { authEndpoints, configureAuthEndpoints, fillEndpoint } from "../src/endpoints.js";

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

test("fillEndpoint : remplace et encode les paramètres, tolère l'absence", () => {
  assert.equal(fillEndpoint("/api/auth/email/verify/{id}/{hash}", { id: 12, hash: "ab/cd e" }), "/api/auth/email/verify/12/ab%2Fcd%20e");
  assert.equal(fillEndpoint("/api/x/{absent}", {}), "/api/x/");
  assert.equal(fillEndpoint("/api/sans-parametre"), "/api/sans-parametre");
});

test("authEndpoints : valeurs par défaut du cycle de vie du compte et surcharge", () => {
  assert.equal(authEndpoints.forgotPassword, "/api/auth/forgot-password");
  assert.equal(authEndpoints.changePassword, "/api/auth/password");
  assert.equal(authEndpoints.verifyEmail, "/api/auth/email/verify/{id}/{hash}");

  const avant = authEndpoints.login;
  configureAuthEndpoints({ login: "/api/v2/login" });
  assert.equal(authEndpoints.login, "/api/v2/login");
  configureAuthEndpoints({ login: avant });
});
