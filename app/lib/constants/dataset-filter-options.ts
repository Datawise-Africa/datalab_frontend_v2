export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterFacet {
  key: string;
  label: string;
  options: FilterOption[];
  /** Backend supports only one value at a time — UI enforces single-select. */
  single?: boolean;
  /** Dynamic facet still fetching — render skeleton instead of empty list. */
  loading?: boolean;
}

export const staticDatasetFilterFacets: FilterFacet[] = [
  {
    key: 'pricing',
    label: 'Pricing',
    options: [
      { label: 'Free', value: 'free' },
      { label: 'Premium', value: 'premium' },
    ],
    single: true,
  },
  {
    key: 'timeframe',
    label: 'Timeframe',
    options: [
      { label: 'Last Year', value: '1y' },
      { label: 'Last 5 Years', value: '5y' },
      { label: '5+ Years', value: '5y+' },
    ],
    single: true,
  },
];

export const datasetSortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Highest Rated', value: 'highest_rated' },
  { label: 'Most Downloaded', value: 'most_downloaded' },
  { label: 'Most Viewed', value: 'most_viewed' },
  { label: 'Name A-Z', value: 'a_z' },
  { label: 'Name Z-A', value: 'z_a' },
] as const;

export const DEFAULT_DATASET_SORT = 'newest';
