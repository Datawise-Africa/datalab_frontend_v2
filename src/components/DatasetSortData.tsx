'use client';

import { Fragment, useState } from 'react';
import {
  Listbox,
  Transition,
  ListboxOption,
  ListboxOptions,
  ListboxButton,
} from '@headlessui/react';
import { ChevronDown, Check, TrendingUp, Clock } from 'lucide-react';

export type DataSortCriterion = 'Popular' | 'Most Recent';

type SortDataProps = {
  onSort: (option: DataSortCriterion) => void;
  initialSort?: DataSortCriterion;
  className?: string;
};

type SortOption = {
  value: DataSortCriterion;
  label: string;
  icon: React.ReactNode;
  description: string;
};

export default function SortData({
  onSort,
  initialSort = 'Popular',
  className = '',
}: SortDataProps) {
  const [selectedOption, setSelectedOption] =
    useState<DataSortCriterion>(initialSort);

  const sortOptions: SortOption[] = [
    {
      value: 'Popular',
      label: 'Most Popular',
      icon: <TrendingUp className="w-4 h-4" />,
      description: 'Highest usage and ratings',
    },
    {
      value: 'Most Recent',
      label: 'Most Recent',
      icon: <Clock className="w-4 h-4" />,
      description: 'Latest datasets first',
    },
  ];

  const handleSort = (option: DataSortCriterion) => {
    setSelectedOption(option);
    onSort(option);
  };

  const currentOption = sortOptions.find((opt) => opt.value === selectedOption);

  return (
    <div className={`relative ${className}`}>
      <Listbox value={selectedOption} onChange={handleSort}>
        {({ open }) => (
          <>
            <ListboxButton className="flex w-full items-center space-x-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-left shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-md">
              <span className="text-sm text-gray-500 whitespace-nowrap">
                Sort by:
              </span>
              {currentOption && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-800 whitespace-nowrap">
                    {currentOption.label}
                  </span>
                </div>
              )}
              <ChevronDown
                className={`ml-auto w-4 h-4 text-gray-400 transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </ListboxButton>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              enter="transition ease-out duration-100"
              enterFrom="opacity-0"
              enterTo="opacity-100"
            >
              <ListboxOptions className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-xl focus:outline-none">
                {sortOptions.map((option) => (
                  <ListboxOption
                    key={option.value}
                    value={option.value}
                    className={({ selected, selectedOption }) =>
                      `cursor-pointer w-full px-4 py-3 flex items-center space-x-3 transition-colors duration-200 ${
                        selectedOption || selected ? 'bg-gray-50' : ''
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div key={option.value} className="w-full">
                        <div className="flex-1 flex items-start space-x-3">
                          <div
                            className={`mt-0.5 ${selected ? 'text-gray-800' : 'text-gray-500'}`}
                          >
                            {option.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div
                              className={`font-medium ${selected ? 'text-gray-800' : 'text-gray-700'}`}
                            >
                              {option.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {option.description}
                            </div>
                          </div>
                        </div>
                        {selected && (
                          <Check className="w-5 h-5 text-gray-800" />
                        )}
                      </div>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  );
}
