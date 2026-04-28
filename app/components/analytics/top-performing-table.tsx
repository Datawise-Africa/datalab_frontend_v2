import { Loader2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { useTopPerformingDatasets } from '~/features/dataset-analytics';

interface Props {
  workspace?: string;
  selectedId?: string;
  onSelect?: (datasetId: string) => void;
}

export function TopPerformingTable({
  workspace,
  selectedId,
  onSelect,
}: Readonly<Props>) {
  const { data, isLoading } = useTopPerformingDatasets({ workspace });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <TrendingUp className="h-4 w-4 text-primary" />
          Top performing datasets
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-muted-foreground">
            No datasets to rank yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-6 py-2 font-medium">Dataset</th>
                <th className="px-3 py-2 text-right font-medium">Downloads</th>
                <th className="px-3 py-2 text-right font-medium">Bookmarks</th>
                <th className="px-3 py-2 text-right font-medium">Reviews</th>
                <th className="px-6 py-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const isSelected = selectedId === row.id;
                return (
                  <tr
                    key={row.id}
                    className={
                      isSelected
                        ? 'border-b bg-primary/5'
                        : 'border-b hover:bg-muted/30'
                    }
                  >
                    <td className="max-w-0 px-6 py-2">
                      <p className="truncate font-medium">{row.name}</p>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {row.total_downloads}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {row.total_bookmarks}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {row.total_reviews}
                    </td>
                    <td className="px-6 py-1.5 text-right">
                      {onSelect && (
                        <Button
                          size="sm"
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => onSelect(row.id)}
                        >
                          {isSelected ? 'Selected' : 'View'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
