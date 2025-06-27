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
import { ArrowDown, ArrowUp, Search, ArrowUpDown } from 'lucide-react'; // Import ArrowUpDown

import * as d3 from 'd3';
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
import { useState, useEffect, useCallback } from 'react';
import { fetchDatasets, type Dataset } from '@/actions/analytics';
import { Loader2 } from 'lucide-react';
import {
  BarChart,
  LineChart,
  PieChart,
  WorldMap,
} from '@/components/ui/charts';

// Mock Data for Charts
const overviewData = {
  views: { value: '23.2K', change: '+32%', direction: 'up' },
  downloads: { value: '74', change: '-42%', direction: 'down' },
  avgRating: { value: '4.3', change: '+0.0%', direction: 'neutral' },
  totalDatasets: { value: '12', change: '-', direction: 'neutral' },
};

const individualDatasetViewsData = [
  { date: 'Jan', value: 3000, value2: 2500 },
  { date: 'Feb', value: 4000, value2: 3000 },
  { date: 'Mar', value: 7000, value2: 5000 },
  { date: 'Apr', value: 9000, value2: 6000 },
  { date: 'May', value: 6000, value2: 4500 },
  { date: 'Jun', value: 5000, value2: 4000 },
  { date: 'Jul', value: 4500, value2: 3800 },
];

const individualDatasetDownloadsData = [
  { date: 'Jan', value: 10000 },
  { date: 'Feb', value: 12000 },
  { date: 'Mar', value: 15000 },
  { date: 'Apr', value: 18000 },
  { date: 'May', value: 22000 },
  { date: 'Jun', value: 25000 },
  { date: 'Jul', value: 28000 },
];

const geographicData = [
  { label: 'Africa', value: 1200 },
  { label: 'North America', value: 950 },
  { label: 'Europe', value: 820 },
  { label: 'Asia', value: 570 },
  { label: 'Asia-Pacific', value: 350 },
];

const userCategoriesData = [
  { label: 'Students', value: 40 },
  { label: 'Non-Profit', value: 25 },
  { label: 'Public Sector', value: 20 },
  { label: 'Companies', value: 15 },
];

const mapDataPoints = [
  { lat: 0.0, lon: 25.0, value: 100, label: 'Africa Data Hub' }, // Central Africa
  { lat: 39.8, lon: -98.6, value: 80, label: 'North America Data Hub' }, // Central US
  { lat: 54.5, lon: -3.4, value: 60, label: 'Europe Data Hub' }, // UK
  { lat: 34.0, lon: 108.0, value: 40, label: 'Asia Data Hub' }, // China
  { lat: -25.27, lon: 133.77, value: 30, label: 'Australia Data Hub' }, // Australia
  { lat: -14.23, lon: -51.92, value: 70, label: 'South America Data Hub' }, // Brazil
  { lat: 20.59, lon: 78.96, value: 90, label: 'India Data Hub' }, // India
  { lat: 61.52, lon: 105.31, value: 20, label: 'Russia Data Hub' }, // Russia
];

