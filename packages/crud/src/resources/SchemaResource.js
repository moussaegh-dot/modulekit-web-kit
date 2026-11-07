/**
 * 📁 SchemaResource.js
 *
 * Normalize schema resources coming
 * from the page manifest.
 */

export default class SchemaResource {

    static build(schema = {}) {

        return {

            descriptor:
                schema.descriptor ?? {},

            fields:
                Array.isArray(schema.fields)
                    ? schema.fields
                    : [],

        };

    }

}