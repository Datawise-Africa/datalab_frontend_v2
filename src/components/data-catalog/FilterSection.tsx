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
    <div className="max-w-24xl">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-md w-full rounded border border-gray-300 bg-white px-4 py-2 text-left font-semibold text-gray-500 shadow-sm hover:bg-gray-50"
      >
        {title}
      </button>

      {/* Dropdown Checklist */}
      {isOpen && (
        <div className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white p-3 shadow-md">
          {options.map((option, index) => (
            <label
              key={index}
              className="mb-1 flex cursor-pointer items-center space-x-2"
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
