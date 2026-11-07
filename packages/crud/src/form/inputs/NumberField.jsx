import { MDBInput } from "mdb-react-ui-kit";
import FormFieldWrapper from "./FormFieldWrapper";

const NumberField = ({
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
                type="number"
                label=""
                value={value ?? ""}
                className={`form-field-input ${
                    error ? "is-invalid" : ""
                }`}
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                onChange={(e) =>
                    onChange(
                        e.target.value === ""
                            ? null
                            : Number(e.target.value)
                    )
                }
            />

        </FormFieldWrapper>
    );
};

export default NumberField;