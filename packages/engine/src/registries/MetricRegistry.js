import { createRegistry } from "./createRegistry.js";

// Métriques de dashboard résolues par clé depuis le manifeste.
const MetricRegistry = createRegistry("metric");

export default MetricRegistry;
