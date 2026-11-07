import { MDBIcon } from "mdb-react-ui-kit";

const SortIcon = ({
  column,
  sortBy,
  sortDirection,
}) => {

  if (!column?.sortable) {
    return null;
  }

  if (sortBy !== column.key) {
    return (
      <MDBIcon
        fas
        icon="sort"
        className="crud-table-sort-icon"
      />
    );
  }

  return (
    <MDBIcon
      fas
      icon={
        sortDirection === "asc"
          ? "sort-up"
          : "sort-down"
      }
      className="crud-table-sort-icon crud-table-sort-icon--active"
    />
  );
};

export default SortIcon;