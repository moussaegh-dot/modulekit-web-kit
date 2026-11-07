/**
 * 📁 MoneyCell.jsx
 * 🎯 Currency renderer
 */

const MoneyCell = ({ value }) => {

  if (value == null) return "-";

  return (
    <span>
      {Number(value).toLocaleString("fr-FR")} FCFA
    </span>
  );
};

export default MoneyCell;