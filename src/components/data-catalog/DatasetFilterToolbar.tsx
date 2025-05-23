'use client';

import type React from 'react';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, ChevronDown, X, CheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { DatasetFilterOptions, IDataset } from '@/lib/types/data-set';
import { datasetFilterOptions } from '@/lib/data/dataset-filter-options';
import type { DatasetSortOptions } from '@/hooks/use-datasets';
import useApi from '@/hooks/use-api';

type DatasetToolBarProps = {
  filters: DatasetFilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<DatasetFilterOptions>>;
  onSearchResults: (results: IDataset[]) => void;
  setSortOption: React.Dispatch<React.SetStateAction<DatasetSortOptions>>;
  sortOption: DatasetSortOptions;
  resetSearch: () => void;
};

export default function DatasetFilterToolbar({
  filters,
  setFilters,
  onSearchResults,
  sortOption,
  setSortOption,
  resetSearch,
}: DatasetToolBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const api = useApi().publicApi;
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setIsSearching(true);
    }

    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery);
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchQuery]);

  const performSearch = useCallback(async (query: string) => {
    try {
      const queryString = `query=${encodeURIComponent(query)}`;
      const url = `/data/filter/search/?${queryString}`;

      const { data } = await api.get<IDataset[]>(url);

      if (data && Array.isArray(data)) {
        onSearchResults(data);
      } else {
        onSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const resetFilters = () => {
    setFilters({ accessLevel: [], dataType: [], region: [], timeframe: [] });
    setSearchQuery('');
    setSortOption('Most Recent');
    resetSearch();
  };

  const totalActiveFilters = useMemo(() => {
    const filtCount = Object.values(filters).reduce(
      (total, filterArray) => total + filterArray.length,
      0,
    );
    const searchCount = searchQuery ? 1 : 0;
    return filtCount + searchCount;
  }, [filters, searchQuery]);

  return (
    <div className="w-full  px-4 py-4">
      {/* Search Bar */}
      <DatasetToolBarSearchAndSortBar
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange}
        sortOption={sortOption}
        setSortOption={setSortOption}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
      />
      {/* Filters Row - Horizontally Scrollable on Mobile */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          <DatasetToolbarFilterDropdown
            label="Select Access"
            options={Object.values(datasetFilterOptions.accessLevel)}
            selectedOptions={filters.accessLevel}
            category={'accessLevel'}
            setFilters={setFilters}
          />
          <DatasetToolbarFilterDropdown
            label="Select Data Type"
            options={Object.values(datasetFilterOptions.dataType)}
            selectedOptions={filters.dataType}
            category={'dataType'}
            setFilters={setFilters}
          />
          <DatasetToolbarFilterDropdown
            label="Select Region"
            options={Object.values(datasetFilterOptions.region)}
            selectedOptions={filters.region}
            category={'region'}
            setFilters={setFilters}
          />
          <DatasetToolbarFilterDropdown
            label="Select Timeframe"
            options={Object.values(datasetFilterOptions.timeframe)}
            selectedOptions={filters.timeframe}
            category={'timeframe'}
            setFilters={setFilters}
          />
          {/* <DatasetToolbarFilterDropdown
            label="License Types"
            options={Object.values(datasetFilterOptions.license)}
            selectedOptions={filters.license}
            category={'license'}
            setFilters={setFilters}
          /> */}
          <DatasetToolbarFilterDropdown
            label="Select Timeframe"
            options={Object.values(datasetFilterOptions.timeframe)}
            selectedOptions={filters.timeframe}
            category={'timeframe'}
            setFilters={setFilters}
          />

          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={resetFilters}
            disabled={totalActiveFilters === 0}
          >
            <X className="h-4 w-4" />
            Reset filters
            {totalActiveFilters > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                {totalActiveFilters}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
type DatasetToolBarSearchAndSortBarProps = {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortOption: DatasetSortOptions;
  setSortOption: React.Dispatch<React.SetStateAction<DatasetSortOptions>>;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
};
function DatasetToolBarSearchAndSortBar({
  searchQuery,
  handleSearchChange,
  sortOption,
  setSortOption,
  isSearching,
}: DatasetToolBarSearchAndSortBarProps) {
  const sortOptions: DatasetSortOptions[] = ['Most Recent', 'Popular'];
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center">
      <div className="relative flex-1 w-full">
        <Search
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            isSearching ? 'text-primary animate-pulse' : 'text-muted-foreground'
          }`}
        />
        <input
          type="text"
          placeholder="Search datasets"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-subtle rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm">Sort by:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1 border-subtle"
            >
              {sortOption}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-subtle">
            <div className="p-2">
              {sortOptions.map((opt) => (
                <div
                  key={opt}
                  className="cursor-pointer py-1.5 px-2 rounded hover:bg-muted flex items-center gap-2"
                  onClick={() => setSortOption(opt)}
                >
                  <span>{opt}</span>{' '}
                  <CheckIcon
                    className={`h-4 w-4 ml-2 ${
                      sortOption === opt ? 'text-primary' : 'hidden'
                    }`}
                  />
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function DatasetToolbarFilterDropdown({
  label,
  options,
  selectedOptions,
  category,
  setFilters,
}: {
  label: string;
  options: string[];
  selectedOptions: string[];
  setFilters: React.Dispatch<React.SetStateAction<DatasetFilterOptions>>;
  category: keyof DatasetFilterOptions;
}) {
  const handleFilterChange = (value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value],
    }));
  };
  const totalSelected = useMemo(
    () => (Array.isArray(selectedOptions) ? selectedOptions.length : 0),
    [selectedOptions],
  );
  const selectableOptions = useMemo(
    () => (Array.isArray(options) ? options : []),
    [options, selectedOptions],
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1 border-subtle"
        >
          {label}
          {totalSelected > 0 && (
            <span className="ml-1 text-xs bg-primary text-subtle rounded-full w-5 h-5 flex items-center justify-center">
              {totalSelected}
            </span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 min-w-[240px] bg-white border-subtle">
        <div className="text-sm font-medium border-b border-subtle pb-2 mb-2">
          {label}
        </div>
        {selectableOptions.map((option) => (
          <div key={option} className="flex items-center space-x-2 py-1.5">
            <Checkbox
              id={`${label}-${option}`}
              checked={selectedOptions.includes(option)}
              onCheckedChange={() => handleFilterChange(option)}
              className="border-gray-400 rounded"
            />
            <Label
              htmlFor={`${label}-${option}`}
              className="text-sm cursor-pointer flex-1"
            >
              {option}
            </Label>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
