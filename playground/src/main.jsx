import React from "react";
import ReactDOM from "react-dom/client";

import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@moussaegh-dot/modulekit-shell/styles/base.css";
import "@moussaegh-dot/modulekit-shell/styles/variables.css";
import "@moussaegh-dot/modulekit-crud/styles/modal.css";
import "@moussaegh-dot/modulekit-crud/styles/form-fields.css";
import "@moussaegh-dot/modulekit-crud/styles/view-fields.css";

import App from "./App";
import { bootstrapKit } from "./bootstrap";

// Configuration du kit + enregistrement des pages AVANT le premier rendu.
bootstrapKit();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
