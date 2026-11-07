import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";
import { extractErrors } from "@moussaegh-dot/modulekit-http/utils/extractErrors.js";

// Connexion minimale (Sanctum : CSRF + cookie de session gérés par le client HTTP du kit).
export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={user?.dashboardRoute || "/app/dashboard"} replace />;
  }

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const loaded = await login(form);
      navigate(loaded?.dashboardRoute || "/app/dashboard", { replace: true });
    } catch (err) {
      setError(extractErrors(err).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420, paddingTop: "10vh" }}>
      <h1 className="h4 mb-3">ModuleKit Playground</h1>
      <form onSubmit={submit} className="d-grid gap-3">
        <input className="form-control" name="email" type="email" placeholder="E-mail" value={form.email} onChange={change} required autoFocus />
        <input className="form-control" name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={change} required />
        {error && <div className="alert alert-danger mb-0">{error}</div>}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
        <a href="/__kit">Inspecteur de contrat</a>
      </form>
    </div>
  );
}
