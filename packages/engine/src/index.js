// API publique du package engine.
export { ModuleProvider, ModuleContext, useModules } from "./pages/ModuleProvider.jsx";
export { default as PageRenderer } from "./pages/PageRenderer.jsx";
export { default as PageService } from "./pages/services/PageService.js";
export { default as Page } from "./pages/helpers/Page.js";
export { default as PageResolver } from "./pages/resolvers/PageResolver.js";
export { default as ComponentResolver } from "./pages/resolvers/ComponentResolver.js";
export { default as RouteEngine } from "./router/RouteEngine.jsx";
export { default as RouteRenderer } from "./router/RouteRenderer.jsx";
export { default as PageLoader } from "./ui/PageLoader.jsx";
export { ComponentRegistry, WidgetRegistry, MetricRegistry, createRegistry } from "./registries/index.js";
export { configureKit, getKitConfig } from "./config/kitConfig.js";
