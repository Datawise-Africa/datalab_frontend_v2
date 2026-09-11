import { Loader2 } from 'lucide-react';
import { AppDialog } from '~/components/ui/app-dialog';
import { Badge } from '~/components/ui/badge';
import { useDashboardSourceProfile } from '~/features/dashboard-studio';
import type { DashboardDataSource } from '~/lib/types/dashboard';

export function SourceProfileDialog({
  dashboardId,
  workspaceId,
  source,
  open,
  onOpenChange,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  source?: DashboardDataSource;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const { data, isLoading } = useDashboardSourceProfile(
    dashboardId,
    source?.id,
    workspaceId
  );
  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`${source?.name ?? 'Source'} · data profile`}
      size="xl"
    >
      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        data && (
          <div>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <Stat label="Rows" value={data.row_count} />
              <Stat label="Columns" value={data.column_count} />
              <Stat label="Duplicate rows" value={data.duplicate_rows} />
            </div>
            <div className="scrollbar-thin max-h-[55vh] overflow-auto rounded-lg border">
              <table className="w-full min-w-[40rem] text-sm">
                <thead className="sticky top-0 z-10 bg-muted/80 backdrop-blur">
                  <tr className="text-xs text-muted-foreground">
                    <th className="p-2 text-left font-medium">Field</th>
                    <th className="p-2 text-left font-medium">Type</th>
                    <th className="p-2 text-right font-medium">Missing</th>
                    <th className="p-2 text-right font-medium">Unique</th>
                    <th className="w-1/2 p-2 text-left font-medium">
                      Examples
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.columns.map((column) => (
                    <tr key={column.name} className="border-t">
                      <td className="p-2 align-top font-medium break-words">
                        {column.name}
                      </td>
                      <td className="p-2 align-top">
                        <Badge variant="outline">{column.type}</Badge>
                      </td>
                      <td className="p-2 text-right align-top tabular-nums">
                        {column.missing_percent}%
                      </td>
                      <td className="p-2 text-right align-top tabular-nums">
                        {(column.unique_count ?? 0).toLocaleString()}
                      </td>
                      <td
                        className="p-2 align-top"
                        title={column.sample_values.map(String).join(', ')}
                      >
                        <div className="flex flex-wrap gap-1">
                          {[...new Set(column.sample_values.map(String))]
                            .slice(0, 5)
                            .map((value) => (
                              <span
                                key={value}
                                className="max-w-[12rem] truncate rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                              >
                                {value}
                              </span>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </AppDialog>
  );
}
function Stat({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value.toLocaleString()}</p>
    </div>
  );
}
