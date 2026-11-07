const ToolbarText = ({
  filter,
  value,
  onChange,
}) => {

  return (
    <input
      type="text"
      className="toolbar-input"
      placeholder={filter.label}
      value={value}
      onChange={(event) =>
        onChange?.(event.target.value)
      }
    />
  );
};

export default ToolbarText;