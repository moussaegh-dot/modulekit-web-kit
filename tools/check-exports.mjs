#!/usr/bin/env node
// Vérifie que chaque import par défaut / nommé correspond à un export réel (packages + apps).
import path from "path"; import { fileURLToPath } from "url";
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."));
import fs from "fs";
const SCOPE="@moussaegh-dot/modulekit-";
const strip=s=>s.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,"");
const exportsOf=(file)=>{ const s=strip(fs.readFileSync(file,"utf8")); const names=new Set(); let m;
  if(/export\s+default\b/.test(s)) names.add("default");
  const r1=/export\s+(?:async\s+)?(?:function\*?|class|const|let|var)\s+([A-Za-z0-9_$]+)/g; while((m=r1.exec(s))) names.add(m[1]);
  const r2=/export\s*\{([^}]*)\}/g; while((m=r2.exec(s))) m[1].split(",").forEach(x=>{const t=x.trim().split(/\s+as\s+/).pop(); if(t) names.add(t);});
  if(/export\s+\*\s+from/.test(s)) names.add("*");
  return names; };
const files=[]; (function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==="node_modules")continue;const p=path.join(d,e.name);e.isDirectory()?w(p):/\.jsx?$/.test(e.name)&&files.push(p);}})(".");
let bad=0,n=0;
for(const f of files){ const s=strip(fs.readFileSync(f,"utf8"));
  const re=/import\s+([\s\S]*?)\s+from\s+["']([^"']+)["']/g; let m;
  while((m=re.exec(s))){ const spec=m[2]; let target;
    if(spec.startsWith(".")) target=path.resolve(path.dirname(f),spec);
    else if(spec.startsWith(SCOPE)){const [p,...r]=spec.slice(SCOPE.length).split("/"); target=path.resolve("packages",p,"src",r.join("/")||"index.js");}
    else if(spec.startsWith("@/")){if(f.startsWith("packages"))continue; const app=f.startsWith("playground")?"playground":f.split(path.sep).slice(0,2).join("/"); target=path.resolve(app,"src",spec.slice(2));}
    else continue;
    const cands=[target,target+".js",target+".jsx",path.join(target,"index.js"),path.join(target,"index.jsx")];
    const t=cands.find(c=>fs.existsSync(c)&&fs.statSync(c).isFile()); if(!t||!/\.jsx?$/.test(t)) continue;
    const ex=exportsOf(t); const clause=m[1].trim(); n++;
    const dflt=clause.match(/^([A-Za-z0-9_$]+)\s*(?:,|$)/); if(dflt&&!ex.has("default")){console.log(`DEFAULT MANQUANT ${f} ← ${spec}`);bad++;}
    const named=clause.match(/\{([^}]*)\}/); if(named&&!ex.has("*")) for(const x of named[1].split(",").map(y=>y.trim()).filter(Boolean)){const src=x.split(/\s+as\s+/)[0]; if(!ex.has(src)){console.log(`NOMMÉ MANQUANT   ${f} ← ${spec} : ${src}`);bad++;}}
  }}
console.log(`${n} imports (défaut/nommés) vérifiés, ${bad} problème(s)`);
if (bad) process.exit(1);
