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
            <div className="max-h-[55vh] overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Field</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-right">Missing</th>
                    <th className="p-2 text-right">Unique</th>
                    <th className="p-2 text-left">Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {data.columns.map((column) => (
                    <tr key={column.name} className="border-t">
                      <td className="p-2 font-medium">{column.name}</td>
                      <td className="p-2">
                        <Badge variant="outline">{column.type}</Badge>
                      </td>
                      <td className="p-2 text-right">
                        {column.missing_percent}%
                      </td>
                      <td className="p-2 text-right">
                        {(column.unique_count ?? 0).toLocaleString()}
                      </td>
                      <td className="max-w-xs truncate p-2 text-muted-foreground">
                        {column.sample_values.map(String).join(', ')}
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