const columns: ColumnDef<Dataset>[] = [
  {
    accessorKey: 'datasetName',
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
    accessorKey: 'industry',
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
    accessorKey: 'downloads',
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
    accessorKey: 'views',
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
    accessorKey: 'rating',
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
    accessorKey: 'submitted',
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
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
];

export default function AnalyticsPage() {
  const [data, setData] = useState<Dataset[]>([]);
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
    data,
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
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">{overviewData.views.value}</div>
            <div className="text-sm text-gray-500">Views</div>
            <div className="flex items-center text-sm">
              {overviewData.views.direction === 'up' ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  overviewData.views.direction === 'up'
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {overviewData.views.change}
              </span>
              <span className="ml-1 text-gray-500">vs last 30 days</span>
            </div>
          </div>
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">
              {overviewData.downloads.value}
            </div>
            <div className="text-sm text-gray-500">Downloads</div>
            <div className="flex items-center text-sm">
              {overviewData.downloads.direction === 'up' ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  overviewData.downloads.direction === 'up'
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {overviewData.downloads.change}
              </span>
              <span className="ml-1 text-gray-500">vs last 30 days</span>
            </div>
          </div>
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">
              {overviewData.avgRating.value}
            </div>
            <div className="text-sm text-gray-500">Avg Rating</div>
            <div className="flex items-center text-sm">
              {overviewData.avgRating.direction === 'up' ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  overviewData.avgRating.direction === 'up'
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {overviewData.avgRating.change}
              </span>
              <span className="ml-1 text-gray-500">out of 5.0</span>
            </div>
          </div>
          <div className="grid gap-1 rounded-lg border border-gray-300 bg-white p-4 shadow">
            <div className="text-2xl font-bold">
              {overviewData.totalDatasets.value}
            </div>
            <div className="text-sm text-gray-500">Total Datasets</div>
            <div className="flex items-center text-sm">
              {overviewData.totalDatasets.direction === 'up' ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={
                  overviewData.totalDatasets.direction === 'up'
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {overviewData.totalDatasets.change}
              </span>
              <span className="ml-1 text-gray-500">
                updated in last 30 days
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Dataset Insights */}
      <Card className="border-primary/20 border-none bg-white shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">
            Individual Dataset Insights
          </CardTitle>
          <Select defaultValue="east-african-yields">
            <SelectTrigger className="w-fit border border-gray-200">
              <SelectValue placeholder="East African Agricultural Yields (2015-2023)" />
            </SelectTrigger>
            <SelectContent className="border border-gray-200 bg-white">
              <SelectItem
                value="east-african-yields"
                className="hover:bg-primary/20"
              >
                East African Agricultural Yields (2015-2023)
              </SelectItem>
              <SelectItem
                value="urban-transport"
                className="hover:bg-primary/20"
              >
                Urban Transportation Patterns - Nairobi
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
              <div className="text-2xl font-bold">3.2K</div>
              <div className="text-sm text-gray-500">Views</div>
              <div className="flex items-center text-sm">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">+32%</span>
                <span className="ml-1 text-gray-500">vs last 30 days</span>
              </div>
            </div>
            <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-gray-500">Downloads</div>
              <div className="flex items-center text-sm">
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">-42%</span>
                <span className="ml-1 text-gray-500">vs last 30 days</span>
              </div>
            </div>
            <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
              <div className="text-2xl font-bold">4.3</div>
              <div className="text-sm text-gray-500">Avg Rating</div>
              <div className="flex items-center text-sm">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">+0.2%</span>
                <span className="ml-1 text-gray-500"></span>
              </div>
            </div>
            <div className="grid gap-1 rounded-lg border border-gray-200 p-4 shadow">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-gray-500">Total Comments</div>
              <div className="flex items-center text-sm">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-500">-</span>
                <span className="ml-1 text-gray-500"></span>
              </div>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-gray-200 bg-white p-4 shadow">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">Views</h3>
                <Select defaultValue="last-month">
                  <SelectTrigger className="h-8 w-[120px] border border-gray-200 text-sm">
                    <SelectValue placeholder="Last Month" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 bg-white">
                    <SelectItem
                      value="last-month"
                      className="hover:bg-primary/20"
                    >
                      Last Month
                    </SelectItem>
                    <SelectItem
                      value="last-quarter"
                      className="hover:bg-primary/20"
                    >
                      Last Quarter
                    </SelectItem>
                    <SelectItem
                      value="last-year"
                      className="hover:bg-primary/20"
                    >
                      Last Year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <LineChart
                data={individualDatasetViewsData}
                // width={400}
                // height={200}
                className="w-full"
              />
            </div>
            <div className="border border-gray-200 bg-white p-4 shadow">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">Downloads</h3>
                <Select defaultValue="last-month">
                  <SelectTrigger className="h-8 w-[120px] border border-gray-200 text-sm">
                    <SelectValue placeholder="Last Month" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 bg-white">
                    <SelectItem
                      value="last-month"
                      className="hover:bg-primary/20"
                    >
                      Last Month
                    </SelectItem>
                    <SelectItem
                      value="last-quarter"
                      className="hover:bg-primary/20"
                    >
                      Last Quarter
                    </SelectItem>
                    <SelectItem
                      value="last-year"
                      className="hover:bg-primary/20"
                    >
                      Last Year
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <LineChart
                data={individualDatasetDownloadsData}
                width={400}
                height={200}
                lineColor="#F59E0B"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution & User Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-primary/20 border-none bg-white shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Geographic Distribution
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <BarChart data={geographicData} width={400} height={200} />
          </CardContent>
        </Card>
        <Card className="border-primary/20 border-none bg-white shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              User Categories
            </CardTitle>
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
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <PieChart data={userCategoriesData} width={250} height={250} />
            <div className="ml-4 grid gap-2">
              {userCategoriesData.map((d, i) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: d3.schemeCategory10[i] }}
                  ></span>
                  <span className="text-sm">{d.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Map */}
      <Card className="border-primary/20 border-none bg-white shadow">
        <CardHeader>
          <CardTitle>Dataset Geographic Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <WorldMap dataPoints={mapDataPoints} width={800} height={400} />
        </CardContent>
      </Card>

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
