import { MapPin, Globe2, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { AnalyticsChart } from '~/components/analytics/analytics-chart';
import { StatCard } from '~/components/analytics/stat-card';
import { GeoMap } from '~/components/analytics/geo-map';
import {
  useDatasetGeography,
  useDatasetIntendedUse,
  useDatasetOverview,
  useDatasetTrends,
} from '~/features/dataset-analytics';
import type { GeographyEntry } from '~/features/dataset-analytics';
import { getCountryCentroid } from '~/lib/utils/country-centroids';

interface Props {
  datasetId: string;
}

export function DatasetAnalyticsPanels({ datasetId }: Readonly<Props>) {
  return (
    <div className="space-y-6">
      <OverviewKpis datasetId={datasetId} />
      <TrendsCard datasetId={datasetId} />
      <div className="grid gap-6 lg:grid-cols-2">
        <GeographyCard datasetId={datasetId} />
        <IntendedUseCard datasetId={datasetId} />
      </div>
    </div>
  );
}

/* ── Overview KPIs ── */

function OverviewKpis({ datasetId }: Readonly<{ datasetId: string }>) {
  const { data, isLoading } = useDatasetOverview(datasetId);
  if (isLoading) return <PanelLoader />;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <StatCard
        label="Views"
        value={(data?.total_views ?? 0).toLocaleString()}
        hint="Total page views since the dataset was published."
      />
      <StatCard
        label="Downloads"
        value={(data?.total_downloads ?? 0).toLocaleString()}
        hint="Number of approved download requests."
      />
      <StatCard
        label="Bookmarks"
        value={(data?.total_bookmarks ?? 0).toLocaleString()}
        hint="Users who saved this dataset to their bookmarks."
      />
      <StatCard
        label="Reviews"
        value={(data?.total_reviews ?? 0).toLocaleString()}
        hint="Total reviews submitted by users."
      />
      <StatCard
        label="Avg rating"
        value={
          data?.average_rating ? Number(data.average_rating).toFixed(1) : '—'
        }
        hint="Mean of all reviewer ratings (out of 5)."
      />
    </div>
  );
}

/* ── Trends ── */

function TrendsCard({ datasetId }: Readonly<{ datasetId: string }>) {
  const { data, isLoading } = useDatasetTrends(datasetId);

  // Merge views/downloads by date so the chart can plot both lines.
  const merged = mergeTrends(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Views & downloads</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <PanelLoader /> : <AnalyticsChart data={merged} />}
      </CardContent>
    </Card>
  );
}

function mergeTrends(data: ReturnType<typeof useDatasetTrends>['data']) {
  if (!data) return [];
  const map = new Map<
    string,
    { date: string; views: number; downloads: number }
  >();
  for (const v of data.views ?? []) {
    const entry = map.get(v.view_date) ?? {
      date: v.view_date,
      views: 0,
      downloads: 0,
    };
    entry.views = v.total;
    map.set(v.view_date, entry);
  }
  for (const d of data.downloads ?? []) {
    const entry = map.get(d.download_day) ?? {
      date: d.download_day,
      views: 0,
      downloads: 0,
    };
    entry.downloads = d.total;
    map.set(d.download_day, entry);
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/* ── Geography ── */

function GeographyCard({ datasetId }: Readonly<{ datasetId: string }>) {
  const { data, isLoading } = useDatasetGeography(datasetId);

  // Split into mappable rows (country name resolves to centroid) and the rest.
  const { mappable, unknownTotal } = splitGeography(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Globe2 className="h-4 w-4 text-primary" />
          Downloads by country
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PanelLoader />
        ) : !data || data.length === 0 ? (
          <EmptyMsg
            icon={<MapPin className="h-6 w-6" />}
            text="No download geography yet."
          />
        ) : (
          <div className="space-y-3">
            <GeoMap data={mappable} metric="downloads" title="" />
            {unknownTotal > 0 && (
              <p className="text-xs italic text-muted-foreground">
                {unknownTotal.toLocaleString()} download
                {unknownTotal === 1 ? '' : 's'} from unknown locations.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function splitGeography(rows: GeographyEntry[] | undefined) {
  const mappable: {
    country: string;
    code: string;
    lat: number;
    lng: number;
    views: number;
    downloads: number;
  }[] = [];
  let unknownTotal = 0;
  for (const row of rows ?? []) {
    const centroid = getCountryCentroid(row.download_country);
    if (centroid && row.download_country) {
      mappable.push({
        country: row.download_country,
        code: centroid.code,
        lat: centroid.lat,
        lng: centroid.lng,
        views: 0,
        downloads: row.total,
      });
    } else {
      unknownTotal += row.total;
    }
  }
  return { mappable, unknownTotal };
}

/* ── Intended Use ── */

function IntendedUseCard({ datasetId }: Readonly<{ datasetId: string }>) {
  const { data, isLoading } = useDatasetIntendedUse(datasetId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Intended uses</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PanelLoader />
        ) : !data || data.length === 0 ? (
          <EmptyMsg
            icon={<MessageSquare className="h-6 w-6" />}
            text="No download requests yet."
          />
        ) : (
          <ul className="space-y-2">
            {data.map((row, i) => (
              <li
                key={`${i}-${row.intended_use.slice(0, 24)}`}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="line-clamp-2 flex-1 text-foreground">
                  {row.intended_use || (
                    <span className="italic text-muted-foreground">
                      (not provided)
                    </span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {row.total}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

/* ── Helpers ── */

function PanelLoader() {
  return (
    <div className="flex items-center justify-center py-8 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
    </div>
  );
}

function EmptyMsg({
  icon,
  text,
}: Readonly<{ icon: React.ReactNode; text: string }>) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8 text-center text-sm text-muted-foreground">
      {icon}
      <span>{text}</span>
    </div>
  );
}
