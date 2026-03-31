import { useState } from 'react';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Card, CardContent } from '~/components/ui/card';
import { AsyncSelect } from '~/components/ui/async-select';
import { Loader2, Eye, Download, Star, Database } from 'lucide-react';
import {
  useCreatorAnalytics,
  useCreatorDatasets,
} from '~/features/dataset-creator';

export function meta() {
  return generateSEOTags({
    title: 'Creator Analytics',
    description: 'View your dataset analytics',
  });
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export default function CreatorAnalytics() {
  const [selectedDataset, setSelectedDataset] = useState<string | undefined>();

  const { data: analytics, isLoading } = useCreatorAnalytics(selectedDataset);
  const { data: publishedResult } = useCreatorDatasets({ status: 'PB' });

  const datasetOptions = (publishedResult?.data ?? []).map((d) => ({
    label: d.title,
    value: d.id,
  }));

  return (
    <Protect roles={['dataset_creator', 'admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Track performance of your published datasets
          </p>
        </div>

        {/* Dataset selector */}
        <div className="max-w-sm">
          <AsyncSelect
            value={selectedDataset ?? null}
            onChange={(val) => setSelectedDataset(val ?? undefined)}
            options={[{ label: 'All Datasets', value: '' }, ...datasetOptions]}
            placeholder="Select a dataset"
          />
        </div>

        {/* Overview cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                icon={Eye}
                label="Total Views"
                value={formatNumber(analytics?.total_views ?? 0)}
              />
              <StatCard
                icon={Download}
                label="Total Downloads"
                value={formatNumber(analytics?.total_downloads ?? 0)}
              />
              <StatCard icon={Star} label="Avg Rating" value="—" />
              <StatCard
                icon={Database}
                label="Total Datasets"
                value={String(analytics?.total_datasets ?? 0)}
              />
            </div>

            {/* Per-dataset breakdown */}
            {analytics?.datasets && analytics.datasets.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-semibold">
                  Dataset Breakdown
                </h2>
                <div className="rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">
                          Dataset
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          Views
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          Downloads
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.datasets.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b last:border-b-0 hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 font-medium">{d.title}</td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {formatNumber(d.views_count)}
                          </td>
                          <td className="px-4 py-3 text-right text-muted-foreground">
                            {formatNumber(d.download_count)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Protect>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 dark:bg-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
