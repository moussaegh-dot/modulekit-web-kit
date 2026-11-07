/**
 * 📁 BadgeCell.jsx
 * 🎯 Dynamic badge renderer
 */

const BadgeCell = ({ value, column }) => {

  const className =
    column.badgeMap?.[value] ||
    "bg-secondary";

  const label =
    column.labelMap?.[value] ||
    value;

  return (
    <span className={`badge ${className}`}>
      {label ?? "-"}
    </span>
  );
};

export default BadgeCell;