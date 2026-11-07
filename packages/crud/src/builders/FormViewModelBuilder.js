/**
 * 📁 FormViewModelBuilder.js
 *
 * Build form-specific ViewModel.
 */

import SchemaViewModelBuilder from "./SchemaViewModelBuilder";

export default class FormViewModelBuilder
    extends SchemaViewModelBuilder {

    static build({

        schema,

        mode = "create",

        initialValues = {},

        onSubmit,

        meta = {},

    }) {

        const viewModel = super.build({

            schema,

            meta,

            mode,

            values: initialValues,

            handlers: {

                submit: onSubmit,

            },

        });

        if (!viewModel) {
            return null;
        }

        return {

            ...viewModel,

            submitLabel:
                schema?.submitLabel ??
                this.submitLabel(mode),

        };

    }

    static submitLabel(mode) {

        return {

            create: "Créer",

            edit: "Mettre à jour",

            view: "Fermer",

        }[mode] ?? "Enregistrer";

    }

}