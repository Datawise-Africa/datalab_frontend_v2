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
  Building2,
  Download,
  Loader2,
  User,
  Calendar,
  HardDrive,
  MapPin,
  Heart,
  Share2,
  FileText,
  ClipboardList,
  GitBranch,
} from 'lucide-react';
import { useDataset, useDatasetVersions } from '~/features/datasets';
import { useReviews } from '~/features/reviews';
import { useToggleBookmark } from '~/features/bookmarks';
import { useTrackView } from '~/hooks/use-track-view';
import { useResumeAfterAuth } from '~/hooks/use-resume-after-auth';
import { DatasetDefaultIllustration } from '~/components/illustrations/dataset-default';
import { shareLink } from '~/lib/utils/share';
import { cn } from '~/lib/utils';
import { useAppModal } from '~/store/slices/modal-slice';
import { useAppSelector } from '~/store';
import { generateSEOTags } from '~/lib/utils/seo';
import { breadcrumbSchema, datasetSchema } from '~/lib/utils/structured-data';
import { apiClient } from '~/lib/api/client';
import { formatBytes } from '~/lib/utils/format';
import type { MyDatasetInterface } from '~/features/my-datasets';
import { getWorkspaceId, getWorkspaceName } from '~/features/my-datasets/types';
import { DatasetSchemaTab } from '~/components/creator-dashboard/dataset-schema-tab';

/** Server-side fetch so meta() has real data for SEO. */
export async function loader({ params }: Route.LoaderArgs) {
  try {
    const { data } = await apiClient.get<MyDatasetInterface>(
      `/datasets/${params.slug}/`
    );
    return { dataset: data };
  } catch {
    return { dataset: null };
  }
}

export function meta({ loaderData: data, params }: Route.MetaArgs) {
  const dataset = data?.dataset as
    | (MyDatasetInterface & {
        dataset_image?: string | null;
        owner?: {
          email?: string;
          first_name?: string;
          last_name?: string;
        } | null;
      })
    | null
    | undefined;
  const slug = params.slug;

  if (!dataset) {
    return generateSEOTags({
      title: 'Dataset not found',
      description:
        'This dataset may have been removed or the URL was mistyped. Browse the full catalog on Datalab Africa.',
      url: `/datasets/${slug}`,
      noIndex: true,
    });
  }

  const description = (dataset.description ?? '')
    .replaceAll(/\s+/g, ' ')
    .trim()
    .slice(0, 160);

  return generateSEOTags({
    title: dataset.name,
    description:
      description || `Explore the ${dataset.name} dataset on Datalab Africa.`,
    url: `/datasets/${slug}`,
    type: 'article',
    image: dataset.dataset_image ?? undefined,
    keywords: dataset.tags?.join(', '),
    jsonLd: [
      datasetSchema({
        id: dataset.id,
        slug,
        name: dataset.name,
        description: dataset.description,
        tags: dataset.tags,
        license: dataset.license
          ? { name: dataset.license.name, url: dataset.license.url }
          : null,
        owner: dataset.owner ?? null,
        created_at: dataset.created_at,
        updated_at: dataset.updated_at,
        dataset_image: dataset.dataset_image ?? null,
      }),
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Datasets', url: '/datasets' },
        { name: dataset.name, url: `/datasets/${slug}` },
      ]),
    ],
  });
}

