/**
 * 📁 SchemaViewModelBuilder.js
 *
 * Base ViewModel builder
 * for schema-driven UI.
 */

import SchemaResource from "../resources/SchemaResource";

export default class SchemaViewModelBuilder {

    static build({

        schema,

        meta = {},

        mode = null,

        values = {},

        handlers = {},

    }) {

        const resource =
            SchemaResource.build(schema);

        return {

            ...resource,

            meta,

            mode,

            values,

            handlers,

        };

    }

}