import type { DatasetFilterOptions } from '@/lib/types/data-set';
import FilterSection from './FilterSection';

type FilterPanelProps = {
  filters: DatasetFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<DatasetFilterOptions>>;
};

const FilterPanel = ({ filters, setFilters }: FilterPanelProps) => {
  // Mapping of original option values to user-friendly names
  const optionMappings = {
    accessLevel: {
      public: 'Public Access',
      non_profit: 'Non-Profit',
      commercial: 'Commercial',
      students: 'Student',
    },
    dataType: {
      education: 'Education',
      healthcare: 'Healthcare',
      agriculture: 'Agricultural',
      environmental: 'Environmental',
    },
    region: {
      'East Africa': 'East African ',
      'West Africa': 'West African ',
      'North Africa': 'North African ',
      'Southern Africa': 'Southern African ',
    },
    timeframe: {
      'Last Year': 'Past Year',
      'Last 5 Years': 'Past 5 Years',
      '5+ Years': 'More than 5 Years',
    },
  };

  const handleManualReset = () => {
    setFilters({
      accessLevel: [],
      dataType: [],
      region: [],
      timeframe: [],
    });
  };

  return (
    <div className="grid grid-cols-5 gap-4 w-full  ">
      <FilterSection
        title="Access Level"
        options={Object.values(optionMappings.accessLevel)}
        category="accessLevel"
        filters={filters}
        setFilters={setFilters}
      />
      <FilterSection
        title="Data Type"
        options={Object.values(optionMappings.dataType)}
        category="dataType"
        filters={filters}
        setFilters={setFilters}
      />
      <FilterSection
        title="Region"
        options={Object.values(optionMappings.region)}
        category="region"
        filters={filters}
        setFilters={setFilters}
      />
      <FilterSection
        title="Timeframe"
        options={Object.values(optionMappings.timeframe)}
        category="timeframe"
        filters={filters}
        setFilters={setFilters}
      />
      <div className="flex items-center justify-center">
        <button
          onClick={handleManualReset}
          className="p-2 bg-white text-gray-600 rounded font-semibold "
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
