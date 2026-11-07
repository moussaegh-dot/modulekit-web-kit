import { createContext, useContext, useState } from "react";
import ToastContainer from "../ui/toast/ToastContainer";
const ToastContext = createContext();

/**
 * 🚀 ToastProvider global
 */
export const ToastProvider = ({ children }) => {

  const [toasts, setToasts] = useState([]);

  /**
   * ➕ ADD TOAST
   */
  const addToast = (toast) => {

    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, ...toast }
    ]);

    /**
     * ⏱ AUTO REMOVE
     */
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 3000);
  };

  /**
   * ❌ REMOVE TOAST
   */
  const removeToast = (id) => {
    setToasts((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* UI */}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />

    </ToastContext.Provider>
  );
};

/**
 * 🧠 Hook
 */
export const useToast = () => useContext(ToastContext);