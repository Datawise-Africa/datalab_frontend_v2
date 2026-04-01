import { Link } from 'react-router';
import moment from 'moment';
import type { Route } from './+types/dataset-detail';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';
import { CsvPreview } from '~/components/dataset-preview/csv-preview';
import { ReviewList } from '~/components/reviews/review-list';
import {
  ArrowLeft,
  Download,
  Eye,
  Loader2,
  Star,
  User,
  Calendar,
  HardDrive,
  Globe,
  Building2,
  GraduationCap,
  Landmark,
  FileText,
  MapPin,
  BookOpen,
  Bookmark,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { useDataset } from '~/features/datasets';
import { useAddBookmark, useBookmarkedDatasets } from '~/features/bookmarks';
import { useTrackView } from '~/hooks/use-track-view';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';
import { generateSEOTags } from '~/lib/utils/seo';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dataset',
    description: 'View dataset details on Datalab Africa',
  });
}

const audienceIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  students: GraduationCap,
  non_profit: Landmark,
  company: Building2,
  public: Globe,
};

const audienceLabels: Record<string, string> = {
  students: 'Student',
  non_profit: 'Non-Profit',
  company: 'Company',
  public: 'Public',
};

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export default function DatasetDetail({ params }: Route.ComponentProps) {
  const slug = params.slug;
  const { data: dataset, isLoading, isError } = useDataset(slug);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const downloadModal = useAppModal('download');
  const { data: bookmarksData } = useBookmarkedDatasets();
  const addBookmark = useAddBookmark();

  useTrackView(dataset?.id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !dataset) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <FileText className="h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-2xl font-semibold">Dataset not found</h2>
        <p className="text-muted-foreground">
          The dataset you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button asChild variant="outline">
          <Link to="/datasets">Browse Datasets</Link>
        </Button>
      </div>
    );
  }

  const _isBookmarked = bookmarksData?.some((b) => b.dataset.id === dataset.id);

  const handleDownload = () => {
    if (!isAuthenticated) {
      authModal.open();
      return;
    }
    const formats = dataset.data_file_types
      ? dataset.data_file_types.split(',').map((f) => f.trim())
      : ['CSV'];
    downloadModal.open({
      datasetId: dataset.id,
      datasetName: dataset.title,
      price: dataset.is_premium ? dataset.price : null,
      formats,
      license: dataset.license?.name ?? 'Standard License',
    });
  };

  const _handleBookmark = () => {
    if (!isAuthenticated) {
      authModal.open();
      return;
    }
    addBookmark.mutate(dataset.id);
  };

  const authorName =
    dataset.authors.length > 0
      ? `${dataset.authors[0].first_name} ${dataset.authors[0].last_name}`
      : 'Unknown';

  const authorAffiliation = dataset.authors[0]?.affiliation;

  const regions = dataset.covered_regions
    ? dataset.covered_regions
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const keywords = dataset.keywords
    ? dataset.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back link */}
        <Link
          to="/datasets"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Datasets
        </Link>

        {/* ── Two-column header ── */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Left column - info */}
          <div className="flex-1 min-w-0">
            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {dataset.license && (
                <Badge variant="default">{dataset.license.name}</Badge>
              )}
              <Badge variant="secondary">{dataset.category.name}</Badge>
              <Badge variant={dataset.is_premium ? 'outline' : 'secondary'}>
                {dataset.is_premium ? `$${dataset.price}` : 'Free'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              {dataset.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-4">
              {dataset.description}
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                {authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Updated {moment(dataset.updated_at).format('MMM D, YYYY')}
              </span>
              {dataset.data_file_types && (
                <span className="flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5" />
                  {dataset.data_file_types} ({dataset.size_bytes})
                </span>
              )}
            </div>

            {/* Tags */}
            {dataset.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {dataset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Available to */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Available to:
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {Object.entries(dataset.intended_audience)
                  .filter(([, v]) => v)
                  .map(([key]) => {
                    const Icon = audienceIcons[key] ?? Globe;
                    const label = audienceLabels[key] ?? key;
                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right column - sidebar stats card */}
          <div className="lg:w-72 shrink-0">
            <Card className="lg:sticky lg:top-6">
              <CardContent className="p-5 space-y-4">
                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-bold">
                      {formatNumber(dataset.views_count)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Views</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Download className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-bold">
                      {formatNumber(dataset.download_count)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Downloads
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-lg font-bold">
                      {dataset.average_review > 0
                        ? dataset.average_review.toFixed(1)
                        : '--'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {dataset.review_count} reviews
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Download button */}
                <Button className="w-full" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  {dataset.is_premium && dataset.price
                    ? `Download — $${dataset.price}`
                    : 'Download'}
                </Button>

                {/* Bookmark & Share */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={_handleBookmark}
                  >
                    <Bookmark className="mr-1.5 h-4 w-4" />
                    Bookmark
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                  >
                    <Share2 className="mr-1.5 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Files */}
                {dataset.data_files.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Files
                      </p>
                      <div className="space-y-2">
                        {dataset.data_files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="truncate flex-1">
                              {file.file_name}
                            </span>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {file.file_size_display}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Tabbed content ── */}
        <Tabs defaultValue="preview" className="mb-8">
          <TabsList>
            <TabsTrigger value="preview">CSV Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews
              {dataset.review_count > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1.5 text-[10px] px-1.5 py-0"
                >
                  {dataset.review_count}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* CSV Preview tab */}
          <TabsContent value="preview" className="mt-4">
            {dataset.data_files.length > 0 ? (
              <CsvPreview dataFiles={dataset.data_files} />
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No preview available for this dataset.
              </p>
            )}
          </TabsContent>

          {/* Details tab */}
          <TabsContent value="details" className="mt-4 space-y-8">
            {/* Regions & Keywords */}
            {(regions.length > 0 || keywords.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {regions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      Covered Regions
                    </h3>
                    <ul className="space-y-1">
                      {regions.map((r) => (
                        <li
                          key={r}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {keywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Key Topics
                    </h3>
                    <ul className="space-y-1">
                      {keywords.map((k) => (
                        <li
                          key={k}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Additional Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dataset.license && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Usage License</h4>
                    <p className="text-sm text-muted-foreground">
                      {dataset.license.name}
                      {dataset.license.description &&
                        `. ${dataset.license.description}`}
                    </p>
                  </div>
                )}
                {dataset.doi && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">DOI</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      {dataset.doi}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Author Information */}
            {dataset.authors.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold mb-3">
                    Author Information
                  </h3>
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <span className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {authorName}
                    </span>
                    {authorAffiliation && (
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {authorAffiliation}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Insights */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Dataset Insights</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InsightCard
                  label="Views"
                  value={formatNumber(dataset.views_count)}
                />
                <InsightCard
                  label="Downloads"
                  value={formatNumber(dataset.download_count)}
                />
                <InsightCard
                  label="Avg Rating"
                  value={
                    dataset.average_review > 0
                      ? dataset.average_review.toFixed(1)
                      : '--'
                  }
                  sub={dataset.review_count > 0 ? 'out of 5.0' : undefined}
                />
                <InsightCard
                  label="Total Comments"
                  value={String(dataset.review_count)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Reviews tab */}
          <TabsContent value="reviews" className="mt-4">
            <ReviewList reviews={dataset.reviews} showForm={isAuthenticated} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function InsightCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="text-center rounded-lg border p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
