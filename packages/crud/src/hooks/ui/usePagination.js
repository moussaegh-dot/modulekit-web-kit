import { useMemo } from "react";
import { getPaginationRange } from "./getPaginationRange";

export const usePagination = ({
  meta = {},
  onChange
}) => {

  const currentPage =
    Number(meta.page ?? meta.current_page) || 1;

  const lastPage =
    Number(meta.lastPage ?? meta.last_page) || 1;

  const canPrevious = currentPage > 1;
  const canNext = currentPage < lastPage;

  const goToPage = (page) => {
    const safe = Number(page);
    if (!safe || safe < 1 || safe > lastPage) return;
    onChange?.(safe);
  };

  const goPrevious = () => {
    if (canPrevious) goToPage(currentPage - 1);
  };

  const goNext = () => {
    if (canNext) goToPage(currentPage + 1);
  };

  const pages = useMemo(() => {
    return getPaginationRange({
      current: currentPage,
      last: lastPage,
      siblingCount: 1
    });
  }, [currentPage, lastPage]);
// console.log("PAGINATION META", meta);
// console.log("CURRENT", currentPage);
// console.log("LAST", lastPage);
  return {
    currentPage,
    lastPage,
    canPrevious,
    canNext,
    goToPage,
    goPrevious,
    goNext,
    pages,
    meta
  };
};