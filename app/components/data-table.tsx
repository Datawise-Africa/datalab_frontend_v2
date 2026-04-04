import { type ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  AlertTriangle,
  Inbox,
} from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '~/components/ui/empty';

const pageSizeOptions = [
  { label: '5 rows', value: '5' },
  { label: '10 rows', value: '10' },
  { label: '20 rows', value: '20' },
  { label: '50 rows', value: '50' },
];

interface ServerPagination {
  /** Current page index (0-based). */
  pageIndex: number;
  /** Current page size. */
  pageSize: number;
  /** Total number of rows on the server. */
  totalRows: number;
  /** Callback when page index changes. */
  onPageChange: (pageIndex: number) => void;
  /** Callback when page size changes. */
  onPageSizeChange: (pageSize: number) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** Show refresh button in toolbar. */
  onRefresh?: () => void;
  /** Whether a refresh is in progress. */
  isRefreshing?: boolean;
  /** Whether the data fetch errored. */
  isError?: boolean;
  /** Custom empty state message. */
  emptyTitle?: string;
  emptyDescription?: string;
  /** Custom empty state icon. */
  emptyIcon?: ReactNode;
  /** Error message. */
  errorTitle?: string;
  errorDescription?: string;
  /** Show a page-aware row number column. Defaults to true. */
  showRowNumber?: boolean;
  /** Server-side pagination config. When provided, client-side pagination is disabled. */
  serverPagination?: ServerPagination;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRefresh,
  isRefreshing = false,
  isError = false,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your search or filters.',
  emptyIcon,
  errorTitle = 'Failed to load data',
  errorDescription = 'Something went wrong. Please try again.',
  showRowNumber = true,
  serverPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const isServerPaginated = !!serverPagination;

  const rowNumberCol: ColumnDef<TData, unknown> = {
    id: '_rowNumber',
    header: '#',
    enableSorting: false,
    cell: ({ row }) => {
      const pageIdx = isServerPaginated
        ? serverPagination.pageIndex
        : table.getState().pagination.pageIndex;
      const pageSz = isServerPaginated
        ? serverPagination.pageSize
        : table.getState().pagination.pageSize;
      return (
        <span className="text-muted-foreground tabular-nums">
          {pageIdx * pageSz + row.index + 1}
        </span>
      );
    },
  };

  const allColumns = showRowNumber ? [rowNumberCol, ...columns] : columns;

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(isServerPaginated
      ? {
          manualPagination: true,
          pageCount: Math.ceil(
            serverPagination.totalRows / serverPagination.pageSize
          ),
        }
      : { getPaginationRowModel: getPaginationRowModel() }),
    onSortingChange: setSorting,
    state: {
      sorting,
      ...(isServerPaginated
        ? {
            pagination: {
              pageIndex: serverPagination.pageIndex,
              pageSize: serverPagination.pageSize,
            },
          }
        : {}),
    },
    initialState: isServerPaginated
      ? undefined
      : { pagination: { pageSize: 10 } },
  });

  const pageIndex = isServerPaginated
    ? serverPagination.pageIndex
    : table.getState().pagination.pageIndex;
  const pageSize = isServerPaginated
    ? serverPagination.pageSize
    : table.getState().pagination.pageSize;
  const totalRows = isServerPaginated
    ? serverPagination.totalRows
    : table.getFilteredRowModel().rows.length;
  const totalPages = isServerPaginated
    ? Math.ceil(serverPagination.totalRows / serverPagination.pageSize)
    : table.getPageCount();
  const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  const canPreviousPage = isServerPaginated
    ? pageIndex > 0
    : table.getCanPreviousPage();
  const canNextPage = isServerPaginated
    ? pageIndex < totalPages - 1
    : table.getCanNextPage();

  const goToPage = (idx: number) => {
    if (isServerPaginated) {
      serverPagination.onPageChange(idx);
    } else {
      table.setPageIndex(idx);
    }
  };

  const setPageSizeHandler = (size: number) => {
    if (isServerPaginated) {
      serverPagination.onPageSizeChange(size);
    } else {
      table.setPageSize(size);
    }
  };

  return (
    <div className="space-y-0">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 bg-muted/30 px-4 py-2">
        <p className="text-sm text-muted-foreground">
          {isError ? (
            'Error loading data'
          ) : totalRows === 0 ? (
            'No results'
          ) : (
            <>
              Showing{' '}
              <span className="font-medium text-foreground">
                {start}–{end}
              </span>{' '}
              of{' '}
              <span className="font-medium text-foreground">{totalRows}</span>{' '}
              {totalRows === 1 ? 'row' : 'rows'}
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(val) => setPageSizeHandler(Number(val))}
          >
            <SelectTrigger className="h-8 w-17.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-muted-foreground"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto border border-b-0">
        <table className="w-full">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className={
                          header.column.getCanSort()
                            ? 'flex items-center gap-1.5 cursor-pointer select-none hover:text-foreground transition-colors'
                            : 'flex items-center'
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-muted-foreground/50">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronsUpDown className="h-3.5 w-3.5" />
                            )}
                          </span>
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {isError ? (
              <tr>
                <td colSpan={allColumns.length} className="p-0">
                  <Empty className="border-0 py-16">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <AlertTriangle className="text-destructive" />
                      </EmptyMedia>
                      <EmptyTitle>{errorTitle}</EmptyTitle>
                      <EmptyDescription>{errorDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={allColumns.length} className="p-0">
                  <Empty className="border-0 py-16">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        {emptyIcon ?? <Inbox />}
                      </EmptyMedia>
                      <EmptyTitle>{emptyTitle}</EmptyTitle>
                      <EmptyDescription>{emptyDescription}</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between rounded-b-lg border bg-muted/30 px-4 py-2">
        <p className="text-xs text-muted-foreground">
          Page {pageIndex + 1} of {Math.max(totalPages, 1)}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canPreviousPage}
            onClick={() => goToPage(0)}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canPreviousPage}
            onClick={() => goToPage(pageIndex - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canNextPage}
            onClick={() => goToPage(pageIndex + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={!canNextPage}
            onClick={() => goToPage(totalPages - 1)}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
