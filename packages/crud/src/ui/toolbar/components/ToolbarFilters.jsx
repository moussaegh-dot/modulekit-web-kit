import ToolbarSelect from "./ToolbarSelect";
import ToolbarText from "./ToolbarText";

import { useToolbarFilters } from "../../../hooks";

const ToolbarFilters = ({
  filters = [],
  values = {},
  meta = {},
  onChange,
}) => {

  const {
    normalizedFilters,
    handleChange,
  } = useToolbarFilters({
    filters,
    values,
    meta,
    onChange,
  });

  if (!normalizedFilters.length) {
    return null;
  }

  return (
    <>
      {normalizedFilters.map((filter) => {

        const value = filter.value ?? "";

        const handleFilterChange = (newValue) =>
          handleChange(
            filter.key,
            newValue
          );

        switch (filter.type) {

          case "select":
            return (
              <ToolbarSelect
                key={filter.key}
                filter={filter}
                value={value}
                options={filter.options}
                onChange={handleFilterChange}
              />
            );

          case "text":
            return (
              <ToolbarText
                key={filter.key}
                filter={filter}
                value={value}
                onChange={handleFilterChange}
              />
            );

          default:
            return null;
        }

      })}
    </>
  );
};

export default ToolbarFilters;