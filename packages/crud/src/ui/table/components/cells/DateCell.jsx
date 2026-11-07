/**
 * 📁 DateCell.jsx
 * 🎯 Formatted date renderer
 */

const DateCell = ({ value }) => {

  if (!value) return "-";

  const date = new Date(value);

  return (
    <span>
      {date.toLocaleDateString("fr-FR")}
    </span>
  );
};

export default DateCell;