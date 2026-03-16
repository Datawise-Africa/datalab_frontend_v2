export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterFacet {
  key: string;
  label: string;
  options: FilterOption[];
}

export const datasetFilterFacets: FilterFacet[] = [
  {
    key: 'accessLevel',
    label: 'Access Level',
    options: [
      { label: 'Public', value: 'public' },
      { label: 'Non-Profit', value: 'non_profit' },
      { label: 'Commercial', value: 'commercial' },
      { label: 'Students', value: 'students' },
    ],
  },
  {
    key: 'dataType',
    label: 'Data Type',
    options: [
      { label: 'Education', value: 'Education' },
      { label: 'Healthcare', value: 'Healthcare' },
      { label: 'Agriculture', value: 'Agriculture' },
      { label: 'Environmental', value: 'Environmental' },
      { label: 'Finance', value: 'Finance' },
      { label: 'Demographics', value: 'Demographics' },
    ],
  },
  {
    key: 'region',
    label: 'Region',
    options: [
      { label: 'East Africa', value: 'east_africa' },
      { label: 'West Africa', value: 'west_africa' },
      { label: 'North Africa', value: 'north_africa' },
      { label: 'Southern Africa', value: 'southern_africa' },
      { label: 'Global', value: 'global' },
    ],
  },
  {
    key: 'timeframe',
    label: 'Timeframe',
    options: [
      { label: 'Last Year', value: 'last_year' },
      { label: 'Last 5 Years', value: 'last_5_years' },
      { label: '5+ Years', value: '5_plus_years' },
    ],
  },
];

export const datasetSortOptions = [
  { label: 'Most Recent', value: 'created_at' },
  { label: 'Popular', value: 'download_count' },
  { label: 'Name A-Z', value: 'name' },
] as const;
