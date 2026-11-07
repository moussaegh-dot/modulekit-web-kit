import { MDBInput } from "mdb-react-ui-kit";
import FormFieldWrapper from "./FormFieldWrapper";

const DateField = ({
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
                type="date"
                label=""
                value={value ?? ""}
                className={`form-field-input ${
                    error ? "is-invalid" : ""
                }`}
                min={field.min}
                max={field.max}
                onChange={(e) =>
                    onChange(e.target.value)
                }
            />

        </FormFieldWrapper>
    );
};

export default DateField;