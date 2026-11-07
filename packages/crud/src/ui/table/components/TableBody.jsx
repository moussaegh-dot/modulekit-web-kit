import TableRow from "./TableRow";
import EmptyState from "./EmptyState";

export default function TableBody({
  rows = [],
  columns = [],
}) {

  if (!rows.length) {

    return (
      <tbody className="crud-table-body">
        <EmptyState
          colSpan={columns.length + 1}
        />
      </tbody>
    );

  }

  return (
    <tbody className="crud-table-body">

      {rows.map((row) => (
        <TableRow
          key={row.key}
          row={row}
          columns={columns}
        />
      ))}

    </tbody>
  );
}