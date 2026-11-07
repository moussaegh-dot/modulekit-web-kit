import ModalShell from "./ModalShell";
import ViewFieldRenderer from "../view/ViewFieldRenderer";
import {
    resolvePath,
} from "../../utils";

export default function ViewModal({
    title = "Détails",
    data = {},
    schema = {},
    onClose,
}) {
    const fields = schema?.fields ?? [];

    return (
        <ModalShell
            title={title}
            onClose={onClose}
        >

            {fields.length === 0 ? (

                <div className="modal-empty-state modal-empty-state-warning">
                    <div className="modal-empty-icon">
                        <i className="fas fa-circle-exclamation"></i>
                    </div>

                    <div>
                        <div className="modal-empty-title">
                            Aucune donnée disponible
                        </div>

                        <div className="modal-empty-description">
                            Aucune information à afficher pour cet élément.
                        </div>
                    </div>
                </div>

            ) : (

                <div className="row g-4">

                    {fields.map((field) => (

                        <div
                            key={field.key}
                            className={field.width || "col-12"}
                        >
                            <div className="modal-field">

                                <ViewFieldRenderer
                                    field={field}
                                    value={resolvePath(data, field.key)}
                                    schema={schema}
                                />

                            </div>
                        </div>

                    ))}

                </div>

            )}

            <div className="modal-actions modal-actions-end">

                <button
                    type="button"
                    className="modal-btn modal-btn-primary"
                    onClick={onClose}
                >
                    Fermer
                </button>

            </div>

        </ModalShell>
    );
}