// API publique du package dashboard.
export { default as DashboardPage } from "./DashboardPage.jsx";
export { default as WidgetFrame } from "./WidgetFrame.jsx";
export { default as StatCard } from "./widgets/StatCard.jsx";
export { default as ListCard } from "./widgets/ListCard.jsx";
export { default as useWidgetData } from "./useWidgetData.js";
export { registerDashboard } from "./register.js";
export { widgetColumnClass } from "./layout.js";
export { formatValue, toneClass, listItems } from "./format.js";
