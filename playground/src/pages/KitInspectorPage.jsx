import { useMemo } from "react";

import { useAuth } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";
import { useModules } from "@moussaegh-dot/modulekit-engine/pages/ModuleProvider.jsx";
import ComponentRegistry from "@moussaegh-dot/modulekit-engine/registries/ComponentRegistry.js";

import { validateManifest, summarize } from "../../../tools/lib/contract.mjs";

// /__kit : ce que l'API a envoyé, ce que le front sait afficher, et les écarts au contrat.
export default function KitInspectorPage() {
  const { modules, loading } = useModules();
  const { user, isAuthenticated } = useAuth();

  const issues = useMemo(
    () => validateManifest(modules, { registeredComponents: ComponentRegistry.keys() }),
    [modules]
  );
  const { errors, warnings } = summarize(issues);

  if (loading) return <div className="container py-4">Chargement du manifeste…</div>;

  return (
    <div className="container py-4">
      <h1 className="h4">Inspecteur de contrat</h1>
      <p>
        {Object.keys(modules).length} module(s) —{" "}
        <strong className={errors ? "text-danger" : "text-success"}>{errors} erreur(s)</strong>, {warnings} avertissement(s) —{" "}
        {isAuthenticated ? `connecté : ${user?.fullName || user?.email} (${user?.roles?.join(", ") || "aucun rôle"})` : "non connecté (manifeste public seulement)"}
      </p>

      {issues.length > 0 && (
        <ul className="list-group mb-4">
          {issues.map((i, n) => (
            <li key={n} className={`list-group-item ${i.level === "error" ? "list-group-item-danger" : "list-group-item-warning"}`}>
              <code>{i.path}</code> — {i.message}
            </li>
          ))}
        </ul>
      )}

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr><th>Module</th><th>Page</th><th>Route</th><th>Composant</th><th>Enregistré</th></tr>
          </thead>
          <tbody>
            {Object.entries(modules).flatMap(([key, m]) =>
              Object.entries(m?.ui?.pages ?? {}).map(([pageKey, page]) => (
                <tr key={`${key}.${pageKey}`}>
                  <td>{key}</td>
                  <td>{pageKey}</td>
                  <td><code>{page.route ?? "—"}</code></td>
                  <td><code>{page.component}</code></td>
                  <td>{ComponentRegistry.has(page.component) ? "✓" : "✗"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
