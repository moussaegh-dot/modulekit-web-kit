import { createRegistry } from "./createRegistry.js";

// Widgets de dashboard résolus par clé depuis le manifeste.
const WidgetRegistry = createRegistry("widget");

export default WidgetRegistry;
