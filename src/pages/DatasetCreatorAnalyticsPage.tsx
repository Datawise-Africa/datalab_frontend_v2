import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  ArrowDown,
  ArrowUp,
  Search,
  ArrowUpDown,
  FileText,
  Database,
} from 'lucide-react'; // Import ArrowUpDown

import { Button } from '@/components/ui/button';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  type SortingState, // Import SortingState
  getSortedRowModel, // Import getSortedRowModel
} from '@tanstack/react-table';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDatasets, type Dataset } from '@/actions/analytics';
import { Loader2 } from 'lucide-react';
import {
  useDatasetCreatorAnalyticsQuery,
  type DatasetCreatorOverviewAnalyticsType,
} from '@/api/dataset-creator-analytics/query';
import { useMultipleDatasetStatuses } from '@/hooks/use-dataset-creator-datasets';
import {
  useDatasetAnalyticsData,
  useDatasetCreatorAnalyticsFilters,
  type DatasetCreateorAnalyticsFilter,
} from '@/store/dataset-creator-analytics-store';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import moment from 'moment';

// const geographicData = [
//   { label: 'Africa', value: 1200 },
//   { label: 'North America', value: 950 },
//   { label: 'Europe', value: 820 },
//   { label: 'Asia', value: 570 },
//   { label: 'Asia-Pacific', value: 350 },
// ];

// const userCategoriesData = [
//   { label: 'Students', value: 40 },
//   { label: 'Non-Profit', value: 25 },
//   { label: 'Public Sector', value: 20 },
//   { label: 'Companies', value: 15 },
// ];

// const mapDataPoints = [
//   { lat: 0.0, lon: 25.0, value: 100, label: 'Africa Data Hub' }, // Central Africa
//   { lat: 39.8, lon: -98.6, value: 80, label: 'North America Data Hub' }, // Central US
//   { lat: 54.5, lon: -3.4, value: 60, label: 'Europe Data Hub' }, // UK
//   { lat: 34.0, lon: 108.0, value: 40, label: 'Asia Data Hub' }, // China
//   { lat: -25.27, lon: 133.77, value: 30, label: 'Australia Data Hub' }, // Australia
//   { lat: -14.23, lon: -51.92, value: 70, label: 'South America Data Hub' }, // Brazil
//   { lat: 20.59, lon: 78.96, value: 90, label: 'India Data Hub' }, // India
//   { lat: 61.52, lon: 105.31, value: 20, label: 'Russia Data Hub' }, // Russia
// ];

const columns: ColumnDef<
  DatasetCreatorOverviewAnalyticsType['top_performing_datasets'][number]
>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0 hover:bg-transparent"
        >
          Dataset Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0 hover:bg-transparent"
        >
          Industry
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'download_count',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0 hover:bg-transparent"
        >
          Downloads
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'views_count',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0 hover:bg-transparent"
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'average_rating',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0 hover:bg-transparent"
        >
          Rating
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0 hover:bg-transparent"
        >
          Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info) => moment(info.getValue()!).format('LL'),
    enableSorting: true,
  },
];

