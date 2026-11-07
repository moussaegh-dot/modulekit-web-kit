import { Link } from "react-router-dom";

import { useModules } from "@moussaegh-dot/modulekit-engine/pages/ModuleProvider.jsx";

// Exemple de page métier enregistrée dans ComponentRegistry ("Playground/Home").
export default function HomePage() {
  const { modules } = useModules();

  return (
    <div className="container py-5">
      <h1 className="h3">ModuleKit Playground</h1>
      <p className="text-muted">{Object.keys(modules).length} module(s) reçus du manifeste.</p>
      <Link to="/login" className="btn btn-primary me-2">Connexion</Link>
      <Link to="/__kit" className="btn btn-outline-secondary">Inspecteur de contrat</Link>
    </div>
  );
}
