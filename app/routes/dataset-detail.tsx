import { Link } from 'react-router';
import moment from 'moment';
import type { Route } from './+types/dataset-detail';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '~/components/ui/accordion';
import { ReviewList } from '~/components/reviews/review-list';
import {
  ArrowLeft,
  Download,
  Loader2,
  User,
  Calendar,
  HardDrive,
  MapPin,
  Bookmark,
  Share2,
  FileText,
  ClipboardList,
  GitBranch,
} from 'lucide-react';
import { useDataset, useDatasetVersions } from '~/features/datasets';
import { useAddBookmark, useBookmarkedDatasets } from '~/features/bookmarks';
import { useTrackView } from '~/hooks/use-track-view';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';
import { generateSEOTags } from '~/lib/utils/seo';
import { formatBytes } from '~/lib/utils/format';
import type { MyDatasetInterface } from '~/features/my-datasets';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dataset',
    description: 'View dataset details on Datalab Africa',
  });
}

export default function DatasetDetail({ params }: Route.ComponentProps) {
  const slug = params.slug;
  const { data: dataset, isLoading, isError } = useDataset(slug);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const downloadModal = useAppModal('download');
  const { data: bookmarksData } = useBookmarkedDatasets({}, isAuthenticated);
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
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <p className="text-lg font-semibold">Dataset not found</p>
          <p className="text-sm text-muted-foreground">
            The dataset you are looking for may have been removed.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/datasets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Datasets
          </Link>
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
    downloadModal.open({
      datasetId: dataset.id,
      datasetName: dataset.name,
      price: dataset.is_premium ? null : null,
      formats: [],
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
      ? `${dataset.authors[0].user.first_name} ${dataset.authors[0].user.last_name}`
      : 'Unknown';

  const regions = dataset.origin_region
    ? dataset.origin_region
        .split(',')
        .map((r) => r.trim())
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

        {/* ── Two-column layout (Udemy-style) ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column — header + tabs */}
          <div className="flex-1 min-w-0">
            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {dataset.license && (
                <Badge variant="default">{dataset.license.identifier}</Badge>
              )}
              <Badge variant="secondary">{dataset.category.name}</Badge>
              <Badge variant={dataset.is_premium ? 'outline' : 'secondary'}>
                {dataset.is_premium ? 'Premium' : 'Free'}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              {dataset.name}
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
              <span className="flex items-center gap-1.5 capitalize">
                <HardDrive className="h-3.5 w-3.5" />
                {dataset.dataset_type}
              </span>
              <span className="capitalize">
                Access: {dataset.access.access_type}
              </span>
            </div>

            {/* Tags */}
            {dataset.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {dataset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Mobile sidebar — shown below header, above tabs */}
            <div className="lg:hidden mb-8">
              <SidebarContent
                dataset={dataset}
                onDownload={handleDownload}
                onBookmark={_handleBookmark}
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="mb-8">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="datasheet">Datasheet</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Details tab */}
              <TabsContent value="details" className="mt-4 space-y-8">
                {/* Origin Regions */}
                {regions.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-primary" />
                      Origin Regions
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {regions.map((r) => (
                        <Badge key={r} variant="secondary" className="text-xs">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* License */}
                {dataset.license && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">
                      Usage License
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {dataset.license.name}
                      {dataset.license.description &&
                        `. ${dataset.license.description}`}
                    </p>
                  </div>
                )}

                {/* Authors */}
                {dataset.authors.length > 0 && (
                  <Card>
                    <CardContent className="p-5">
                      <h3 className="text-sm font-semibold mb-3">Authors</h3>
                      <div className="space-y-2">
                        {dataset.authors.map((author) => (
                          <div
                            key={author.user.id}
                            className="flex items-center gap-3"
                          >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {author.user.first_name} {author.user.last_name}
                              </p>
                              {author.user.email && (
                                <p className="text-xs text-muted-foreground">
                                  {author.user.email}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {dataset.access.access_instructions && (
                  <div className="rounded-md border p-3">
                    <p className="text-sm font-medium mb-1">
                      Access Instructions
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {dataset.access.access_instructions}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Datasheet tab */}
              <TabsContent value="datasheet" className="mt-4">
                <DatasheetTab datasheet={dataset.datasheet} />
              </TabsContent>

              {/* Versions tab */}
              <TabsContent value="versions" className="mt-4">
                <PublicVersionsTab datasetId={dataset.id} />
              </TabsContent>

              {/* Reviews tab */}
              <TabsContent value="reviews" className="mt-4">
                <ReviewList reviews={[]} showForm={isAuthenticated} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column — desktop only, sticky */}
          <div className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-6">
              <SidebarContent
                dataset={dataset}
                onDownload={handleDownload}
                onBookmark={_handleBookmark}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar Content ── */

function SidebarContent({
  dataset,
  onDownload,
  onBookmark,
}: Readonly<{
  dataset: MyDatasetInterface;
  onDownload: () => void;
  onBookmark: () => void;
}>) {
  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        {/* Download button */}
        <Button className="w-full" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>

        {/* Bookmark & Share */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onBookmark}>
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

        {/* Summary */}
        <Separator />
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground capitalize">
            Type: {dataset.dataset_type}
          </p>
          <p className="text-muted-foreground">
            Category: {dataset.category.name}
          </p>
          <p className="text-muted-foreground capitalize">
            Access: {dataset.access.access_type}
          </p>
          {dataset.license && (
            <p className="text-muted-foreground">
              License: {dataset.license.identifier}
            </p>
          )}
        </div>

        {/* Dates */}
        <Separator />
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Created: {moment(dataset.created_at).format('MMM D, YYYY')}</p>
          <p>Updated: {moment(dataset.updated_at).format('MMM D, YYYY')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Datasheet Tab ── */

const datasheetFields = [
  { key: 'motivation', label: 'Motivation' },
  { key: 'composition', label: 'Composition' },
  { key: 'collection_process', label: 'Collection Process' },
  { key: 'preprocessing', label: 'Preprocessing' },
  { key: 'uses', label: 'Uses' },
  { key: 'distribution', label: 'Distribution' },
  { key: 'maintenance', label: 'Maintenance' },
] as const;

function DatasheetTab({
  datasheet,
}: Readonly<{ datasheet: MyDatasetInterface['datasheet'] }>) {
  if (!datasheet) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <ClipboardList className="mx-auto mb-3 h-8 w-8" />
        <p className="text-sm font-medium">No datasheet available</p>
        <p className="text-xs mt-1">
          The creator has not added a datasheet for this dataset.
        </p>
      </div>
    );
  }

  const populated = datasheetFields.filter((f) => datasheet[f.key]);

  if (populated.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <ClipboardList className="mx-auto mb-3 h-8 w-8" />
        <p className="text-sm font-medium">Datasheet is empty</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="rounded-md border">
      {populated.map(({ key, label }) => (
        <AccordionItem key={key} value={key}>
          <AccordionTrigger className="px-3 py-3 text-xs font-medium">
            {label}
          </AccordionTrigger>
          <AccordionContent className="px-3">
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {datasheet[key]}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/* ── Public Versions Tab ── */

function PublicVersionsTab({ datasetId }: Readonly<{ datasetId: string }>) {
  const { data: versions, isLoading, isError } = useDatasetVersions(datasetId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-sm">Failed to load versions.</p>
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <GitBranch className="mx-auto mb-3 h-8 w-8" />
        <p className="text-sm font-medium">No versions available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((version) => (
        <Card key={version.id} className="py-0">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold flex items-center gap-1.5">
                  <GitBranch className="h-3.5 w-3.5 text-primary" />
                  {version.version}
                  {version.is_latest && (
                    <Badge variant="secondary" className="text-[10px] ml-1">
                      Latest
                    </Badge>
                  )}
                </p>
                {version.description && (
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {version.description}
                  </p>
                )}
              </div>
            </div>

            {version.files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {version.files.map((file) => (
                  <Badge
                    key={file.id}
                    variant="secondary"
                    className="text-xs gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    {file.file_name}
                    <span className="text-muted-foreground">
                      ({formatBytes(file.file_size)})
                    </span>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
