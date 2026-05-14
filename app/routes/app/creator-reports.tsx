import { useState, useMemo } from 'react';
import type { Route } from './+types/creator-reports';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Card, CardContent } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Label } from '~/components/ui/label';
import { Checkbox } from '~/components/ui/checkbox';
import { Separator } from '~/components/ui/separator';
import { AsyncSelect } from '~/components/ui/async-select';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from '~/components/ui/empty';
import {
  Loader2,
  FileText,
  Download,
  Calendar,
  BarChart3,
  Eye,
  Star,
  MessageSquare,
  RefreshCw,
} from 'lucide-react';
import { useCreatorReports } from '~/features/dataset-creator';
import { useMyDatasets } from '~/features/my-datasets';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Creator Reports',
    description: 'Generate reports for your datasets',
  });
}

const dateRangeOptions = [
  { label: 'Past Month', value: 'past_month' },
  { label: 'Past 3 Months', value: 'past_3_months' },
  { label: 'Past 6 Months', value: 'past_6_months' },
  { label: 'Past Year', value: 'past_year' },
];

const metricOptions = [
  { key: 'views', label: 'Views', icon: Eye },
  { key: 'downloads', label: 'Downloads', icon: Download },
  { key: 'ratings', label: 'Ratings', icon: Star },
  { key: 'reviews', label: 'Reviews', icon: MessageSquare },
] as const;

export default function CreatorReports() {
  const [dateRange, setDateRange] = useState('past_month');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'views',
    'downloads',
  ]);

  const startDate = getStartDate(dateRange);
  const endDate = new Date().toISOString().split('T')[0];

  const { data: publishedResult } = useMyDatasets({ status: 'PB' });
  const {
    data: reports,
    isLoading,
    isFetching,
    refetch,
  } = useCreatorReports({
    start_date: startDate,
    end_date: endDate,
    metrics: selectedMetrics.join(','),
  });

  const toggleMetric = (key: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]
    );
  };

  const datasetCount = publishedResult?.data?.length ?? 0;
  const rangeLabelMap: Record<string, string> = {
    past_month: 'Past Month',
    past_3_months: 'Past 3 Months',
    past_6_months: 'Past 6 Months',
    past_year: 'Past Year',
  };

  // Summary totals
  const totals = useMemo(() => {
    if (!reports || reports.length === 0) return null;
    return reports.reduce(
      (acc, row) => ({
        views: acc.views + (row.views ?? 0),
        downloads: acc.downloads + (row.downloads ?? 0),
      }),
      { views: 0, downloads: 0 }
    );
  }, [reports]);

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Generate and export performance reports for your datasets
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {/* ── Configuration strip ── */}
        <Card>
          <CardContent className="p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
              {/* Date range */}
              <div className="space-y-1.5 lg:w-48">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Calendar className="mr-1.5 inline h-3.5 w-3.5" />
                  Date Range
                </Label>
                <AsyncSelect
                  value={dateRange}
                  onChange={(val) => setDateRange(val ?? 'past_month')}
                  options={dateRangeOptions}
                  placeholder="Select range"
                />
              </div>

              {/* Metrics */}
              <div className="space-y-1.5 flex-1">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <BarChart3 className="mr-1.5 inline h-3.5 w-3.5" />
                  Metrics
                </Label>
                <div className="flex flex-wrap gap-3">
                  {metricOptions.map((metric) => {
                    const isSelected = selectedMetrics.includes(metric.key);
                    return (
                      <Label
                        key={metric.key}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors hover:bg-muted data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
                        data-state={isSelected ? 'checked' : 'unchecked'}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleMetric(metric.key)}
                        />
                        <metric.icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{metric.label}</span>
                      </Label>
                    );
                  })}
                </div>
              </div>

              {/* Generate */}
              <Button className="shrink-0 bg-primary hover:bg-primary/90 lg:self-end">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Summary cards ── */}
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {rangeLabelMap[dateRange] ?? dateRange}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <FileText className="h-3.5 w-3.5" />
            {datasetCount} dataset{datasetCount !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5">
            <BarChart3 className="h-3.5 w-3.5" />
            {selectedMetrics.length} metric
            {selectedMetrics.length !== 1 ? 's' : ''}
          </Badge>
          {totals && selectedMetrics.includes('views') && (
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
              <Eye className="h-3.5 w-3.5" />
              {totals.views.toLocaleString()} views
            </Badge>
          )}
          {totals && selectedMetrics.includes('downloads') && (
            <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
              <Download className="h-3.5 w-3.5" />
              {totals.downloads.toLocaleString()} downloads
            </Badge>
          )}
        </div>

        <Separator />

        {/* ── Report data ── */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !reports || reports.length === 0 ? (
          <Empty className="border py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>No report data</EmptyTitle>
              <EmptyDescription>
                There&apos;s no data for the selected date range and metrics.
                Try adjusting the configuration above.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  {selectedMetrics.includes('views') && (
                    <th className="px-4 py-3 text-right font-medium">Views</th>
                  )}
                  {selectedMetrics.includes('downloads') && (
                    <th className="px-4 py-3 text-right font-medium">
                      Downloads
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {reports.map((row, idx) => (
                  <tr
                    key={row.date}
                    className={`border-b last:border-b-0 transition-colors hover:bg-muted/30 ${
                      idx % 2 === 0 ? '' : 'bg-muted/20'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium">{row.date}</td>
                    {selectedMetrics.includes('views') && (
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {row.views.toLocaleString()}
                      </td>
                    )}
                    {selectedMetrics.includes('downloads') && (
                      <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {row.downloads.toLocaleString()}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              {/* Totals row */}
              {totals && (
                <tfoot>
                  <tr className="border-t bg-muted/50 font-semibold">
                    <td className="px-4 py-3">Total</td>
                    {selectedMetrics.includes('views') && (
                      <td className="px-4 py-3 text-right tabular-nums">
                        {totals.views.toLocaleString()}
                      </td>
                    )}
                    {selectedMetrics.includes('downloads') && (
                      <td className="px-4 py-3 text-right tabular-nums">
                        {totals.downloads.toLocaleString()}
                      </td>
                    )}
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </Protect>
  );
}

function getStartDate(range: string): string {
  const now = new Date();
  switch (range) {
    case 'past_month':
      now.setMonth(now.getMonth() - 1);
      break;
    case 'past_3_months':
      now.setMonth(now.getMonth() - 3);
      break;
    case 'past_6_months':
      now.setMonth(now.getMonth() - 6);
      break;
    case 'past_year':
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now.toISOString().split('T')[0];
}
