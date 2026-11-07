export const getPaginationRange = ({
  current,
  last,
  siblingCount = 1
}) => {

  const totalPageNumbers =
    siblingCount * 2 + 5;

  if (last <= totalPageNumbers) {
    return Array.from({ length: last }, (_, i) => ({
      type: "page",
      value: i + 1
    }));
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, last);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < last - 1;

  const range = [];

  // 🟦 FIRST PAGE
  range.push({ type: "page", value: 1 });

  // ⬅️ LEFT ELLIPSIS
  if (showLeftDots) {
    range.push({ type: "ellipsis", value: "..." });
  }

  // 📄 MIDDLE RANGE
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== last) {
      range.push({ type: "page", value: i });
    }
  }

  // ➡️ RIGHT ELLIPSIS
  if (showRightDots) {
    range.push({ type: "ellipsis", value: "..." });
  }

  // 🟦 LAST PAGE
  if (last !== 1) {
    range.push({ type: "page", value: last });
  }

  return range;
};