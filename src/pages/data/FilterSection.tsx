import type { DatasetFilterOptions } from '@/lib/types/data-set';
import { useState } from 'react';
// import PropTypes from 'prop-types';

type FilterSectionProps = {
  title: string;
  options: string[];
  category: string;
  filters: DatasetFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<DatasetFilterOptions>>;
};

const FilterSection = ({
  title,
  options,
  category,
  filters,
  setFilters,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value],
    }));
  };

  return (
    <div className="max-w-24xl ">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border border-gray-300 rounded px-4 py-2 shadow-sm text-left text-md font-semibold text-gray-500 hover:bg-gray-50"
      >
        {title}
      </button>

      {/* Dropdown Checklist */}
      {isOpen && (
        <div className="mt-2 border border-gray-200 rounded-lg shadow-md p-3 bg-white max-h-80 overflow-y-auto">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 mb-1 cursor-pointer"
            >
              <input
                type="checkbox"
                className="form-checkbox text-blue-600"
                onChange={() => handleFilterChange(option)}
                checked={filters[category].includes(option)}
              />
              <span className="text-md text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
