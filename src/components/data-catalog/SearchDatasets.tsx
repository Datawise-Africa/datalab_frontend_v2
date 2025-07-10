import { useCallback, useEffect, useState } from 'react';
// import apiService from '../../services/apiService';
import type { IDataset } from '@/lib/types/data-set';
import { cn } from '@/lib/utils';
import useApi from '@/hooks/use-api';

type SearchDatasetsProps = {
  className?: string;
  onSearchResults: (results: IDataset[]) => void;
  onSearchReset: () => void;
};

const SearchDatasets = ({
  className,
  onSearchResults,
  onSearchReset,
}: SearchDatasetsProps) => {
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { api } = useApi();
  const fetchResults = async () => {
    if (!searchText.trim()) {
      setError(null);
      onSearchReset(); // Reset search results
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const queryString = `query=${encodeURIComponent(searchText)}`;
      const url = `/data/filter/search/?${queryString}`;

      const response = await api.get(url);

      if (response.data && Array.isArray(response.data)) {
        onSearchResults(response.data);
      } else {
        onSearchResults([]);
      }
    } catch (err) {
      console.error('Error fetching datasets:', err);
      // onSearchResults('Failed to fetch datasets. Please try again.');
      onSearchReset();
    } finally {
      setIsLoading(false);
    }
  };

  // const handleKeyPress = (event: React.KeyboardEvent) => {
  //   if (event.key === 'Enter') {
  //     fetchResults();
  //   }
  // };
  const watchInput = useCallback(() => {
    if (searchText.trim() === '') {
      setError(null);
      onSearchReset(); // Reset search results
    }
  }, [searchText, onSearchReset]);

  useEffect(() => {
    watchInput();
  }, [watchInput]);

  return (
    <div
      className={cn(
        `bg-n-7 flex flex-col rounded border border-[#E5E7EB] p-2`,
        className,
      )}
    >
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow rounded-full p-2"
          placeholder="Search datasets..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          // onKeyPress={(e) => e.key === 'Enter' && fetchResults()}
        />
        <button className="ml-2" aria-label="Search" onClick={fetchResults}>
          <svg
            className="h-6 w-6 text-[black]"
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
        </button>
      </div>
      {isLoading && <div className="ml-2 text-gray-500">Loading...</div>}
      {error && <div className="mt-2 text-red-500">{error}</div>}
    </div>
  );
};

export default SearchDatasets;
