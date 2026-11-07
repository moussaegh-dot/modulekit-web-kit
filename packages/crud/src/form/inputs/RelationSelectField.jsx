import { useEffect, useState } from "react";

import FormFieldWrapper from "./FormFieldWrapper";
import RelationService from "@moussaegh-dot/modulekit-http/services/RelationService.js";

const RelationSelectField = ({
    field,
    value,
    onChange,
    error,
}) => {

    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const relation = field.relation;

    const multiple =
        field.attributes?.multiple === true;

    useEffect(() => {

        let mounted = true;

        async function loadOptions() {

            try {

                const resource =
                    relation?.resource;

                if (!resource) {

                    console.warn(
                        "Relation resource missing",
                        field
                    );

                    if (mounted) {
                        setLoading(false);
                    }

                    return;
                }

                const params = {
                    label_column:
                        relation?.labelColumn ?? "nom",

                    value_column:
                        relation?.valueColumn ?? "id",
                };

                const response =
                    await RelationService.options(
                        resource,
                        params
                    );

                if (!mounted) {
                    return;
                }

                setOptions(
                    normalizeOptions(response)
                );

            } catch (error) {

                console.error(
                    "Erreur de chargement des options",
                    error
                );

                if (mounted) {
                    setOptions([]);
                }

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }
        }

        loadOptions();

        return () => {
            mounted = false;
        };

    }, [
        relation?.resource,
        relation?.labelColumn,
        relation?.valueColumn,
    ]);


    /*
    |--------------------------------------------------------------------------
    | VALUE
    |--------------------------------------------------------------------------
    */

    const selectValue = multiple
        ? normalizeMultipleValue(value)
        : normalizeSingleValue(value);


    /*
    |--------------------------------------------------------------------------
    | CHANGE
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        if (multiple) {

            const values =
                Array.from(
                    event.target.selectedOptions
                ).map(
                    option => option.value
                );

            onChange(values);

            return;
        }

        onChange(
            event.target.value
        );
    };


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
                value={selectValue}
                multiple={multiple}
                disabled={loading}
                onChange={handleChange}
            >

                {!multiple && (
                    <option value="">
                        {loading
                            ? "Chargement..."
                            : "-- Sélectionner --"}
                    </option>
                )}

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


/*
|--------------------------------------------------------------------------
| OPTIONS
|--------------------------------------------------------------------------
*/

function normalizeOptions(response) {

    if (
        response &&
        Array.isArray(response.data)
    ) {
        return normalizeOptions(
            response.data
        );
    }

    if (!Array.isArray(response)) {
        return [];
    }

    return response.map((option) => ({
        value:
            option.value ??
            option.id,

        label:
            option.label ??
            option.nom ??
            option.name,
    }));
}


/*
|--------------------------------------------------------------------------
| VALUE NORMALIZATION
|--------------------------------------------------------------------------
*/

function normalizeMultipleValue(value) {

    if (Array.isArray(value)) {
        return value.map(String);
    }

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return [];
    }

    return [String(value)];
}


function normalizeSingleValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (Array.isArray(value)) {
        return value[0] ?? "";
    }

    return String(value);
}


export default RelationSelectField;
