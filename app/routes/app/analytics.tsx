import { Loader2, Eye, Download, Database, Star } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Protect } from '~/components/auth/protect';
import { useCreatorAnalytics } from '~/features/dataset-creator';
import { AnalyticsChart } from '~/components/analytics/analytics-chart';

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useCreatorAnalytics();

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track performance across your datasets.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Views"
                value={analytics?.total_views ?? 0}
                icon={Eye}
              />
              <StatCard
                label="Total Downloads"
                value={analytics?.total_downloads ?? 0}
                icon={Download}
              />
              <StatCard
                label="Total Datasets"
                value={analytics?.total_datasets ?? 0}
                icon={Database}
              />
              <StatCard label="Avg Rating" value="--" icon={Star} />
            </div>

            {/* Chart */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Views & Downloads Over Time
                </h2>
                <AnalyticsChart data={[]} />
              </CardContent>
            </Card>

            {/* Top datasets */}
            {/* Top datasets - will be populated when API provides ranking data */}
          </>
        )}
      </div>
    </Protect>
  );
}
