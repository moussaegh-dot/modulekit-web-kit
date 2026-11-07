// API publique du package crud (moteur CRUD + moteur de formulaires).
export { default as CrudPage } from "./CrudPage.jsx";
export { registerCrud } from "./register.js";
export {
  useCrudEngine,
  useCrudData,
  useCrudActions,
  useCrudController,
  useToolbarFilters,
  usePagination,
} from "./hooks/index.js";
export { ModalProvider, useModal } from "./form/modal/ModalProvider.jsx";
export { FormProvider, useForm } from "./form/FormProvider.jsx";
export { default as FormRenderer } from "./form/FormRenderer.jsx";
export { fieldRegistry } from "./form/fieldRegistry.js";
export { viewFieldRegistry } from "./form/view/viewFieldRegistry.js";
export { modalRegistry } from "./form/modal/modalRegistry.js";
export { default as cellRegistry } from "./ui/table/CellRegistry.js";
// Styles à importer dans l'application :
//   import "@moussaegh-dot/modulekit-crud/styles/modal.css";
//   import "@moussaegh-dot/modulekit-crud/styles/form-fields.css";
//   import "@moussaegh-dot/modulekit-crud/styles/view-fields.css";
