/**
 * 📁 ModalViewModelBuilder.js
 *
 * Build modal view models.
 */

import Page from "@moussaegh-dot/modulekit-engine/pages/helpers/Page.js";
import FormViewModelBuilder from "./FormViewModelBuilder";

export default class ModalViewModelBuilder {

    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    static form({

        page,

        mode = "create",

        values = {},

        onSubmit,

    }) {

        const schema = page.resources?.form;

        if(!schema){

            console.warn(
                "Form schema missing",
                page
            );

        }

        return {
            type:"form",

            props:{
                title: Page.modalTitle(mode,page),

                form: FormViewModelBuilder.build({
                    schema: page.resources?.form,
                    mode,
                    initialValues:values,
                    onSubmit,
                }),
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Confirm
    |--------------------------------------------------------------------------
    */

    static confirm({

        page,

        onConfirm,

    }) {
        const schema =
            page.resources?.view;

        if (!schema) {

            console.warn(
                "View schema missing",
                page
            );

        }
        return {

            type: "confirm",

            props: {

                title: Page.modalTitle("delete", page),

                onConfirm,

            },

        };

    }

    /*
    |--------------------------------------------------------------------------
    | View
    |--------------------------------------------------------------------------
    */

    static view({
        page,
        data,
    }) {

        const schema = page.resources?.view;

        if (!schema) {

            console.warn(
                "View schema missing",
                page
            );

        }

        return {

            type: "view",

            props: {

                title: Page.modalTitle(
                    "view",
                    page
                ),

                data,

                schema,

            },

        };

    }

}