import FilterSection from './DatasetFilterSection';
import { RotateCcw } from 'lucide-react';
import type { DatasetFilterOptions } from '@/lib/types/data-set';
import { datasetFilterOptions } from '@/lib/data/dataset-filter-options';

type FilterPanelProps = {
  filters: DatasetFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<DatasetFilterOptions>>;
};

const FilterPanel = ({ filters, setFilters }: FilterPanelProps) => {
  const handleManualReset = () => {
    setFilters({
      accessLevel: [],
      dataType: [],
      region: [],
      timeframe: [],
    });
  };

  // Calculate total active filters
  const totalActiveFilters = Object.values(filters).reduce(
    (total, filterArray) => total + filterArray.length,
    0,
  );

  return (
    <div className="w-full space-y-6">
      {/* Filter Heading with Reset */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {/* <h2 className="text-2xl font-light tracking-wide text-gray-800">
            Filters
          </h2> */}
          {/* {totalActiveFilters > 0 && (
            <span className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
              {totalActiveFilters} active
            </span>
          )} */}
        </div>
        {totalActiveFilters > 0 && (
          <button
            onClick={handleManualReset}
            className="group flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:text-gray-800"
          >
            <RotateCcw className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-180" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Responsive Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <FilterSection
          title="Access Level"
          options={Object.values(datasetFilterOptions.accessLevel)}
          category="accessLevel"
          filters={filters}
          setFilters={setFilters}
        />
        <FilterSection
          title="Data Type"
          options={Object.values(datasetFilterOptions.dataType)}
          category="dataType"
          filters={filters}
          setFilters={setFilters}
        />
        <FilterSection
          title="Region"
          options={Object.values(datasetFilterOptions.region)}
          category="region"
          filters={filters}
          setFilters={setFilters}
        />
        <FilterSection
          title="Timeframe"
          options={Object.values(datasetFilterOptions.timeframe)}
          category="timeframe"
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {/* Active Filters Summary */}
      {totalActiveFilters > 0 && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Active Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([category, selectedOptions]) =>
              selectedOptions.map((option) => (
                <span
                  key={`${category}-${option}`}
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm"
                >
                  {option}
                  <button
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        [category]: prev[category].filter(
                          (item) => item !== option,
                        ),
                      }));
                    }}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
