import TableHeader from "./components/TableHeader";
import TableBody from "./components/TableBody";
import "./crud-table.css"
export default function TableRenderer({ grid }) {

  if (grid.empty) {
    return (
      <div className="crud-table-empty-alert">
        <span className="crud-table-empty-icon">
          !
        </span>

        <div>
          <strong>Aucun élément à afficher</strong>
          <span>
            Aucun résultat ne correspond aux données disponibles.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-table-wrapper">

      <div className="crud-table-scroll">

        <table className="crud-table">

          <TableHeader
            columns={grid.columns}
            {...grid.sorting}
          />

          <TableBody
            rows={grid.rows}
            columns={grid.columns}
          />

        </table>

      </div>

    </div>
  );
}