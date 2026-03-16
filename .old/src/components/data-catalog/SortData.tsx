import type { DatasetSortOptions } from '@/store/use-dataset-controls';

type SortDataProps = {
  sortIsOpen: boolean;
  toggleDropdown: () => void;
  onSort: (sortOption: DatasetSortOptions) => void;
};

const SortData = ({ sortIsOpen, toggleDropdown, onSort }: SortDataProps) => {
  const sortOptions = ['Popular', 'Most Recent'];

  return (
    <div className="relative z-50 inline-block">
      <div onClick={toggleDropdown} className="cursor-pointer">
        <p>Sort by</p>
      </div>
      {sortIsOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-[#FFFFFF] shadow-lg">
          {sortOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                onSort(option as DatasetSortOptions); // Calls sorting function in `DataCatalog`
                toggleDropdown(); // Closes dropdown
              }}
              className="cursor-pointer px-4 py-2 hover:text-[#474060]"
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
