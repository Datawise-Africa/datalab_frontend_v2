import { useParams } from 'react-router';
import { BarChart3, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useWorkspaceAnalytics } from '~/features/workspaces';

export default function WorkspaceAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useWorkspaceAnalytics(id!);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Views, downloads and engagement for this workspace
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
          <BarChart3 className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            Analytics are not yet available for workspaces.
          </p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto text-xs text-muted-foreground">
              {JSON.stringify(data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
