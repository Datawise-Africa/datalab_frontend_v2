import type { DatasetSortOptions } from '@/hooks/use-datasets';

type SortDataProps = {
  sortIsOpen: boolean;
  toggleDropdown: () => void;
  onSort: (sortOption: DatasetSortOptions) => void;
};

const SortData = ({ sortIsOpen, toggleDropdown, onSort }: SortDataProps) => {
  const sortOptions = ['Popular', 'Most Recent'];

  return (
    <div className="relative inline-block z-50">
      <div onClick={toggleDropdown} className="cursor-pointer">
        <p>Sort by</p>
      </div>
      {sortIsOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#FFFFFF] rounded-md shadow-lg">
          {sortOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                onSort(option as DatasetSortOptions); // Calls sorting function in `DataCatalog`
                toggleDropdown(); // Closes dropdown
              }}
              className="px-4 py-2 cursor-pointer hover:text-[#474060]"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortData;
