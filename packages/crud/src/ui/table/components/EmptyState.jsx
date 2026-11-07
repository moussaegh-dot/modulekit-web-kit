const EmptyState = ({
  colSpan,
}) => {

  return (
    <tr>
      <td
        colSpan={colSpan}
        className="crud-table-empty"
      >

        <div className="crud-table-empty-content">

          <div className="crud-table-empty-icon">
            <span>∅</span>
          </div>

          <div>
            <strong>
              Aucun résultat
            </strong>

            <span>
              Aucun élément ne correspond aux critères actuels.
            </span>
          </div>

        </div>

      </td>
    </tr>
  );
};

export default EmptyState;