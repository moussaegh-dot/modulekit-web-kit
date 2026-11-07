import { useToast as useToastContext } from "../../context/ToastContext";

export const useToast = () => {
  const { addToast } = useToastContext();

  return {
    success: (message) =>
      addToast({
        type: "success",
        title: "Succès",
        message
      }),

    error: (message) =>
      addToast({
        type: "danger",
        title: "Erreur",
        message
      }),

    warning: (message) =>
      addToast({
        type: "warning",
        title: "Attention",
        message
      }),

    info: (message) =>
      addToast({
        type: "info",
        title: "Info",
        message
      })
  };
};