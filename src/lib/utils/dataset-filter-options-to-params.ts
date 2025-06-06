import type { DatasetFilterOptions } from '../types/data-set';

/**
 * Converts DatasetFilterOptions to URLSearchParams
 * @param filters The filter options to convert
 * @returns URLSearchParams object ready for use in URLs
 */
export function datasetFiltersToSearchParams(
  filters: DatasetFilterOptions,
): URLSearchParams {
  const queryKeys: Record<string, string> = {
    accessLevel: 'access_level',
    dataType: 'datatype',
    region: 'region',
    timeframe: 'timeframe',
  };
  const params = new URLSearchParams();

  // Process each filter category
  for (const [key, values] of Object.entries(filters)) {
    // Skip if no values are selected
    if (!values || values.length === 0) continue;

    // Handle array values by adding multiple params
    for (const value of values) {
      params.append(queryKeys[key], value);
    }
  }

  return params;
}
