/**
 * 📁 TextCell.jsx
 * 🎯 Default safe renderer
 */

const TextCell = ({ value }) => {
  return (
    <span>
      {value ?? "-"}
    </span>
  );
};

export default TextCell;