import CrudToolbar from "./ui/toolbar/CrudToolbar";
import CrudPagination from "./ui/pagination/CrudPagination";
import TableRenderer from "./ui/table/TableRenderer";

import { useCrudController } from "./hooks";
import "./crud-page.css"
export default function CrudPage({ page }) {

  const {
    loading,
    error,
    toolbar,
    grid,
    pagination,
  } = useCrudController(page);

  if (!grid) {
    return (
      <div className="crud-page">
        <div className="crud-page-alert crud-page-alert--danger">
          La page ne référence aucune grille.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="crud-page">
        <div className="crud-page-loading">
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="crud-page">
        <div className="crud-page-alert crud-page-alert--danger">
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="crud-page">

      <CrudToolbar
        {...toolbar}
      />

      <TableRenderer
        grid={grid}
      />

      <CrudPagination
        {...pagination}
      />

    </div>
  );
}