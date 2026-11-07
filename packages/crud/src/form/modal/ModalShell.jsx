import { useEffect } from "react";

const ModalShell = ({
    title,
    children,
    footer,
    size = "md",
    onClose,
}) => {

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    const sizeClass =
        size === "lg"
            ? "modal-lg"
            : size === "sm"
                ? "modal-sm"
                : "";

    return (
        <>

            {/* =====================================================
                BACKDROP
            ===================================================== */}

            <div
                className="modal-backdrop-custom"
                onClick={onClose}
                aria-hidden="true"
            />


            {/* =====================================================
                MODAL
            ===================================================== */}

            <div
                className="modal-custom"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >

                <div
                    className={`modal-dialog-custom modal-dialog-centered ${sizeClass}`}
                    onClick={(event) => event.stopPropagation()}
                >

                    <div className="modal-content-custom">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="modal-header-custom">

                            <div className="modal-header-content">

                                {title && (
                                    <h5
                                        id="modal-title"
                                        className="modal-title-custom"
                                    >
                                        {title}
                                    </h5>
                                )}

                            </div>

                            <button
                                type="button"
                                className="modal-close-custom"
                                onClick={onClose}
                                aria-label="Fermer"
                            >
                                <i className="fas fa-xmark" />
                            </button>

                        </div>


                        {/* =================================================
                            BODY
                        ================================================= */}

                        <div className="modal-body-custom">
                            {children}
                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        {footer && (
                            <div className="modal-footer-custom">
                                {footer}
                            </div>
                        )}

                    </div>

                </div>

            </div>

        </>
    );
};

export default ModalShell;