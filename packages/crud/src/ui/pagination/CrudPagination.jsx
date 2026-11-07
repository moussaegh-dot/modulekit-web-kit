import PaginationButton from "./PaginationButton";
import { usePagination } from "../../hooks/ui/usePagination";
import "./crud-pagination.css"
const CrudPagination = ({
  meta = {},
  onChange,
}) => {

  const {
    currentPage,
    lastPage,
    canPrevious,
    canNext,
    goPrevious,
    goNext,
    pages,
  } = usePagination({
    meta,
    onChange,
  });

  if (lastPage <= 1) return null;

  return (
    <nav
      className="crud-pagination"
      aria-label="Pagination"
    >

      {/* PRÉCÉDENT */}
      <PaginationButton
        direction="previous"
        disabled={!canPrevious}
        onClick={goPrevious}
      />

      {/* PAGES */}
      <div className="crud-pagination-pages">

        {pages.map((item, index) => {

          const isActive =
            item.type === "page" &&
            item.value === currentPage;

          if (item.type === "ellipsis") {
            return (
              <span
                key={index}
                className="crud-pagination-ellipsis"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          return (
            <button
              key={index}
              type="button"
              className={`crud-pagination-page ${
                isActive
                  ? "crud-pagination-page--active"
                  : ""
              }`}
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
              onClick={() =>
                onChange?.(item.value)
              }
            >
              {item.value}
            </button>
          );
        })}

      </div>

      {/* SUIVANT */}
      <PaginationButton
        direction="next"
        disabled={!canNext}
        onClick={goNext}
      />

    </nav>
  );
};

export default CrudPagination;