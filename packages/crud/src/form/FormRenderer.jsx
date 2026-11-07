import { FormProvider, useForm } from "./FormProvider";
import FieldRenderer from "./FieldRenderer";
import { resolvePath, setPath } from "../utils";


/*
|--------------------------------------------------------------------------
| Prépare les valeurs réellement utilisées par le formulaire
|--------------------------------------------------------------------------
|
| En édition :
| - logo = "images/ancien-logo.png"  → ne doit PAS être envoyé
| - image = "images/ancienne-image.jpg" → ne doit PAS être envoyé
|
| Le FileField recevra quand même les valeurs originales via
| initialValues afin de pouvoir afficher le fichier existant.
|
*/
function prepareFormValues(values, fields) {

    const prepared = structuredClone(values ?? {});

    fields
        .filter(field => field.type === "file")
        .forEach(field => {

            const value = resolvePath(
                prepared,
                field.key,
                null
            );

            /*
             * Si c'est une ancienne URL / chemin,
             * on la retire du payload.
             *
             * Si c'est déjà un File/Blob, on le conserve.
             */
            if (
                typeof value === "string" ||
                value === null ||
                value === undefined
            ) {
                setPath(
                    prepared,
                    field.key,
                    null
                );
            }
        });

    return prepared;
}


function FormContent({
    fields,
    descriptor,
    submitLabel,
    meta,
    initialValues,
}) {

    const { loading } = useForm();

    return (
        <div className="row">

            {fields.map(field => (
                <div
                    key={field.key}
                    className={field.col ?? "col-12"}
                >
                    <FieldRenderer
                        field={field}
                        descriptor={descriptor}
                        meta={meta}

                        /*
                         * Valeurs originales utilisées uniquement
                         * pour l'affichage / contexte du champ.
                         */
                        initialValues={initialValues}
                    />
                </div>
            ))}

            <div className="col-12 mt-4">

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-100"
                >
                    {loading
                        ? "Enregistrement..."
                        : submitLabel}
                </button>

            </div>

        </div>
    );
}


export default function FormRenderer({
    fields = [],
    descriptor = {},
    values = {},
    handlers = {},
    submitLabel = "Enregistrer",
    meta = {},
}) {


    if (
        !Array.isArray(fields) ||
        fields.length === 0
    ) {
        return (
            <div className="alert alert-warning">
                Aucun champ à afficher.
            </div>
        );
    }

    /*
     * Valeurs utilisées par FormProvider pour le submit.
     *
     * Les anciens chemins de fichiers sont retirés.
     */
    const formValues = prepareFormValues(
        values,
        fields
    );


    return (
        <FormProvider
            initialValues={formValues}
            onSubmit={handlers.submit}
        >
            <FormContent
                fields={fields}
                descriptor={descriptor}
                submitLabel={submitLabel}
                meta={meta}

                /*
                 * Ici on conserve les vraies valeurs API,
                 * notamment les anciens chemins des fichiers.
                 */
                initialValues={values}
            />
        </FormProvider>
    );
}