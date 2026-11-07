import { MDBTextArea } from "mdb-react-ui-kit";
import FormFieldWrapper from "./FormFieldWrapper";

const TextareaField = ({
    field,
    value,
    onChange,
    error,
}) => {

    return (
        <FormFieldWrapper
            label={field.label}
            error={error}
            helpText={field.helpText}
        >

            <MDBTextArea
                value={value ?? ""}
                className={`form-field-textarea ${
                    error ? "is-invalid" : ""
                }`}
                rows={field.rows ?? 4}
                placeholder={field.placeholder}
                onChange={(e) =>
                    onChange(e.target.value)
                }
            />

        </FormFieldWrapper>
    );
};

export default TextareaField;