const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "320px"
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            alert
            alert-${toast.type || "info"}
            shadow
            d-flex
            justify-content-between
            align-items-start
          `}
          role="alert"
          style={{
            animation: "fadeIn 0.3s ease"
          }}
        >
          <div>
            <div className="fw-bold">
              {toast.title}
            </div>

            <div>
              {toast.message}
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="btn-close"
          />
        </div>
      ))}

      {/* simple animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default ToastContainer;