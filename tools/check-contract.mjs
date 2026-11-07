#!/usr/bin/env node
/**
 * Vérifie en direct qu'une API (modulekit-core) respecte le contrat attendu par le kit.
 *
 *   node tools/check-contract.mjs http://localhost:8000
 *   node tools/check-contract.mjs http://localhost:8000 --email a@b.c --password secret
 *   options : --origin http://localhost:5173   (Sanctum « stateful », défaut ci-contre)
 *             --components Crud/Page,Public/Home   (signale les composants non enregistrés)
 *
 * Code de sortie 1 s'il y a au moins une erreur.
 */
import { validateManifest, validateUserPayload, summarize } from "./lib/contract.mjs";

const args = process.argv.slice(2);
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? "").replace(/\/+$/, "");
const opt = (name, def) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : def; };

if (!base) {
  console.error("Usage : node tools/check-contract.mjs <urlApi> [--email x --password y] [--origin url] [--components a,b]");
  process.exit(2);
}

const origin = opt("origin", "http://localhost:5173");
const components = opt("components", null)?.split(",").map((s) => s.trim()).filter(Boolean);
const jar = new Map();

const storeCookies = (res) => {
  for (const line of res.headers.getSetCookie?.() ?? []) {
    const [pair] = line.split(";");
    const i = pair.indexOf("=");
    jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
};
const cookieHeader = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");

async function call(method, path, body) {
  const headers = { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", Origin: origin, Referer: origin + "/" };
  if (jar.size) headers.Cookie = cookieHeader();
  if (jar.has("XSRF-TOKEN")) headers["X-XSRF-TOKEN"] = decodeURIComponent(jar.get("XSRF-TOKEN"));
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined, redirect: "manual" });
  storeCookies(res);
  let json = null;
  try { json = await res.json(); } catch { /* corps vide */ }
  return { status: res.status, json };
}

let totalErrors = 0;
const report = (title, issues) => {
  const { errors, warnings } = summarize(issues);
  totalErrors += errors;
  console.log(`\n${errors ? "✗" : "✓"} ${title} — ${errors} erreur(s), ${warnings} avertissement(s)`);
  for (const i of issues) console.log(`   ${i.level === "error" ? "ERREUR " : "avert. "} ${i.path} : ${i.message}`);
};
const fail = (title, message) => { totalErrors++; console.log(`\n✗ ${title}\n   ERREUR  ${message}`); };

async function checkManifest(path, title) {
  const r = await call("GET", path);
  if (r.status !== 200) return fail(title, `HTTP ${r.status} (attendu 200)`);
  if (!r.json || typeof r.json !== "object" || !("data" in r.json)) return fail(title, 'réponse attendue : { "data": { <moduleKey>: Module } }');
  report(`${title} (${Object.keys(r.json.data ?? {}).length} module(s))`, validateManifest(r.json.data, { registeredComponents: components }));
}

console.log(`Contrat modulekit-core ↔ kit front — ${base}`);
await checkManifest("/api/modules/public-manifest", "GET /api/modules/public-manifest");

const email = opt("email"), password = opt("password");
if (email && password) {
  const csrf = await call("GET", "/sanctum/csrf-cookie");
  if (![200, 204].includes(csrf.status)) fail("GET /sanctum/csrf-cookie", `HTTP ${csrf.status} (attendu 204) — vérifier CORS/SANCTUM_STATEFUL_DOMAINS`);
  else if (!jar.has("XSRF-TOKEN")) fail("GET /sanctum/csrf-cookie", "cookie XSRF-TOKEN non reçu");
  else {
    const login = await call("POST", "/api/auth/login", { email, password });
    if (![200, 201, 204].includes(login.status)) fail("POST /api/auth/login", `HTTP ${login.status}`);
    else {
      const u = await call("GET", "/api/auth/user");
      if (u.status !== 200) fail("GET /api/auth/user", `HTTP ${u.status} après connexion (attendu 200)`);
      else report("GET /api/auth/user", validateUserPayload(u.json?.data ?? u.json));
      await checkManifest("/api/modules/manifest", "GET /api/modules/manifest (connecté)");
      await call("POST", "/api/auth/logout");
    }
  }
} else {
  console.log("\n(connexion non testée : ajouter --email et --password pour vérifier /api/auth/user et le manifeste privé)");
}

console.log(totalErrors ? `\n${totalErrors} erreur(s) de contrat.` : "\nContrat respecté.");
process.exit(totalErrors ? 1 : 0);
