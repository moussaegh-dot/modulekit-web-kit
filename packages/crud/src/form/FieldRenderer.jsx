import { useForm } from "./FormProvider";
import { fieldRegistry } from "./fieldRegistry";

const FieldRenderer = ({
    field,
    meta = {},
    schema = {},
    initialValues = {},
}) => {

    const {
        getValue,
        setValue,
        getError,
    } = useForm();

    if (!field?.type || !field?.key) {
        console.error("❌ Invalid field:", field);
        return null;
    }

    const mode = initialValues?.id
        ? "edit"
        : "create";

    if (
        field.hiddenOn &&
        field.hiddenOn.includes(mode)
    ) {
        return null;
    }

    const canSee =
        !field.permission ||
        schema?.permissions?.includes(field.permission);

    if (!canSee) {
        return null;
    }

    const Component =
        fieldRegistry[field.type];

    if (!Component) {
        return (
            <div className="alert alert-warning">
                Champ non supporté : {field.type}
            </div>
        );
    }

    return (
        <Component
            field={field}

            /*
             * Valeur actuelle du formulaire.
             *
             * Pour un fichier :
             * - null = aucun nouveau fichier sélectionné
             * - File = nouveau fichier sélectionné
             */
            value={getValue(field.key)}

            /*
             * Ancienne valeur venant de l'API.
             *
             * Exemple :
             * "images/univ-segou.jpg"
             */
            initialValue={
                initialValues?.[field.key]
            }

            onChange={(value) =>
                setValue(
                    field.key,
                    value
                )
            }

            error={getError(field.key)}
            meta={meta}
            mode={mode}
            schema={schema}
        />
    );
};

export default FieldRenderer;