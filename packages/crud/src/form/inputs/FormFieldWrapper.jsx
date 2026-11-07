// src/shared/inputs/FormFieldWrapper.jsx
import { useCallback } from "react";

const FormFieldWrapper = ({
    label,
    error,
    helpText,
    children,
}) => {

    const normalizedError = Array.isArray(error)
        ? error[0]
        : error;

    return (
        <div className="form-field-wrapper">

            {label && (
                <label className="form-field-label">
                    {label}
                </label>
            )}

            {children}

            {normalizedError && (
                <div className="form-field-error">
                    <i className="fas fa-circle-exclamation" />
                    <span>{normalizedError}</span>
                </div>
            )}

            {helpText && !normalizedError && (
                <div className="form-field-help">
                    {helpText}
                </div>
            )}

        </div>
    );
};


export default FormFieldWrapper;