import { createRegistry } from "./createRegistry.js";

// Pages résolues depuis `module.ui.pages[x].component` (manifeste du backend).
// Ex. : ComponentRegistry.registerMany({ "Crud/Page": CrudPage, "Public/Home": HomePage });
const ComponentRegistry = createRegistry("component");

export default ComponentRegistry;
