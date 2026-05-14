import { useState } from 'react';
import { Protect } from '~/components/auth/protect';
import { TopPerformingTable } from '~/components/analytics/top-performing-table';
import { DatasetAnalyticsSheet } from '~/components/analytics/dataset-analytics-sheet';

export default function AnalyticsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Track performance across your datasets. Click View on any row to
            open detailed analytics.
          </p>
        </div>

        <TopPerformingTable
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
        />

        <DatasetAnalyticsSheet
          datasetId={selectedId}
          onOpenChange={(open) => !open && setSelectedId(null)}
        />
      </div>
    </Protect>
  );
}
