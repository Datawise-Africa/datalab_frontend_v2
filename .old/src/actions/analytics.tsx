// Define the type for a single dataset row
export type Dataset = {
  datasetName: string;
  industry: string;
  downloads: number;
  views: number;
  rating: number;
  submitted: string;
};

// Mock data for the backend
const allDatasets: Dataset[] = [
  {
    datasetName: 'Customer Behavior Dataset',
    industry: 'Marketing',
    downloads: 2340,
    views: 5670,
    rating: 4.8,
    submitted: 'May 1, 2023',
  },
  {
    datasetName: 'Social Media Analytics',
    industry: 'Technology',
    downloads: 1890,
    views: 4320,
    rating: 4.6,
    submitted: 'May 1, 2023',
  },
  {
    datasetName: 'E-Commerce Transactions',
    industry: 'Retail',
    downloads: 1650,
    views: 3890,
    rating: 4.5,
    submitted: 'May 1, 2023',
  },
  {
    datasetName: 'Climate Change Data',
    industry: 'Environment',
    downloads: 1420,
    views: 3440,
    rating: 4.7,
    submitted: 'Apr 20, 2023',
  },
  {
    datasetName: 'Healthcare Records',
    industry: 'Healthcare',
    downloads: 1250,
    views: 2900,
    rating: 4.3,
    submitted: 'May 1, 2023',
  },
  {
    datasetName: 'Financial Market Trends',
    industry: 'Finance',
    downloads: 1100,
    views: 2500,
    rating: 4.2,
    submitted: 'Jun 10, 2023',
  },
  {
    datasetName: 'Education Demographics',
    industry: 'Education',
    downloads: 980,
    views: 2100,
    rating: 4.0,
    submitted: 'Jul 5, 2023',
  },
  {
    datasetName: 'Sports Performance Data',
    industry: 'Sports',
    downloads: 850,
    views: 1900,
    rating: 4.1,
    submitted: 'Aug 1, 2023',
  },
  {
    datasetName: 'Real Estate Prices',
    industry: 'Real Estate',
    downloads: 720,
    views: 1700,
    rating: 3.9,
    submitted: 'Sep 15, 2023',
  },
  {
    datasetName: 'Travel & Tourism Statistics',
    industry: 'Tourism',
    downloads: 600,
    views: 1500,
    rating: 3.8,
    submitted: 'Oct 1, 2023',
  },
  {
    datasetName: 'Energy Consumption Data',
    industry: 'Energy',
    downloads: 550,
    views: 1400,
    rating: 3.7,
    submitted: 'Nov 1, 2023',
  },
  {
    datasetName: 'Food Production Statistics',
    industry: 'Agriculture',
    downloads: 500,
    views: 1300,
    rating: 3.6,
    submitted: 'Dec 1, 2023',
  },
];

interface FetchDatasetsResponse {
  data: Dataset[];
  pageCount: number;
  totalCount: number;
}

export async function fetchDatasets(
  pageIndex: number,
  pageSize: number,
  globalFilter = '',
  sortBy: keyof Dataset = 'datasetName', // New parameter for sorting column
  sortDirection: 'asc' | 'desc' = 'asc', // New parameter for sort direction
): Promise<FetchDatasetsResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredData = allDatasets;

  // Apply global filter if provided
  if (globalFilter) {
    const lowerCaseFilter = globalFilter.toLowerCase();
    filteredData = allDatasets.filter((dataset) =>
      Object.values(dataset).some((value) =>
        String(value).toLowerCase().includes(lowerCaseFilter),
      ),
    );
  }

  // Apply sorting
  filteredData.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    // Fallback for other types or if values are not comparable
    return 0;
  });

  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const paginatedData = filteredData.slice(start, end);
  const totalCount = filteredData.length;
  const pageCount = Math.ceil(totalCount / pageSize);

  return {
    data: paginatedData,
    pageCount,
    totalCount,
  };
}
