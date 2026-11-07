/**
 * 📁 RelationCell.jsx
 */

const RelationCell = ({
    value,
    column,
}) => {

    if (value === null || value === undefined) {
        return <span>-</span>;
    }

    const relation =
        column?.relation;

    const labelColumn =
        relation?.labelColumn ??
        "name";

    const values =
        Array.isArray(value)
            ? value
            : [value];

    return (
        <span>
            {values
                .map((item) => {

                    if (
                        item === null ||
                        item === undefined
                    ) {
                        return null;
                    }

                    if (
                        typeof item !== "object"
                    ) {
                        return item;
                    }

                    return (
                        item[labelColumn] ??
                        item.nom ??
                        item.name ??
                        item.id ??
                        "-"
                    );
                })
                .filter(Boolean)
                .join(", ")
            }
        </span>
    );
};




/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function resolveLabel(
    value,
    relation
) {

    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    /*
    | Objet relationnel
    */

    if (
        typeof value === "object"
    ) {

        const labelColumn =
            relation?.labelColumn ??
            relation?.label_column ??
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
    | Valeur déjà simple
    */

    return value;
}


export default RelationCell;
