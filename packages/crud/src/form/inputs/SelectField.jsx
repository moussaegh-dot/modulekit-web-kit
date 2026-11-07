import FormFieldWrapper from "./FormFieldWrapper";

const SelectField = ({
    field,
    value,
    onChange,
    error,
    meta = {},
}) => {

    const source = field.optionsFrom
        ? meta?.[field.optionsFrom]
        : field.options;

    const options = normalizeOptions(source);

    return (
        <FormFieldWrapper
            label={field.label}
            error={error}
            helpText={field.helpText}
        >

            <select
                className={`form-field-select ${
                    error ? "is-invalid" : ""
                }`}
                value={value ?? ""}
                onChange={(e) =>
                    onChange(e.target.value)
                }
            >

                <option value="">
                    -- Sélectionner --
                </option>

                {options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}

            </select>

        </FormFieldWrapper>
    );
};

function normalizeOptions(source) {

    if (Array.isArray(source)) {

        return source.map((option) => ({
            value:
                option.value ??
                option.id,

            label:
                option.label ??
                option.nom ??
                option.name,
        }));

    }

    if (
        source &&
        typeof source === "object"
    ) {

        return Object.entries(source).map(
            ([value, label]) => ({
                value,
                label,
            })
        );
    }

    return [];
}

export default SelectField;