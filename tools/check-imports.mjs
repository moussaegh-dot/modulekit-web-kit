#!/usr/bin/env node
/**
 * Vérifie le monorepo sans bundler :
 *  - tout import relatif, "@/" (alias d'une app) ou "@moussaegh-dot/modulekit-*" se résout vers un fichier réel ;
 *  - la CASSE du chemin est exacte (sinon ça marche sous Windows et casse sous Linux/CI) ;
 *  - aucun package n'importe depuis une app ou le playground ;
 *  - aucune dépendance circulaire entre packages.
 * Sortie : code 1 si un problème est trouvé (utilisable en CI : npm run check:imports).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCOPE = "@moussaegh-dot/modulekit-";
const EXTS = ["", ".js", ".jsx", ".json", ".css"];

const listing = new Map();
const ls = (dir) => {
  if (!listing.has(dir)) listing.set(dir, fs.existsSync(dir) ? fs.readdirSync(dir) : []);
  return listing.get(dir);
};

// Résout un chemin absolu en respectant la casse exacte ; renvoie { file } | { caseError } | null
function resolveExact(abs) {
  const candidates = EXTS.flatMap((e) => [abs + e]).concat([".js", ".jsx"].map((e) => path.join(abs, "index" + e)));
  for (const c of candidates) {
    const rel = path.relative(ROOT, c).split(path.sep);
    let cur = ROOT, ok = true, exact = true;
    for (const seg of rel) {
      const names = ls(cur);
      if (names.includes(seg)) { cur = path.join(cur, seg); continue; }
      const ci = names.find((n) => n.toLowerCase() === seg.toLowerCase());
      if (ci) { cur = path.join(cur, ci); exact = false; continue; }
      ok = false; break;
    }
    if (ok && fs.statSync(cur).isFile()) return exact ? { file: cur } : { caseError: path.relative(ROOT, cur) };
  }
  return null;
}

const files = [];
const walk = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (["node_modules", "dist", ".git"].includes(e.name)) continue;
    const p = path.join(d, e.name);
    e.isDirectory() ? walk(p) : /\.jsx?$/.test(e.name) && files.push(p);
  }
};
["packages", "apps", "playground"].forEach((d) => fs.existsSync(path.join(ROOT, d)) && walk(path.join(ROOT, d)));

const zoneOf = (f) => { const r = path.relative(ROOT, f).split(path.sep); return r[0] === "playground" ? "playground" : `${r[0]}/${r[1]}`; };
const re = /(?:\bfrom\s+|\bimport\s+|\bimport\(\s*)(["'])([^"'\n]+)\1/g;
const problems = [], deps = {};

for (const f of files) {
  const src = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const zone = zoneOf(f);
  let m;
  while ((m = re.exec(src))) {
    const spec = m[2];
    let abs = null, targetZone = null;
    if (spec.startsWith(".")) abs = path.resolve(path.dirname(f), spec);
    else if (spec.startsWith("@/")) abs = path.join(ROOT, zone.startsWith("packages/") ? "" : zone, "src", spec.slice(2));
    else if (spec.startsWith(SCOPE)) {
      const [pkg, ...rest] = spec.slice(SCOPE.length).split("/");
      abs = path.join(ROOT, "packages", pkg, "src", rest.join("/") || "index.js");
      targetZone = `packages/${pkg}`;
    } else continue;
    const r = resolveExact(abs);
    const rel = path.relative(ROOT, f);
    if (!r) problems.push(`INTROUVABLE   ${rel}  →  ${spec}`);
    else if (r.caseError) problems.push(`CASSE         ${rel}  →  ${spec}  (réel : ${r.caseError})`);
    else {
      const tz = targetZone ?? zoneOf(r.file);
      if (zone.startsWith("packages/") && !tz.startsWith("packages/")) problems.push(`PACKAGE→APP    ${rel}  →  ${spec}`);
      if (zone.startsWith("packages/") && tz.startsWith("packages/") && tz !== zone) (deps[zone] ??= new Set()).add(tz);
    }
  }
}

// cycles entre packages
const visiting = new Set(), done = new Set();
const dfs = (n, trail) => {
  if (done.has(n)) return;
  if (visiting.has(n)) { problems.push(`CYCLE         ${[...trail, n].join(" → ")}`); return; }
  visiting.add(n);
  for (const d of deps[n] ?? []) dfs(d, [...trail, n]);
  visiting.delete(n); done.add(n);
};
Object.keys(deps).forEach((n) => dfs(n, []));

console.log(`${files.length} fichiers JS/JSX analysés`);
console.log("Dépendances entre packages :");
for (const [z, s] of Object.entries(deps).sort()) console.log(`  ${z.replace("packages/", "")} → ${[...s].map((x) => x.replace("packages/", "")).join(", ")}`);
if (problems.length) { console.log(`\n${problems.length} problème(s) :`); problems.forEach((p) => console.log("  " + p)); process.exit(1); }
console.log("\nOK : imports résolus, casse exacte, aucun cycle, aucun package→app.");
