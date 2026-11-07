import SortIcon from "./SortIcon";

const TableHeader = ({
  columns = [],
  onSort,
  sortBy,
  sortDirection,
}) => {

  return (
    <thead className="crud-table-head">

      <tr>

        {columns.map((col, index) => {

          const sortable =
            col.sortable && onSort;

          return (
            <th
              key={col.key || index}
              className={
                sortable
                  ? "crud-table-th crud-table-th--sortable"
                  : "crud-table-th"
              }
              onClick={() => {
                if (sortable) {
                  onSort(col.key);
                }
              }}
            >

              <div className="crud-table-header-content">

                <span>
                  {col.label}
                </span>

                <SortIcon
                  column={col}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />

              </div>

            </th>
          );
        })}

        <th className="crud-table-th crud-table-th--actions">
          Actions
        </th>

      </tr>

    </thead>
  );
};

export default TableHeader;