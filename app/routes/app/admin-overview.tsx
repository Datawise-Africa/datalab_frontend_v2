import { Users, Database, Download, FileText, Loader2 } from 'lucide-react';
import { Card, CardContent } from '~/components/ui/card';
import { Protect } from '~/components/auth/protect';
import { useCreatorAnalytics } from '~/features/dataset-creator';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { StatCard } from '~/components/analytics/stat-card';

// Placeholder chart data - replace with real API data
const monthlyData = [
  { month: 'Jan', users: 120, datasets: 15, downloads: 890 },
  { month: 'Feb', users: 145, datasets: 22, downloads: 1100 },
  { month: 'Mar', users: 180, datasets: 18, downloads: 1350 },
  { month: 'Apr', users: 210, datasets: 28, downloads: 1600 },
  { month: 'May', users: 250, datasets: 35, downloads: 2100 },
  { month: 'Jun', users: 290, datasets: 42, downloads: 2500 },
];

export default function AdminOverview() {
  const { data: analytics, isLoading } = useCreatorAnalytics();

  return (
    <Protect roles={['admin']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground mt-1">
            Platform metrics and activity at a glance.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Datasets"
                value={(analytics?.total_datasets ?? 0).toLocaleString()}
                icon={Database}
                delta={12}
                hint="Datasets published across the platform."
              />
              <StatCard
                label="Total Downloads"
                value={(analytics?.total_downloads ?? 0).toLocaleString()}
                icon={Download}
                delta={8}
                hint="Approved downloads in the current period."
              />
              <StatCard
                label="Total Views"
                value={(analytics?.total_views ?? 0).toLocaleString()}
                icon={FileText}
                delta={15}
                hint="Dataset detail page views."
              />
              <StatCard
                label="Active Users"
                value="—"
                icon={Users}
                hint="Coming soon."
              />
            </div>

            {/* Growth chart */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Monthly Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        backgroundColor: 'hsl(var(--card))',
                        fontSize: '12px',
                      }}
                    />
                    <Bar
                      dataKey="users"
                      name="New Users"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                      opacity={0.8}
                    />
                    <Bar
                      dataKey="downloads"
                      name="Downloads"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                      opacity={0.6}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Protect>
  );
}