export default function DatasetDetail({ params }: Route.ComponentProps) {
  const slug = params.slug;
  const { data: dataset, isLoading, isError } = useDataset(slug);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const authModal = useAppModal('auth');
  const downloadModal = useAppModal('download');
  const bookmark = useToggleBookmark(dataset?.id);
  const resumeBookmarkToggle = useResumeAfterAuth<void>(() =>
    bookmark.toggle()
  );
  const { data: reviews } = useReviews(dataset?.id);

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

  const handleDownload = () => {
    const payload = {
      datasetId: dataset.id,
      datasetName: dataset.name,
      price: dataset.is_premium ? null : null,
      formats: [],
      license: dataset.license?.name ?? 'Standard License',
    };
    if (!isAuthenticated) {
      authModal.open({ next: { modal: 'download', payload } });
      return;
    }
    downloadModal.open(payload);
  };

  const handleBookmark = () => resumeBookmarkToggle();

  const authorName =
    dataset.authors.length > 0
      ? `${dataset.authors[0].user.first_name} ${dataset.authors[0].user.last_name}`
      : 'Unknown';
  const workspaceName = getWorkspaceName(dataset.workspace);

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

        {/* Cover image — uploaded by creator, falls back to default illustration */}
        <div className="mb-8 aspect-21/9 w-full overflow-hidden rounded-xl border bg-primary/5">
          {dataset.dataset_image ? (
            <img
              src={dataset.dataset_image}
              alt={dataset.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <DatasetDefaultIllustration />
          )}
        </div>

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
                {workspaceName ? (
                  <>
                    <Building2 className="h-3.5 w-3.5" />
                    {workspaceName}
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5" />
                    {authorName}
                  </>
                )}
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
                onBookmark={handleBookmark}
                isBookmarked={bookmark.isBookmarked}
                isBookmarkPending={bookmark.isPending}
              />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="mb-8">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="datasheet">Datasheet</TabsTrigger>
                <TabsTrigger value="schema">Schema</TabsTrigger>
                <TabsTrigger value="versions">Versions</TabsTrigger>
                <TabsTrigger value="authors">Authors</TabsTrigger>
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
                {!workspaceName && dataset.authors.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Authors
                    </p>
                    <ul className="space-y-1">
                      {dataset.authors.map((author) => (
                        <li key={author.user.id}>
                          <div className="-mx-2 flex items-center gap-3 rounded-md px-2 py-2">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <User className="h-4 w-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {author.user.first_name} {author.user.last_name}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
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

              {/* Schema tab */}
              <TabsContent value="schema" className="mt-4">
                <DatasetSchemaTab
                  schema={dataset.schema}
                  emptyHint="The dataset has not yet declared a structured-file schema."
                />
              </TabsContent>

              {/* Versions tab */}
              <TabsContent value="versions" className="mt-4">
                <PublicVersionsTab datasetId={dataset.id} />
              </TabsContent>

              {/* Authors tab — full credits list; emails hidden for public view */}
              <TabsContent value="authors" className="mt-4">
                {dataset.authors.length === 0 ? (
                  <div className="rounded-md border border-dashed py-12 text-center text-muted-foreground">
                    <User className="mx-auto mb-3 h-8 w-8" />
                    <p className="text-sm font-medium">No authors listed</p>
                  </div>
                ) : (
                  <div className="rounded-md border bg-card">
                    <ul className="divide-y">
                      {dataset.authors.map((author) => (
                        <li
                          key={author.user.id}
                          className="flex items-center gap-4 px-4 py-3"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                              {author.user.first_name} {author.user.last_name}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="shrink-0 text-[10px] uppercase tracking-wide"
                          >
                            {author.role}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>

              {/* Reviews tab — read-only; reviews are submitted from My Downloads */}
              <TabsContent value="reviews" className="mt-4">
                <ReviewList reviews={reviews ?? []} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column — desktop only, sticky */}
          <div className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-6">
              <SidebarContent
                dataset={dataset}
                onDownload={handleDownload}
                onBookmark={handleBookmark}
                isBookmarked={bookmark.isBookmarked}
                isBookmarkPending={bookmark.isPending}
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
  isBookmarked = false,
  isBookmarkPending = false,
}: Readonly<{
  dataset: MyDatasetInterface;
  onDownload: () => void;
  onBookmark: () => void;
  isBookmarked?: boolean;
  isBookmarkPending?: boolean;
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
          <Button
            variant="outline"
            className={cn(
              'flex-1',
              isBookmarked && 'border-red-500 text-red-500'
            )}
            onClick={onBookmark}
            disabled={isBookmarkPending}
            aria-pressed={isBookmarked}
            aria-busy={isBookmarkPending}
          >
            {isBookmarkPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  'mr-1.5 h-4 w-4',
                  isBookmarked && 'fill-red-500 text-red-500'
                )}
              />
            )}
            {isBookmarkPending
              ? isBookmarked
                ? 'Removing bookmark…'
                : 'Bookmarking…'
              : isBookmarked
                ? 'Bookmarked'
                : 'Bookmark'}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              shareLink({
                title: dataset.name,
                text: dataset.description,
                url:
                  typeof globalThis.window !== 'undefined'
                    ? globalThis.window.location.href
                    : '',
              })
            }
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
          {(getWorkspaceName(dataset.workspace) ||
            getWorkspaceId(dataset.workspace)) && (
            <p className="text-muted-foreground">
              Workspace:{' '}
              {getWorkspaceName(dataset.workspace) ??
                getWorkspaceId(dataset.workspace)}
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
