import type React from 'react';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Transition,
} from '@headlessui/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { DatasetFilterOptions } from '@/lib/types/data-set';

type FilterSectionProps = {
  title: string;
  options: string[];
  category: string;
  filters: DatasetFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<DatasetFilterOptions>>;
};

export default function FilterSection({
  title,
  options,
  category,
  filters,
  setFilters,
}: FilterSectionProps) {
  const handleFilterChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value],
    }));
  };

  return (
    <div className="w-full">
      <Disclosure as="div" className="relative">
        {({ open }) => (
          <>
            <DisclosureButton className="w-full group relative overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium tracking-wider text-gray-700 uppercase">
                  {title}
                </span>
                <div className="flex items-center space-x-2">
                  {filters[category].length > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-gray-800 rounded-full">
                      {filters[category].length}
                    </span>
                  )}
                  <div className="transition-transform duration-300">
                    {open ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>
            </DisclosureButton>

            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <DisclosurePanel className="absolute z-[1000] mt-2 w-full">
                <div className="rounded-lg border border-gray-200 bg-white shadow-xl">
                  <div className="max-h-80 overflow-y-auto p-2">
                    {options.map((option, index) => (
                      <label
                        key={index}
                        className="group flex items-center space-x-2 py-2 px-2 cursor-pointer rounded-md transition-colors duration-200 hover:bg-gray-50"
                      >
                        <div className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            onChange={() => handleFilterChange(option)}
                            checked={filters[category].includes(option)}
                          />
                          <div
                            className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                              filters[category].includes(option)
                                ? 'border-gray-800 bg-gray-800'
                                : 'border-gray-300 bg-white group-hover:border-gray-400'
                            }`}
                          >
                            {filters[category].includes(option) && (
                              <svg
                                className="absolute inset-0 w-full h-full text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-gray-700 font-medium">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </DisclosurePanel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
}
