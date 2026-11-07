import { resolvePath } from "../../utils";
import { viewFieldRegistry } from "./viewFieldRegistry";

const ViewFieldRenderer = ({
    field,
    value,
    schema = {},
    className = "",
    containerSize = "md",
    inline = false,
}) => {

    if (!field?.key) {
        console.error("❌ Invalid view field:", field);
        return null;
    }

    const Component =
        viewFieldRegistry[field.type] ||
        viewFieldRegistry.text;

    const displayValue =
        value ??
        field.defaultValue ??
        null;

    if (inline) {
        return (
            <div className="view-field-inline">

                {field.label && (
                    <span className="view-field-inline-label">
                        {field.label}:
                    </span>
                )}

                <Component
                    field={{
                        ...field,
                        label: undefined,
                    }}
                    value={displayValue}
                    schema={schema}
                />

            </div>
        );
    }

    if (
        field.hideIfEmpty &&
        !displayValue
    ) {
        return null;
    }

    return (
        <div
            className={className}
            style={{
                padding: field.padded
                    ? "0.25rem 0"
                    : undefined,
            }}
        >
            <Component
                field={field}
                value={displayValue}
                schema={schema}
                size={containerSize}
            />
        </div>
    );
};


export const ViewFieldGrid = ({
    fields = [],
    values = {},
    schema = {},
    columns = 2,
    className = "",
}) => {

    const getColumnClass = (colSpan) => {

        const spans = {
            1: "col-12",
            2: "col-6",
            3: "col-4",
            4: "col-3",
        };

        return spans[colSpan] ||
            spans[columns] ||
            "col-12";
    };

    return (
        <div className={`row g-3 ${className}`}>

            {fields.map((field) => {

                if (field.hidden) {
                    return null;
                }

                const value =
                    resolvePath(
                        values,
                        field.key
                    );

                if (
                    field.hideIfEmpty &&
                    (
                        value === null ||
                        value === undefined ||
                        value === ""
                    )
                ) {
                    return null;
                }

                return (
                    <div
                        key={field.key}
                        className={getColumnClass(
                            field.colSpan || 1
                        )}
                    >
                        <ViewFieldRenderer
                            field={field}
                            value={value}
                            schema={schema}
                        />
                    </div>
                );
            })}

        </div>
    );
};

export default ViewFieldRenderer;