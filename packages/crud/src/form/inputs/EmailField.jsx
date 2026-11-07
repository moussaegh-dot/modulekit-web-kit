import FormFieldWrapper from "./FormFieldWrapper";

const EmailField = ({
    field,
    value,
    onChange,
    error,
}) => {

    const isValidEmail = (email) => {
        if (!email) {
            return true;
        }

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const frontendError =
        value && !isValidEmail(value)
            ? "Adresse email invalide."
            : null;

    const fieldError =
        error ?? frontendError;

    return (
        <FormFieldWrapper
            label={field.label}
            error={fieldError}
            helpText={field.helpText}
        >

            <input
                type="email"
                className={`form-field-input ${
                    fieldError
                        ? "is-invalid"
                        : ""
                }`}
                value={value ?? ""}
                placeholder={
                    field.placeholder ??
                    "exemple@email.com"
                }
                onChange={(e) =>
                    onChange(e.target.value)
                }
            />

        </FormFieldWrapper>
    );
};

export default EmailField;