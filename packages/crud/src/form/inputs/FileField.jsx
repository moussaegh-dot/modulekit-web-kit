import FormFieldWrapper from "./FormFieldWrapper";

const FileField = ({
    field,
    value,
    initialValue,
    onChange,
    error,
}) => {

    /*
     * Nouveau fichier sélectionné.
     */
    const hasNewFile =
        value instanceof File ||
        value instanceof Blob;

    /*
     * Ancien fichier provenant de la base.
     */
    const hasExistingFile =
        typeof initialValue === "string" &&
        initialValue.trim() !== "";

    return (
        <FormFieldWrapper
            label={field.label}
            error={error}
            helpText={field.helpText}
        >

            <input
                type="file"
                className={`form-field-input form-field-file ${
                    error ? "is-invalid" : ""
                }`}
                accept={field.accept}
                onChange={(e) =>
                    onChange(
                        e.target.files?.[0] ?? null
                    )
                }
            />

            {hasNewFile && (
                <div className="form-field-file-info">
                    <i className="fas fa-file" />

                    <span>
                        {value.name}
                    </span>
                </div>
            )}

            {!hasNewFile && hasExistingFile && (
                <div className="form-field-file-info">
                    <i className="fas fa-file" />

                    <span>
                        Fichier actuel :{" "}
                        {initialValue}
                    </span>
                </div>
            )}

        </FormFieldWrapper>
    );
};

export default FileField;