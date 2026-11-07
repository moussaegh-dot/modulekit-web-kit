const PaginationButton = ({
  direction = "next",
  disabled = false,
  onClick,
}) => {

  const isPrevious =
    direction === "previous";

  return (
    <button
      type="button"
      className="crud-pagination-nav"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="crud-pagination-nav-icon">
        {isPrevious ? "←" : "→"}
      </span>

      <span>
        {isPrevious
          ? "Précédent"
          : "Suivant"}
      </span>
    </button>
  );
};

export default PaginationButton;