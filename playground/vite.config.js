import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Une seule copie de ces libs, même avec les packages du workspace.
    dedupe: ["react", "react-dom", "react-router-dom", "axios", "mdb-react-ui-kit", "prop-types"],
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { port: 5173 }, // doit figurer dans SANCTUM_STATEFUL_DOMAINS côté API (localhost:5173)
});
