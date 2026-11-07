import TableCell from "./TableCell";
import TableActions from "./TableActions";

export default function TableRow({
  row,
  columns,
}) {

  return (
    <tr className="crud-table-row">

      {columns.map((column) => (
        <TableCell
          key={column.key}
          row={row.data}
          column={column}
        />
      ))}

      <TableActions
        actions={row.actions}
      />

    </tr>
  );
}