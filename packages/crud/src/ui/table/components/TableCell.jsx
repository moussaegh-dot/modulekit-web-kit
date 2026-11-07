import CellRegistry from "../CellRegistry";
import { resolvePath } from "../../../utils";

const TableCell = ({
    column,
    row,
}) => {

    const value = resolvePath(
        row,
        column.key
    );

    if (typeof column?.render === "function") {
        return (
            <td>
                {column.render(value, row, column)}
            </td>
        );
    }

    const Renderer = CellRegistry.resolve(
        column?.type ?? "text"
    );

    if (Renderer) {
        return (
            <td>
                <Renderer
                    value={value}
                    row={row}
                    column={column}
                />
            </td>
        );
    }

    return (
        <td>
            {formatFallback(value, column)}
        </td>
    );
};

function formatFallback(value, column)
{
    if (value == null) {
        return "-";
    }

    if (column?.type === "date") {
        return new Date(value).toLocaleDateString();
    }

    if (column?.type === "number") {
        return Number(value).toLocaleString();
    }

    return value;
}

export default TableCell;