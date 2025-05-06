import { useState } from "react";
import PropTypes from 'prop-types';
import apiService from "../../services/apiService";

const SearchDatasets = ({ className, onSearchResults, onSearchReset }) => {
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

            const response = await apiService.get(url);

            if (response && Array.isArray(response)) {
                onSearchResults(response);
            } else {
                onSearchResults([]);
            }
        } catch (err) {
            console.error("Error fetching datasets:", err);
            onSearchResults("Failed to fetch datasets. Please try again.");
            onSearchReset([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`p-2 flex flex-col bg-n-7 rounded border border-2 border-[#E5E7EB]  ${className}`}>
            <div className="flex items-center">
                <input 
                    type="text" 
                    className="flex-grow rounded-full p-2 w-18xl" 
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>
            {isLoading && <div className="ml-2 text-gray-500">Loading...</div>}
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    );
};

SearchDatasets.propTypes = {
    className: PropTypes.string,
    onSearchResults: PropTypes.func.isRequired,
    onSearchReset: PropTypes.func.isRequired,
};

export default SearchDatasets;

