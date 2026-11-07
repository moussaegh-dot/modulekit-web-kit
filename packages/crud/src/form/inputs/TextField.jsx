import { MDBInput } from "mdb-react-ui-kit";
import FormFieldWrapper from "./FormFieldWrapper";

const TextField = ({
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

            <MDBInput
                label=""
                value={value ?? ""}
                className={`form-field-input ${
                    error ? "is-invalid" : ""
                }`}
                placeholder={field.placeholder}
                onChange={(e) =>
                    onChange(e.target.value)
                }
            />

        </FormFieldWrapper>
    );
};

export default TextField;