import { useState } from "react";
import { MDBInput, MDBIcon } from "mdb-react-ui-kit";
import FormFieldWrapper from "./FormFieldWrapper";

const PasswordField = ({
    field,
    value,
    onChange,
    error,
}) => {

    const [show, setShow] = useState(false);

    return (
        <FormFieldWrapper
            label={field.label}
            error={error}
            helpText={field.helpText}
        >

            <div className="form-field-password">

                <MDBInput
                    type={show ? "text" : "password"}
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

                <button
                    type="button"
                    className="form-field-password-toggle"
                    onClick={() =>
                        setShow((visible) => !visible)
                    }
                    aria-label={
                        show
                            ? "Masquer le mot de passe"
                            : "Afficher le mot de passe"
                    }
                >
                    <MDBIcon
                        icon={
                            show
                                ? "eye-slash"
                                : "eye"
                        }
                    />
                </button>

            </div>

        </FormFieldWrapper>
    );
};

export default PasswordField;