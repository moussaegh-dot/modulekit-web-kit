const ToolbarSelect = ({
  filter,
  value,
  options = {},
  onChange,
}) => {

  const normalizedOptions = Array.isArray(options)
    ? options
    : Object.entries(options).map(
        ([value, label]) => ({
          value,
          label,
        })
      );

  return (
    <div className="toolbar-filter-control">

      <select
        className="toolbar-select"
        value={value || ""}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
      >

        <option value="">
          {filter.label}
        </option>

        {normalizedOptions.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}

      </select>

    </div>
  );
};

export default ToolbarSelect;