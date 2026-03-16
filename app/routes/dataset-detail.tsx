import { Link } from 'react-router';
import moment from 'moment';
import type { Route } from './+types/dataset-detail';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { cn } from '~/lib/utils';
import { CsvPreview } from '~/components/dataset-preview/csv-preview';
import {
  ArrowLeft,
  Download,
  Eye,
  Loader2,
  Star,
  User,
  Calendar,
  HardDrive,
  Users,
  CheckCircle2,
  Globe,
  Building2,
  GraduationCap,
  Landmark,
  FileText,
  MapPin,
  MessageSquare,
  Mail,
  BookOpen,
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

  const isBookmarked = bookmarksData?.some((b) => b.dataset.id === dataset.id);

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
      license: dataset.license?.title ?? 'Standard License',
    });
  };

  const handleBookmark = () => {
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
  const authorEmail = dataset.authors[0]?.email;

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Back link */}
        <Link
          to="/datasets"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Datasets
        </Link>

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <Badge className="mb-3 bg-primary text-white">{dataset.id}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                {dataset.title}
              </h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {authorName}
                </span>
                {dataset.average_review > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {dataset.average_review.toFixed(1)} ({dataset.review_count}{' '}
                    reviews)
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="mt-4 text-muted-foreground leading-relaxed">
            {dataset.description}
          </p>
        </div>

        {/* ── Tags ── */}
        {dataset.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {dataset.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* ── Available to ── */}
        <div className="mb-4">
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
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </span>
                );
              })}
          </div>
        </div>

        {/* ── Meta row ── */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Updated: {moment(dataset.updated_at).format('YYYY-MM-DD')}
          </span>
          {dataset.data_file_types && (
            <span className="flex items-center gap-1.5">
              <HardDrive className="h-4 w-4" />
              {dataset.data_file_types} ({dataset.size_bytes})
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {formatNumber(dataset.download_count)} downloads
          </span>
        </div>

        <Separator className="mb-6" />

        {/* ── File Information ── */}
        {dataset.data_files.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">File Information</h2>
            <div className="grid grid-cols-2 gap-3">
              {dataset.data_files.map((file) => (
                <Card key={file.id} className="py-0">
                  <CardContent className="flex items-center gap-3 p-4">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {file.file_size_display}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ── CSV Data Preview ── */}
        {dataset.data_files.length > 0 && (
          <section className="mb-8">
            <CsvPreview dataFiles={dataset.data_files} />
          </section>
        )}

        {/* ── Dataset Overview (regions + keywords) ── */}
        {(regions.length > 0 || keywords.length > 0) && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Dataset Overview</h2>
            <div className="grid grid-cols-2 gap-8">
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
          </section>
        )}

        {/* ── Sticky action buttons ── */}
        <div className="flex items-center gap-3 mb-8">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/datasets/${slug}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4" />
            {dataset.is_premium && dataset.price
              ? `Download — $${dataset.price}`
              : 'Download'}
          </Button>
        </div>

        <Separator className="mb-8" />

        {/* ── Additional Information ── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dataset.license && (
              <div>
                <h3 className="text-sm font-semibold mb-1">Usage License</h3>
                <p className="text-sm text-muted-foreground">
                  {dataset.license.title}
                  {dataset.license.description &&
                    `. ${dataset.license.description}`}
                </p>
              </div>
            )}
            {dataset.doi && (
              <div>
                <h3 className="text-sm font-semibold mb-1">DOI</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {dataset.doi}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── Author Information ── */}
        {dataset.authors.length > 0 && (
          <section className="mb-8">
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
                  {authorEmail && (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {authorEmail}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        <Separator className="mb-8" />

        {/* ── Dataset Insights ── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Dataset Insights</h2>
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
                  : '—'
              }
              sub={dataset.review_count > 0 ? `out of 5.0` : undefined}
            />
            <InsightCard
              label="Total Comments"
              value={String(dataset.review_count)}
            />
          </div>
        </section>

        <Separator className="mb-8" />

        {/* ── Rate this dataset ── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Rate this dataset</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Download this dataset to leave a rating
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-6 w-6 text-muted-foreground/30 cursor-pointer hover:text-amber-400 hover:fill-amber-400 transition-colors"
              />
            ))}
          </div>
        </section>

        {/* ── Comments ── */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Comments
          </h2>
          {dataset.reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Download this dataset to leave a rating
            </p>
          ) : (
            <div className="space-y-4 mt-4">
              {dataset.reviews.map((review) => (
                <Card key={review.id} className="py-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {review.user.first_name} {review.user.last_name}
                      </span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-3.5 w-3.5',
                              i < review.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {moment(review.created_at).fromNow()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
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
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
