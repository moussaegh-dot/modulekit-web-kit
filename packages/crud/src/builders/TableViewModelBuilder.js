/**
 * 📁 GridViewModelBuilder.js
 */

import ColumnViewModelBuilder from "./ColumnViewModelBuilder";
import ActionViewModelBuilder from "./ActionViewModelBuilder";

export default class TableViewModelBuilder {

    static build({

        table,

        rows = [],

        actionDescriptors = [],

        actionHandlers = {},

        sortBy,

        sortDirection,

        onSort,

    }) {
        const columns = ColumnViewModelBuilder.build(
            table?.columns ?? []
        );
// console.log("TABLE BUILDER INPUT", {
//     table
// });
        return {

            descriptor: table?.descriptor ?? {},

            columns,

            rows: rows.map(row => ({

                key: row.id,

                data: row,

                actions: ActionViewModelBuilder.row(

                    actionDescriptors,

                    actionHandlers,

                    row,

                ),

            })),
            
            empty: rows.length === 0,

            sorting: {

                by: sortBy,

                direction: sortDirection,

                onSort,

            },

        };

    }

}