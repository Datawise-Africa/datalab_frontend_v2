import PropTypes from "prop-types";

const FilterSection = ({ title, options, category, filters, setFilters }) => {
  // Handle checkbox toggle
  const handleFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value],
    }));
  };

  return (
    <div className="border-t border-[#ddeeff] pt-2 max-w-xs">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="flex flex-col space-y-2">
        {options.map((option, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="form-checkbox "
              onChange={() => handleFilterChange(option)}
              checked={filters[category].includes(option)}
            />

            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

FilterSection.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  category: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired,
  setFilters: PropTypes.func.isRequired,
};

export default FilterSection;
