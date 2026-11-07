import ViewFieldWrapper from "../ViewFieldWrapper";

const EmailView = ({ field, value }) => {

    if (!value) {
        return (
            <ViewFieldWrapper field={field}>
                <span className="view-field-empty">—</span>
            </ViewFieldWrapper>
        );
    }

    const copyEmail = async () => {
        try {
            await navigator.clipboard?.writeText(value);
        } catch {
            // Clipboard indisponible
        }
    };

    return (
        <ViewFieldWrapper field={field}>

            <div className="view-email">

                <i className="fas fa-envelope view-email-icon" />

                <a
                    href={`mailto:${value}`}
                    className="view-email-link"
                >
                    {value}
                </a>

                {field.showCopy && (
                    <button
                        type="button"
                        className="view-copy-button"
                        onClick={copyEmail}
                        title="Copier l'email"
                    >
                        <i className="fas fa-copy" />
                    </button>
                )}

            </div>

        </ViewFieldWrapper>
    );
};

export default EmailView;