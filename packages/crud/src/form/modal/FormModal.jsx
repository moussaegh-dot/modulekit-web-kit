import ModalShell from "./ModalShell";
import FormRenderer from "../FormRenderer";

export default function FormModal({
    title,
    form,
    onClose,
}) {
    return (
        <ModalShell
            title={title}
            size="lg"
            onClose={onClose}
        >

            {!form ? (

                <div className="modal-empty-state modal-empty-state-warning">

                    <div className="modal-empty-icon">
                        <i className="fas fa-file-circle-exclamation"></i>
                    </div>

                    <div>
                        <div className="modal-empty-title">
                            Aucun formulaire disponible
                        </div>

                        <div className="modal-empty-description">
                            Le formulaire demandé n'est pas disponible.
                        </div>
                    </div>

                </div>

            ) : (

                <div className="modal-form">
                    <FormRenderer {...form} />
                </div>

            )}

        </ModalShell>
    );
}