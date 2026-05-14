import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { TopPerformingTable } from '~/components/analytics/top-performing-table';
import { DatasetAnalyticsSheet } from '~/components/analytics/dataset-analytics-sheet';

export default function WorkspaceAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Reset selection when switching workspaces.
  useEffect(() => {
    setSelectedId(null);
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Top datasets in this workspace. Click View for per-dataset breakdown.
        </p>
      </div>

      <TopPerformingTable
        workspace={id}
        selectedId={selectedId ?? undefined}
        onSelect={setSelectedId}
      />

      <DatasetAnalyticsSheet
        datasetId={selectedId}
        onOpenChange={(open) => !open && setSelectedId(null)}
      />
    </div>
  );
}
