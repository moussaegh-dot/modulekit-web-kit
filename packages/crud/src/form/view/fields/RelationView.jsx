/**
 * 📁 src/core/form/view/fields/RelationView.jsx
 */

import ViewFieldWrapper from "../ViewFieldWrapper";


const RelationView = ({
    field,
    value,
}) => {

    const relation =
        field?.relation ?? {};

    /*
    |--------------------------------------------------------------------------
    | Valeur vide
    |--------------------------------------------------------------------------
    */

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return (
            <ViewFieldWrapper field={field}>
                <span>-</span>
            </ViewFieldWrapper>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Relation multiple
    |--------------------------------------------------------------------------
    */

    if (Array.isArray(value)) {

        if (value.length === 0) {
            return (
                <ViewFieldWrapper field={field}>
                    <span>-</span>
                </ViewFieldWrapper>
            );
        }

        const labels = value
            .map((item) =>
                resolveLabel(
                    item,
                    relation
                )
            )
            .filter(
                (label) =>
                    label !== null &&
                    label !== undefined &&
                    label !== ""
            );

        return (
            <ViewFieldWrapper field={field}>
                <span>
                    {labels.length > 0
                        ? labels.join(", ")
                        : "-"}
                </span>
            </ViewFieldWrapper>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Relation simple
    |--------------------------------------------------------------------------
    */

    return (
        <ViewFieldWrapper field={field}>
            <span>
                {resolveLabel(
                    value,
                    relation
                ) ?? "-"}
            </span>
        </ViewFieldWrapper>
    );
};


/*
|--------------------------------------------------------------------------
| Resolve relation label
|--------------------------------------------------------------------------
*/

function resolveLabel(
    value,
    relation = {}
) {

    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | Objet Eloquent
    |--------------------------------------------------------------------------
    */

    if (
        typeof value === "object"
    ) {

        const labelColumn =
            relation.labelColumn ??
            relation.label_column ??
            "nom";

        return (
            value[labelColumn] ??
            value.name ??
            value.nom ??
            value.label ??
            value.id ??
            null
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Valeur déjà aplatie
    |--------------------------------------------------------------------------
    */

    return value;
}


export default RelationView;