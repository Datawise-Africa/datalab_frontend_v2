'use client';

import type React from 'react';
import { useState } from 'react';
import apiService from '../../services/apiService';
import type { IDataset } from '@/lib/types/data-set';
import { cn } from '@/lib/utils/cn';

type SearchDatasetsProps = {
  className?: string;
  onSearchResults: (results: IDataset[]) => void;
  onSearchReset: (results: IDataset[]) => void;
};

export default function SearchDatasets({
  className,
  onSearchResults,
  onSearchReset,
}: SearchDatasetsProps) {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      setError(null);
      onSearchReset([]); // Reset search results
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryString = `query=${encodeURIComponent(searchText)}`;
      const url = `/data/filter/search/?${queryString}`;

      const response = await apiService.get(url);

      if (response && Array.isArray(response)) {
        onSearchResults(response);
      } else {
        onSearchResults([]);
      }
    } catch (err) {
      console.error('Error fetching datasets:', err);
      setError('Failed to fetch datasets. Please try again.');
      onSearchReset([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className={cn(`w-full`, className)}>
      <div className="relative rounded-lg shadow-md border border-gray-200 bg-white transition-all duration-200 hover:shadow-lg focus-within:border-gray-300 focus-within:ring-1 focus-within:ring-gray-300">
        <div className="flex items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full rounded-lg border-0 py-3 pl-11 pr-24 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
            placeholder="Search datasets..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search datasets"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="rounded-md bg-gray-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Searching</span>
                </div>
              ) : (
                'Search'
              )}
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <svg
            className="h-4 w-4 animate-spin text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Searching datasets...</span>
        </div>
      )}

      {error && (
        <div className="mt-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
