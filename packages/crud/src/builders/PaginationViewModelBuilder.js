/**
 * 📁 PaginationViewModelBuilder.js
 *
 * Prepare pagination props.
 */

export default class PaginationViewModelBuilder {

    static build({
        meta,
        onChange,
    }) {

        return {

            meta,

            onChange,

        };

    }

}