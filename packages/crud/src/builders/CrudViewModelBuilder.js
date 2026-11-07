/**
 * 📁 CrudViewModelBuilder.js
 *
 * Compose complete CRUD page ViewModel.
 */

import ToolbarViewModelBuilder from "./ToolbarViewModelBuilder";
import TableViewModelBuilder from "./TableViewModelBuilder";
import PaginationViewModelBuilder from "./PaginationViewModelBuilder";

export default class CrudViewModelBuilder {

    static build({

        page,

        engine,

        data = [],

        meta = {},

        handlers = {},

        loading = false,

        error = null,

    }) {

        const {

            state = {},

            setFilter,

            reset,

            setSort,

            setPage,

        } = engine;

        const {

            table = null,

            filters = null,

            actions = {},

        } = page.resources ?? {};


        return {

            state: {

                loading,

                error,

            },

            actions: handlers,

            toolbar: ToolbarViewModelBuilder.build({

                page,

                values: state,

                meta,

                onChange: setFilter,

                onReset: reset,

                onCreate: handlers.create,

            }),

            grid: TableViewModelBuilder.build({

                table,

                rows: data,

                actionDescriptors:
                    actions.row ?? [],

                actionHandlers: handlers,

                sortBy:
                    state.sort_by,

                sortDirection:
                    state.sort_direction,

                onSort: setSort,

            }),

            pagination: PaginationViewModelBuilder.build({

                meta,

                onChange: setPage,

            }),

        };

    }

}