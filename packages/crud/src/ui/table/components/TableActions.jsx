import { MDBIcon } from "mdb-react-ui-kit";

export default function TableActions({
  actions = [],
}) {

  if (!actions.length) {
    return (
      <td className="crud-table-actions-cell">
        —
      </td>
    );
  }

  return (
    <td className="crud-table-actions-cell">

      <div className="crud-table-actions">

        {actions.map((action) => (

          <button
            key={action.key}
            type="button"
            className={`crud-table-action ${
              action.color
                ? `crud-table-action--${action.color}`
                : ""
            }`}
            title={
              action.tooltip ??
              action.label
            }
            aria-label={
              action.tooltip ??
              action.label
            }
            onClick={action.onClick}
            disabled={action.disabled}
          >

            {action.icon ? (
              <MDBIcon
                fas
                icon={action.icon}
              />
            ) : (
              <span>
                {action.label}
              </span>
            )}

          </button>

        ))}

      </div>

    </td>
  );
}