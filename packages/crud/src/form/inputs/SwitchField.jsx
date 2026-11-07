import { MDBSwitch } from "mdb-react-ui-kit";
import FormFieldWrapper from "./FormFieldWrapper";

const SwitchField = ({
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

            <div className="form-field-switch">

                <MDBSwitch
                    checked={!!value}
                    onChange={(e) =>
                        onChange(e.target.checked)
                    }
                />

            </div>

        </FormFieldWrapper>
    );
};

export default SwitchField;