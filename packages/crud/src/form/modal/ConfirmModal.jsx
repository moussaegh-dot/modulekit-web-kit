import ModalShell from "./ModalShell";

export default function ConfirmModal({
    title = "Confirmation",
    message = "Êtes-vous sûr ?",
    onConfirm,
    onClose,
}) {
    async function handleConfirm() {
        await onConfirm?.();
        onClose?.();
    }

    return (
        <ModalShell
            title={title}
            size="sm"
            onClose={onClose}
            footer={
                <div className="modal-actions">

                    <button
                        type="button"
                        className="modal-btn modal-btn-secondary"
                        onClick={onClose}
                    >
                        Annuler
                    </button>

                    <button
                        type="button"
                        className="modal-btn modal-btn-danger"
                        onClick={handleConfirm}
                    >
                        <i className="fas fa-check me-2"></i>
                        Confirmer
                    </button>

                </div>
            }
        >

            <div className="modal-confirm">

                <div className="modal-confirm-icon">
                    <i className="fas fa-circle-question"></i>
                </div>

                <div className="modal-confirm-content">

                    <h6 className="modal-confirm-title">
                        Confirmation requise
                    </h6>

                    <p className="modal-confirm-message mb-0">
                        {message}
                    </p>

                </div>

            </div>

        </ModalShell>
    );
}