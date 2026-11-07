/**
 * 📁 src/core/form/view/ViewFieldWrapper.jsx
 */

const ViewFieldWrapper = ({
    field,
    children,
    className = "",
    size = "md",
}) => {

    const sizeClasses = {
        sm: "view-field-wrapper-sm",
        md: "view-field-wrapper-md",
        lg: "view-field-wrapper-lg",
    };

    return (
        <div
            className={`
                view-field-wrapper
                ${sizeClasses[size] || sizeClasses.md}
                ${field.bgColor || ""}
                ${field.padded ? "view-field-padded" : ""}
                ${field.highlight ? "view-field-highlight" : ""}
                ${className}
            `}
            style={{
                "--view-field-highlight":
                    field.highlightColor || "var(--primary)",
            }}
        >

            {field.label && (
                <div className="view-field-label">

                    {field.icon && (
                        <i
                            className={`fas fa-${field.icon} view-field-label-icon`}
                        />
                    )}

                    <span>
                        {field.label}
                    </span>

                    {field.required && (
                        <span className="view-field-required">
                            *
                        </span>
                    )}

                    {field.helpText && (
                        <i
                            className="fas fa-info-circle view-field-help"
                            title={field.helpText}
                        />
                    )}

                </div>
            )}

            <div
                className={
                    field.noMargin
                        ? ""
                        : "view-field-value"
                }
            >
                {children}
            </div>

            {field.helpText && (
                <div className="view-field-help-text">
                    {field.helpText}
                </div>
            )}

        </div>
    );
};

export default ViewFieldWrapper;