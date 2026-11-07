/**
 * 📁 src/core/crud/ui/toolbar/CrudToolbar.jsx
 *
 * 🎯 CRUD Toolbar Renderer
 */

import ToolbarTitle from "./components/ToolbarTitle";
import ToolbarSearch from "./components/ToolbarSearch";
import ToolbarFilters from "./components/ToolbarFilters";
import "./crud-toolbar.css";
export default function CrudToolbar({

    title,

    description,

    singular,

    search,

    filtersEnabled,

    reset,

    create,

    values = {},

    filterFields = [],

    meta = {},

    onChange,

    onReset,

    onCreate,

}) {

    return (
        <div className="crud-toolbar">

        <div className="d-flex align-items-center justify-content-between">

            <ToolbarTitle
            title={title}
            description={description}
            />

            <div className="crud-toolbar-actions">

            {search && (
                <ToolbarSearch
                value={values.q ?? ""}
                onChange={(value) =>
                    onChange?.("q", value)
                }
                />
            )}

            {filtersEnabled &&
                filterFields.length > 0 && (
                <ToolbarFilters
                    filters={filterFields}
                    values={values}
                    meta={meta}
                    onChange={onChange}
                />
                )}

            {reset && (
                <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onReset}
                >
                Reset
                </button>
            )}

            {create && (
                <button
                type="button"
                className="btn btn-primary"
                onClick={onCreate}
                >
                + Ajouter {singular}
                </button>
            )}

            </div>

        </div>

        </div>
    );

}