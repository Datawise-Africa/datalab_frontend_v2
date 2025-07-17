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
import type { PaginatedResponse } from '@/constants/pagination';
import {
  useDatasetFilterManager,
  useDatasetSearchManager,
  useDatasetSortManager,
} from '@/store/use-dataset-controls';
import { useAxios } from '@/hooks/use-axios';

export default function DatasetFilterToolbar() {
  const axiosClient = useAxios();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const { filters, resetFilters } = useDatasetFilterManager();
  const { handleSearch, searchQuery, clearSearch, setIsSearchLoading } =
    useDatasetSearchManager();
  const { setSort } = useDatasetSortManager();

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
      setIsSearchLoading(true);
    }

    if (debouncedSearchQuery) {
      performSearch(debouncedSearchQuery);
    } else {
      // setIsSearching(false);
      handleSearch([], ''); // Clear search results if query is empty
    }
  }, [debouncedSearchQuery]);

  const performSearch = useCallback(async (query: string) => {
    try {
      const queryString = `query=${encodeURIComponent(query)}`;
      const url = `/data/search/?${queryString}`;

      const {
        data: { data },
      } = await axiosClient.get<PaginatedResponse<IDataset>>(url);

      if (data && Array.isArray(data)) {
        handleSearch(data, query);
      } else {
        handleSearch([], query);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      // setIsSearching(false);
      setIsSearchLoading(false);
    }
  }, []);

  const clearAllFilters = () => {
    // setFilters({ accessLevel: [], dataType: [], region: [], timeframe: [] });
    resetFilters();
    setSort('Most Recent');
    clearSearch();
    setDebouncedSearchQuery('');
  };

  const totalActiveFilters = useMemo(() => {
    const filtCount = Object.values(filters).reduce(
      (total, filterArray) => total + filterArray.length,
      0,
    );
    const searchCount = searchQuery ? 1 : 0;
    return filtCount + searchCount;
  }, [filters, searchQuery]);
  // const extractOptions = () => {
  //   const objs = Object.values(datasetFilterOptions.accessLevel);
  // };
  return (
    <div className="w-full px-4 py-4">
      {/* Search Bar */}
      <DatasetToolBarSearchAndSortBar />
      {/* Filters Row - Horizontally Scrollable on Mobile */}
      <div className="-mx-4 overflow-x-auto px-4 pb-2">
        <div className="flex min-w-max gap-2">
          <DatasetToolbarFilterDropdown
            label="Select Access"
            options={Object.values(datasetFilterOptions.accessLevel)}
            selectedOptions={filters.accessLevel}
            category={'accessLevel'}
          />
          <DatasetToolbarFilterDropdown
            label="Select Data Type"
            options={Object.values(datasetFilterOptions.dataType)}
            selectedOptions={filters.dataType}
            category={'dataType'}
          />
          <DatasetToolbarFilterDropdown
            label="Select Region"
            options={Object.values(datasetFilterOptions.region).map(
              (region) => ({
                label: region,
                value: region,
              }),
            )}
            selectedOptions={filters.region}
            category={'region'}
          />
          <DatasetToolbarFilterDropdown
            label="Select Timeframe"
            options={Object.values(datasetFilterOptions.timeframe).map(
              (timeframe) => ({
                label: timeframe,
                value: timeframe,
              }),
            )}
            selectedOptions={filters.timeframe}
            category={'timeframe'}
          />
          {/* <DatasetToolbarFilterDropdown
            label="License Types"
            options={Object.values(datasetFilterOptions.license)}
            selectedOptions={filters.license}
            category={'license'}
            setFilters={setFilters}
          /> */}
          {/* <DatasetToolbarFilterDropdown
            label="Select Timeframe"
            options={Object.values(datasetFilterOptions.timeframe)}
            selectedOptions={filters.timeframe}
            category={'timeframe'}
            setFilters={setFilters}
          /> */}

          <Button
            variant="ghost"
            className="flex items-center gap-1"
            onClick={clearAllFilters}
            disabled={totalActiveFilters === 0}
          >
            <X className="h-4 w-4" />
            Reset filters
            {totalActiveFilters > 0 && (
              <span className="bg-primary text-primary-foreground ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                {totalActiveFilters}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function DatasetToolBarSearchAndSortBar() {
  // const sortOptions: DatasetSortOptions[] = ['Most Recent', 'Popular'];
  const { sortOptions, sort, setSort } = useDatasetSortManager();
  const { setSearchQuery, searchQuery, isSearchLoading } =
    useDatasetSearchManager();
  return (
    <div className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="relative w-full flex-1">
        <Search
          className={`absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform ${
            isSearchLoading
              ? 'text-primary animate-pulse'
              : 'text-muted-foreground'
          }`}
        />
        <input
          type="text"
          placeholder="Search datasets"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-subtle focus:ring-primary/50 w-full rounded-md border py-2 pr-4 pl-10 focus:ring-2 focus:outline-none"
        />
        {isSearchLoading && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
            <div className="border-primary h-4 w-4 animate-spin rounded-full border-b-2"></div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-sm">Sort by:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-subtle flex items-center gap-1"
            >
              {sort}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-subtle bg-white">
            <div className="p-2">
              {sortOptions.map((opt) => (
                <div
                  key={opt}
                  className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-2 py-1.5"
                  onClick={() => setSort(opt)}
                >
                  <span>{opt}</span>{' '}
                  <CheckIcon
                    className={`ml-2 h-4 w-4 ${
                      sort === opt ? 'text-primary' : 'hidden'
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
}: {
  label: string;
  options: { label: string; value: string }[];
  selectedOptions: string[];
  category: keyof DatasetFilterOptions;
}) {
  const { updateFilter, filters } = useDatasetFilterManager();
  const handleFilterChange = (value: string) => {
    const update = filters[category] || [];
    updateFilter(
      category,
      update.includes(value)
        ? update.filter((item) => item !== value)
        : [...update, value],
    );
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
          className="border-subtle flex items-center gap-1"
        >
          {label}
          {totalSelected > 0 && (
            <span className="bg-primary text-subtle ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
              {totalSelected}
            </span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-subtle min-w-[240px] bg-white p-2">
        <div className="border-subtle mb-2 border-b pb-2 text-sm font-medium">
          {label}
        </div>
        {selectableOptions.map((option) => (
          <Label
            key={option.value}
            htmlFor={option.value}
            className="text-subtle flex items-center space-x-2 py-1.5"
          >
            <Checkbox
              id={option.value}
              checked={selectedOptions.includes(option.value)}
              onCheckedChange={() => handleFilterChange(option.value)}
              className="rounded border-gray-400"
            />
            <span className="text-primary flex-1 cursor-pointer text-sm">
              {option.label}
            </span>
          </Label>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
