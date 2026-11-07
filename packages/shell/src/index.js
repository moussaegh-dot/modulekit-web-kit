// API publique du package shell (coque d'application : layout, navigation, toasts, thème).
export { default as MainLayout } from "./layouts/MainLayout.jsx";
export { default as Sidebar } from "./navbar/Sidebar.jsx";
export { default as Topbar } from "./navbar/Topbar.jsx";
export { NavigationItem } from "./navigation/index.js";
export { ThemeProvider, useTheme } from "./context/ThemeContext.jsx";
export { ToastProvider, useToast } from "./context/ToastContext.jsx";
export { default as Spinner } from "./ui/Spinner.jsx";
export { default as ThemeToggle } from "./ui/ThemeToggle.jsx";
// Styles à importer dans l'application :
//   import "@moussaegh-dot/modulekit-shell/styles/variables.css";
//   import "@moussaegh-dot/modulekit-shell/styles/base.css";
