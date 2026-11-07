/**
 * 📁 ColumnViewModelBuilder.js
 *
 * Prepare table columns for rendering.
 */
export default class ColumnViewModelBuilder {

    static build(columns = []) {

        if (!Array.isArray(columns)) {
            return [];
        }

        return columns.map(column => ({

            key: column.key,

            label: column.label,

            type: column.type ?? "text",

            sortable: Boolean(column.sortable),

            searchable: Boolean(column.searchable),

            visible: column.visible !== false,

            width: column.width ?? null,

            align: column.align ?? "start",

            formatter: column.formatter ?? null,

        }));

    }

}