export default function AnalyticsPage() {
  const { datasetOverviewQuery, ds, selectedDatasetQuery } =
    useDatasetCreatorAnalyticsQuery();
  const { dateRangeOptions, setFilters } = useDatasetCreatorAnalyticsFilters();
  const { queries } = useMultipleDatasetStatuses(
    ['PB'],
    {},
    { limit: 10, page: 1 },
  );
  const published = queries.PB;
  // const { selectedDatasetId } = useSelectedDatasetId();
  const [, setData] = useState<Dataset[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]); // State for sorting

  const fetchTableData = useCallback(
    async (
      pageIndex: number,
      pageSize: number,
      filter: string,
      currentSorting: SortingState,
    ) => {
      setLoading(true);
      try {
        const sortBy =
          currentSorting.length > 0
            ? (currentSorting[0].id as keyof Dataset)
            : 'datasetName';
        const sortDirection =
          currentSorting.length > 0
            ? currentSorting[0].desc
              ? 'desc'
              : 'asc'
            : 'asc';

        const response = await fetchDatasets(
          pageIndex,
          pageSize,
          filter,
          sortBy,
          sortDirection,
        );
        setData(response.data);
        setPageCount(response.pageCount);
      } catch (error) {
        console.error('Failed to fetch datasets:', error);
        // Handle error, e.g., show a toast
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const table = useReactTable({
    data: datasetOverviewQuery.data?.top_performing_datasets || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable client-side sorting for TanStack Table internal state (though we're doing server-side)
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true, // Enable manual sorting
    pageCount: pageCount,
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
      globalFilter: globalFilter,
      sorting: sorting, // Connect sorting state
    },
    onPaginationChange: (updater) => {
      const newPaginationState =
        typeof updater === 'function'
          ? updater(table.getState().pagination)
          : updater;
      table.setPagination(newPaginationState);
      fetchTableData(
        newPaginationState.pageIndex,
        newPaginationState.pageSize,
        globalFilter,
        sorting,
      );
    },
    onGlobalFilterChange: (updater) => {
      const newFilter =
        typeof updater === 'function' ? updater(globalFilter) : updater;
      setGlobalFilter(newFilter);
      table.setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on filter change
      fetchTableData(
        0,
        table.getState().pagination.pageSize,
        newFilter,
        sorting,
      );
    },
    onSortingChange: (updater) => {
      const newSortingState =
        typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(newSortingState);
      table.setPagination((prev) => ({ ...prev, pageIndex: 0 })); // Reset to first page on sort change
      fetchTableData(
        0,
        table.getState().pagination.pageSize,
        globalFilter,
        newSortingState,
      );
    },
  });

  // Initial data fetch on component mount or when globalFilter/sorting changes
  useEffect(() => {
    fetchTableData(
      table.getState().pagination.pageIndex,
      table.getState().pagination.pageSize,
      globalFilter,
      sorting,
    );
  }, [fetchTableData, globalFilter, sorting]); // Add sorting to dependencies

  const { getViewsChartsData, getDownloadsChartsData, setAnalyticsData } =
    useDatasetAnalyticsData();
  const watchSelectedDataset = useCallback(() => {
    if (selectedDatasetQuery.data) {
      setAnalyticsData(selectedDatasetQuery.data);
    }
  }, [selectedDatasetQuery.data]);
  useEffect(() => {
    if (ds.selectedDatasetId) {
      watchSelectedDataset();
    }
  }, [ds.selectedDatasetId, watchSelectedDataset]);

  // const { xDataKey, yDataKey, chartData } = getAreaChartData();
  const viewsChartData = getViewsChartsData();
  const downloadsChartData = getDownloadsChartsData();
  const singleDatasetAnalytics = useMemo(() => {
    if (!selectedDatasetQuery.data) return null;
    const {
      average_rating,
      comments_growth,
      views_growth,
      downloads_growth,
      total_comments,
      ratings_growth,
      views,
      downloads,
      review_count,
    } = selectedDatasetQuery.data;
    return {
      average_rating,
      comments_growth,
      views_growth,
      downloads_growth,
      total_comments,
      ratings_growth,
      views,
      downloads,
      review_count,
    };
  }, [selectedDatasetQuery.data]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <div className="grid gap-8">
      <div className="grid gap-2">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Track performance and engagement across all your datasets.
        </p>
      </div>

      {/* Overview Section */}
      <Card className="border-primary/20 border-none bg-white shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Overview</CardTitle>
          <Select defaultValue="all-time">
            <SelectTrigger className="w-[120px] border border-gray-200">
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent className="border border-gray-200">
              <SelectItem value="all-time" className="hover:bg-primary/20">
                All Time
              </SelectItem>
              <SelectItem value="last-year" className="hover:bg-primary/20">
                Last Year
              </SelectItem>
              <SelectItem value="last-month" className="hover:bg-primary/20">
                Last Month
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Views */}
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">
              {datasetOverviewQuery.data?.total_views}
            </div>
            <div className="text-sm text-gray-500">Total views</div>
            <div className="flex items-center text-sm">
              {datasetOverviewQuery.data?.views_growth! > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  datasetOverviewQuery.data?.views_growth! > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {datasetOverviewQuery.data?.views_growth ?? 0}%
              </span>
              <span className="ml-1 text-gray-500">vs last 30 days</span>
            </div>
          </div>
          {/* Downloads */}
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">
              {datasetOverviewQuery.data?.total_downloads}
            </div>
            <div className="text-sm text-gray-500">Total Downloads</div>
            <div className="flex items-center text-sm">
              {(datasetOverviewQuery.data?.downloads_growth || 0) > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  (datasetOverviewQuery.data?.downloads_growth || 0) > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {datasetOverviewQuery.data?.downloads_growth || 0}%
              </span>
              <span className="ml-1 text-gray-500">vs last 30 days</span>
            </div>
          </div>
          {/* Rating */}
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">
              {datasetOverviewQuery.data?.average_rating}
            </div>
            <div className="text-sm text-gray-500">Average Rating</div>
            <div className="flex items-center text-sm">
              {datasetOverviewQuery.data?.ratings_growth! > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  datasetOverviewQuery.data?.ratings_growth! > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {datasetOverviewQuery.data?.ratings_growth ?? 0}%
              </span>
              <span className="ml-1 text-gray-500">vs last 30 days</span>
            </div>
          </div>
          {/* Total datasets */}
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">
              {datasetOverviewQuery.data?.total_datasets}
            </div>
            <div className="text-sm text-gray-500">Total Datasets</div>
            <div className="flex items-center text-sm">
              {datasetOverviewQuery.data?.new_datasets_growth! > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  datasetOverviewQuery.data?.new_datasets_growth! > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {datasetOverviewQuery.data?.new_datasets_growth ?? 0}%
              </span>
              <span className="ml-1 text-gray-500">vs last 30 days</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual dataset */}
      {!ds.selectedDatasetId ? (
        <div className="mx-auto w-full max-w-4xl p-6">
          {published.data.length <= 0 ? (
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="flex h-64 flex-col items-center justify-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Database className="h-8 w-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    No datasets available
                  </h3>
                  <p className="max-w-sm text-sm text-gray-500">
                    Please publish a dataset to view insights and start
                    analyzing your data.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="flex h-64 flex-col items-center justify-center space-y-6 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    Select a Dataset
                  </h3>
                  <p className="max-w-sm text-sm text-gray-500">
                    Choose a dataset from your published collection to view
                    detailed insights and analytics.
                  </p>
                </div>

                <div className="w-full max-w-md space-y-2">
                  <Select
                    value={ds.selectedDatasetId || ''}
                    onValueChange={ds.setSelectedDatasetId}
                  >
                    <SelectTrigger className="h-12 w-full border-gray-200 transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Choose a dataset..." />
                      </div>
                      {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
                    </SelectTrigger>
                    <SelectContent className="border border-gray-200 bg-white shadow-lg">
                      <SelectItem
                        value={null!}
                        className="text-gray-500 hover:bg-gray-50"
                        disabled
                      >
                        Please select a dataset
                      </SelectItem>
                      {published.data.map((dataset) => (
                        <SelectItem
                          value={dataset.id}
                          key={dataset.id}
                          className="cursor-pointer py-3 hover:bg-blue-50 focus:bg-blue-50"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{dataset.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-xs text-gray-400">
                    {published.data.length} dataset
                    {published.data.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <>
          {/* Individual Dataset Insights */}
          <Card className="border-primary/20 border-none bg-white shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">
                Individual Dataset Insights
              </CardTitle>
              <Select
                value={ds.selectedDatasetId || ''}
                onValueChange={ds.setSelectedDatasetId}
              >
                <SelectTrigger className="h-12 w-fit border-gray-200 transition-all hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Choose a dataset..." />
                  </div>
                  {/* <ChevronDown className="w-4 h-4 text-gray-400" /> */}
                </SelectTrigger>
                <SelectContent className="border border-gray-200 bg-white shadow-lg">
                  <SelectItem
                    value={null!}
                    className="text-gray-500 hover:bg-gray-50"
                    disabled
                  >
                    Please select a dataset
                  </SelectItem>
                  {published.data.map((dataset) => (
                    <SelectItem
                      value={dataset.id}
                      key={dataset.id}
                      className="cursor-pointer py-3 hover:bg-blue-50 focus:bg-blue-50"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{dataset.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
                  <div className="text-2xl font-bold">
                    {singleDatasetAnalytics?.views || 0}
                  </div>
                  <div className="text-sm text-gray-500">Views</div>
                  <div className="flex items-center text-sm">
                    {(singleDatasetAnalytics?.views_growth || 0) > 0 ? (
                      <>
                        <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">
                          +{singleDatasetAnalytics?.views_growth || 0}%
                        </span>
                        <span className="ml-1 text-gray-500">
                          vs last 30 days
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-red-500">
                          -{singleDatasetAnalytics?.views_growth || 0}%
                        </span>
                        <span className="ml-1 text-gray-500">
                          vs last 30 days
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
                  <div className="text-2xl font-bold">
                    {singleDatasetAnalytics?.downloads || 0}
                  </div>
                  <div className="text-sm text-gray-500">Downloads</div>
                  <div className="flex items-center text-sm">
                    {(singleDatasetAnalytics?.downloads_growth || 0) < 0 ? (
                      <>
                        <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-red-500">
                          -{singleDatasetAnalytics?.downloads_growth || 0}%
                        </span>
                        <span className="ml-1 text-gray-500">
                          vs last 30 days
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">
                          +{singleDatasetAnalytics?.downloads_growth || 0}%
                        </span>
                        <span className="ml-1 text-gray-500">
                          vs last 30 days
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
                  <div className="text-2xl font-bold">
                    {singleDatasetAnalytics?.average_rating || 0}
                  </div>
                  <div className="text-sm text-gray-500">Avg Rating</div>
                  <div className="flex items-center text-sm">
                    {(singleDatasetAnalytics?.ratings_growth || 0) < 0 ? (
                      <>
                        <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-red-500">
                          -{singleDatasetAnalytics?.ratings_growth || 0}%
                        </span>
                        <span className="ml-1 text-gray-500">
                          vs last 30 days
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">
                          +{singleDatasetAnalytics?.ratings_growth || 0}%
                        </span>
                        <span className="ml-1 text-gray-500">
                          vs last 30 days
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
                  <div className="text-2xl font-bold">
                    {singleDatasetAnalytics?.review_count || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Reviews</div>
                  {/* <div className="flex items-center text-sm">
                    <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="text-green-500">-{singleDatasetAnalytics?.rev || 0}%</span>
                    <span className="ml-1 text-gray-500">vs last 30 days</span>
                  </div> */}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border border-gray-200 bg-white p-4 shadow">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Views</h3>
                    <Select
                      defaultValue="1m"
                      onValueChange={(value) =>
                        setFilters({
                          range:
                            value as DatasetCreateorAnalyticsFilter['range'],
                        })
                      }
                    >
                      <SelectTrigger className="h-8 w-48 border border-gray-200 text-sm">
                        <SelectValue placeholder="Last Month" />
                      </SelectTrigger>
                      <SelectContent className="border border-gray-200 bg-white">
                        {dateRangeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="hover:bg-primary/20"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        width={500}
                        height={400}
                        data={viewsChartData.chartData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={viewsChartData.xDataKey} />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey={viewsChartData.yDataKey}
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="border border-gray-200 bg-white p-4 shadow">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">Downloads</h3>
                    <Select
                      defaultValue="1m"
                      onValueChange={(value) =>
                        setFilters({
                          range:
                            value as DatasetCreateorAnalyticsFilter['range'],
                        })
                      }
                    >
                      <SelectTrigger className="h-8 w-48 border border-gray-200 text-sm">
                        <SelectValue placeholder="Last Month" />
                      </SelectTrigger>
                      <SelectContent className="border border-gray-200 bg-white">
                        {dateRangeOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="hover:bg-primary/20"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        width={500}
                        height={400}
                        data={downloadsChartData.chartData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={downloadsChartData.xDataKey} />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey={downloadsChartData.yDataKey}
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution & User Categories */}
          <div className="grid gap-6 lg:grid-cols-1">
            {/* <Card className="border-primary/20 border-none bg-white shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  Geographic Distribution
                </CardTitle>
                <Select defaultValue="all-time">
                  <SelectTrigger className="w-[120px] border border-gray-200">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 bg-white">
                    <SelectItem
                      value="all-time"
                      className="hover:bg-primary/20"
                    >
                      All Time
                    </SelectItem>
                    <SelectItem
                      value="last-year"
                      className="hover:bg-primary/20"
                    >
                      Last Year
                    </SelectItem>
                    <SelectItem
                      value="last-month"
                      className="hover:bg-primary/20"
                    >
                      Last Month
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <BarChart data={geographicData} width={400} height={200} />
              </CardContent>
            </Card> */}
            <Card className="border-primary/20 border-none bg-white shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                  User Categories
                </CardTitle>
                {/* <Select defaultValue="all-time">
                  <SelectTrigger className="w-[120px] border border-gray-200">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 bg-white">
                    <SelectItem
                      value="all-time"
                      className="hover:bg-primary/20"
                    >
                      All Time
                    </SelectItem>
                    <SelectItem
                      value="last-year"
                      className="hover:bg-primary/20"
                    >
                      Last Year
                    </SelectItem>
                    <SelectItem
                      value="last-month"
                      className="hover:bg-primary/20"
                    >
                      Last Month
                    </SelectItem>
                  </SelectContent>
                </Select> */}
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div style={{ width: '100%', height: 400 }}>
                  {selectedDatasetQuery.data?.intended_use_distribution.reduce(
                    (acc, item) => acc + item.count,
                    0,
                  ) === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border-gray-100 bg-white p-6 text-center">
                      <div className="mb-4 text-gray-400">
                        {/* <!-- Heroicon outline/document-magnifying-glass (or any appropriate icon) --> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="mx-auto h-12 w-12"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                          />
                        </svg>
                      </div>
                      <h2 className="mb-1 text-lg font-medium text-gray-700">
                        No Download Insights Available
                      </h2>
                      <p className="text-gray-500">
                        We couldn't find any download data for the selected
                        dataset.
                      </p>

                      {/* <!-- Optional action button --> */}
                      <button
                        disabled
                        className="mt-4 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100"
                      >
                        Select another dataset to view insights
                      </button>
                    </div>
                  ) : (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={
                            (
                              selectedDatasetQuery.data
                                ?.intended_use_distribution || []
                            ).filter((entry) => entry.count > 0) || []
                          }
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="label"
                          label={({ name, percent }) =>
                            `${name}: ${percent.toFixed(0)}%`
                          }
                        >
                          {(
                            selectedDatasetQuery.data
                              ?.intended_use_distribution || []
                          ).map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, _name, props) => [
                            value,
                            `${props.payload.percent}%`,
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Map */}
          {/* <Card className="border-primary/20 border-none bg-white shadow">
            <CardHeader>
              <CardTitle>Dataset Geographic Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <WorldMap dataPoints={mapDataPoints} width={800} height={400} />
            </CardContent>
          </Card> */}
        </>
      )}

      {/* Top Performing Datasets */}
      <Card className="border-primary/20 border-none bg-white shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">
            Top Performing Datasets
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search datasets..."
                className="w-[200px] pl-9"
                value={globalFilter ?? ''}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
              />
            </div>
            <Select defaultValue="all-time">
              <SelectTrigger className="w-[120px] border border-gray-200">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="border border-gray-200 bg-white">
                <SelectItem value="all-time" className="hover:bg-primary/20">
                  All Time
                </SelectItem>
                <SelectItem value="last-year" className="hover:bg-primary/20">
                  Last Year
                </SelectItem>
                <SelectItem value="last-month" className="hover:bg-primary/20">
                  Last Month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-500" />
                      <p className="mt-2 text-gray-500">Loading data...</p>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || loading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || loading}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
