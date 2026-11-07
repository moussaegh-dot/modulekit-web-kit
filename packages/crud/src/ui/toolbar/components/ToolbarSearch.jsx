import { MDBIcon } from "mdb-react-ui-kit";

const ToolbarSearch = ({
  value = "",
  onChange,
}) => {

  return (
    <div className="toolbar-search">

      <MDBIcon
        fas
        icon="search"
        className="toolbar-search-icon"
      />

      <input
        type="text"
        className="toolbar-search-input"
        placeholder="Rechercher..."
        value={value}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
      />

      {value && (
        <button
          type="button"
          className="toolbar-search-clear"
          onClick={() => onChange?.("")}
          aria-label="Effacer la recherche"
        >
          <MDBIcon fas icon="xmark" />
        </button>
      )}

    </div>
  );
};

export default ToolbarSearch;