import { Loader2 } from 'lucide-react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useDashboardRevisions } from '~/features/dashboard-studio';

export function HistoryDialog({
  dashboardId,
  workspaceId,
  open,
  onOpenChange,
  restore,
}: Readonly<{
  dashboardId: string;
  workspaceId?: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  restore: (id: string) => Promise<void>;
}>) {
  const { data: revisions = [], isLoading } = useDashboardRevisions(
    dashboardId,
    workspaceId
  );
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Version history</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Loader2 className="mx-auto my-12 h-6 w-6 animate-spin text-primary" />
        ) : (
          <div className="max-h-[60vh] space-y-2 overflow-auto">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {revision.note || 'Dashboard revision'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(revision.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void restore(revision.id)}
                >
                  Restore
                </Button>
              </div>
            ))}
            {!revisions.length && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                History will appear after the first save.
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
