import { useParams, useSearchParams, Link } from 'react-router';
import moment from 'moment';
import type { Route } from './+types/view-dataset';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { Separator } from '~/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '~/components/ui/accordion';
import {
  ArrowLeft,
  Loader2,
  Pencil,
  User,
  Calendar,
  ClipboardList,
  Globe,
  Archive,
  Undo2,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { useMyDataset, useUpdateMyDatasetStatus } from '~/features/my-datasets';
import type { MyDatasetInterface } from '~/features/my-datasets/types';
import {
  DATASET_STATUS_LABELS,
  DATASET_STATUS_VARIANTS,
  getWorkspaceId,
  getWorkspaceName,
} from '~/features/my-datasets/types';
import { VersionsTab } from '~/components/creator-dashboard/dataset-versions';
import { DatasetSchemaTab } from '~/components/creator-dashboard/dataset-schema-tab';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'View Dataset',
    description: 'View dataset details',
  });
}

export default function ViewDataset() {
  const { id: datasetId } = useParams() as { id: string };
  const [searchParams] = useSearchParams();
  const workspaceParam = searchParams.get('workspace');
  return (
    <ViewDatasetView
      datasetId={datasetId}
      workspaceIdOverride={workspaceParam}
    />
  );
}

interface ViewDatasetViewProps {
  datasetId: string;
  /** When provided (workspace-scoped routes), wins over dataset.workspace. */
  workspaceIdOverride?: string | null;
  /** Workspace-scoped routes already render a workspace header; suppress back. */
  hideBack?: boolean;
}

export function ViewDatasetView({
  datasetId,
  workspaceIdOverride,
  hideBack,
}: Readonly<ViewDatasetViewProps>) {
  const { data: dataset, isLoading } = useMyDataset(datasetId);

  const workspaceId =
    workspaceIdOverride ?? getWorkspaceId(dataset?.workspace) ?? null;
  const backHref = workspaceId
    ? `/app/workspaces/${workspaceId}/datasets`
    : '/app/creator-dashboard';
  const editHref = workspaceId
    ? `/app/edit-dataset/${datasetId}?workspace=${workspaceId}`
    : `/app/edit-dataset/${datasetId}`;

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!hideBack && (
              <Button variant="ghost" size="icon" asChild>
                <Link to={backHref}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <h1 className="text-2xl font-bold">Dataset Details</h1>
          </div>
          {dataset && (
            <div className="flex items-center gap-2">
              <StatusActions dataset={dataset} />
              <Button asChild size="sm" variant="outline">
                <Link to={editHref}>
                  <Pencil className="mr-1.5 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !dataset && (
          <div className="py-20 text-center text-muted-foreground">
            Dataset not found.
          </div>
        )}

        {dataset && <DatasetContent dataset={dataset} />}
      </div>
    </Protect>
  );
}

function DatasetContent({
  dataset,
}: Readonly<{ dataset: MyDatasetInterface }>) {
  const regions = dataset.origin_region
    ? dataset.origin_region
        .split(',')
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <DatasetHero dataset={dataset} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <main className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="versions">
            <TabsList>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
              <TabsTrigger value="datasheet">Datasheet</TabsTrigger>
            </TabsList>

            <TabsContent value="versions" className="mt-4">
              <VersionsTab datasetId={dataset.id} />
            </TabsContent>

            <TabsContent value="schema" className="mt-4">
              <DatasetSchemaTab schema={dataset.schema} />
            </TabsContent>

            <TabsContent value="datasheet" className="mt-4">
              <DatasheetTab dataset={dataset} />
            </TabsContent>
          </Tabs>
        </main>

        <aside className="space-y-4">
          <AboutCard dataset={dataset} regions={regions} />
          <LicenseCard dataset={dataset} />
          <AuthorsCard dataset={dataset} />
        </aside>
      </div>
    </div>
  );
}

/* ── Hero (title + badges + description + tags) ── */

function DatasetHero({ dataset }: Readonly<{ dataset: MyDatasetInterface }>) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            'text-xs font-medium',
            DATASET_STATUS_VARIANTS[dataset.status]
          )}
        >
          {DATASET_STATUS_LABELS[dataset.status]}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {dataset.dataset_type}
        </Badge>
        {dataset.is_premium && (
          <Badge className="bg-primary text-white">Premium</Badge>
        )}
        {dataset.is_private && (
          <Badge variant="outline" className="text-muted-foreground">
            Private
          </Badge>
        )}
      </div>
      <h2 className="text-xl font-bold tracking-tight">{dataset.name}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {dataset.description}
      </p>
      {dataset.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {dataset.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Sidebar Cards ── */

function AboutCard({
  dataset,
  regions,
}: Readonly<{ dataset: MyDatasetInterface; regions: string[] }>) {
  const workspaceName = getWorkspaceName(dataset.workspace);
  const workspaceId = getWorkspaceId(dataset.workspace);

  return (
    <section className="rounded-xl border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold">About</h3>
      <dl className="space-y-2.5 text-xs">
        <Field label="Category">{dataset.category.name}</Field>
        <Field label="Access" className="capitalize">
          {dataset.access.access_type}
        </Field>
        {(workspaceName || workspaceId) && (
          <Field label="Workspace">
            {workspaceId ? (
              <Link
                to={`/app/workspaces/${workspaceId}/datasets`}
                className="text-primary hover:underline"
              >
                {workspaceName ?? workspaceId}
              </Link>
            ) : (
              workspaceName
            )}
          </Field>
        )}
        {regions.length > 0 && (
          <Field label="Origin">
            <div className="flex flex-wrap gap-1">
              {regions.map((r) => (
                <Badge key={r} variant="secondary" className="text-[10px]">
                  {r}
                </Badge>
              ))}
            </div>
          </Field>
        )}
        <Separator className="my-2" />
        <Field label="Created" icon={<Calendar className="h-3 w-3" />}>
          {moment(dataset.created_at).format('MMM D, YYYY')}
        </Field>
        <Field label="Updated" icon={<Calendar className="h-3 w-3" />}>
          {moment(dataset.updated_at).format('MMM D, YYYY')}
        </Field>
      </dl>

      {dataset.access.access_instructions && (
        <>
          <Separator className="my-3" />
          <p className="mb-1 text-xs font-medium">Access instructions</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {dataset.access.access_instructions}
          </p>
        </>
      )}
    </section>
  );
}

function LicenseCard({ dataset }: Readonly<{ dataset: MyDatasetInterface }>) {
  if (!dataset.license) return null;
  const flags = [
    { label: 'Commercial use', on: dataset.license.allows_commercial_use },
    { label: 'Modification', on: dataset.license.allows_modification },
    { label: 'Attribution', on: dataset.license.requires_attribution },
    { label: 'Redistribution', on: dataset.license.allows_redistribution },
    { label: 'Share-alike', on: dataset.license.requires_share_alike },
  ].filter((f) => f.on);

  return (
    <section className="rounded-xl border bg-card p-5">
      <h3 className="mb-1 text-sm font-semibold">License</h3>
      <p className="text-sm font-medium">{dataset.license.name}</p>
      {dataset.license.description && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {dataset.license.description}
        </p>
      )}
      {flags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {flags.map((f) => (
            <Badge key={f.label} variant="secondary" className="text-[10px]">
              {f.label}
            </Badge>
          ))}
        </div>
      )}
    </section>
  );
}

function AuthorsCard({ dataset }: Readonly<{ dataset: MyDatasetInterface }>) {
  if (dataset.authors.length === 0) return null;
  return (
    <section className="rounded-xl border bg-card p-5">
      <h3 className="mb-3 text-sm font-semibold">Authors</h3>
      <div className="space-y-3">
        {dataset.authors.map((author) => (
          <div key={author.user.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {author.user.first_name} {author.user.last_name}
              </p>
              {author.user.email && (
                <p className="truncate text-xs text-muted-foreground">
                  {author.user.email}
                </p>
              )}
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {author.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  className,
  icon,
}: Readonly<{
  label: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}>) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="flex items-center gap-1 text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className={cn('text-right font-medium', className)}>{children}</dd>
    </div>
  );
}

/* ── Status Actions ── */

function StatusActions({ dataset }: Readonly<{ dataset: MyDatasetInterface }>) {
  const statusMutation = useUpdateMyDatasetStatus();
  const isPending = statusMutation.isPending;

  const handleStatusChange = (newStatus: MyDatasetInterface['status']) => {
    statusMutation.mutate({ id: dataset.id, status: newStatus });
  };

  return (
    <>
      {dataset.status === 'DF' && (
        <>
          <Button
            size="sm"
            variant="default"
            disabled={isPending}
            onClick={() => handleStatusChange('PB')}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Globe className="mr-1.5 h-4 w-4" />
            )}
            Publish
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => handleStatusChange('AR')}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Archive className="mr-1.5 h-4 w-4" />
            )}
            Archive
          </Button>
        </>
      )}
      {dataset.status === 'PB' && (
        <>
          <Button
            size="sm"
            variant="outline"
            disabled={isPending}
            onClick={() => handleStatusChange('DF')}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Undo2 className="mr-1.5 h-4 w-4" />
            )}
            Unpublish
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={isPending}
            onClick={() => handleStatusChange('AR')}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <Archive className="mr-1.5 h-4 w-4" />
            )}
            Archive
          </Button>
        </>
      )}
      {dataset.status === 'AR' && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => handleStatusChange('DF')}
        >
          {isPending ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Undo2 className="mr-1.5 h-4 w-4" />
          )}
          Restore to Draft
        </Button>
      )}
    </>
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

function DatasheetTab({ dataset }: Readonly<{ dataset: MyDatasetInterface }>) {
  if (!dataset.datasheet) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-8 w-8" />}
        title="No datasheet available"
        description="Edit this dataset to add documentation following the Datasheets for Datasets framework."
      />
    );
  }

  const populated = datasheetFields.filter((f) => dataset.datasheet![f.key]);

  if (populated.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-8 w-8" />}
        title="Datasheet is empty"
        description="Edit this dataset to fill in the datasheet fields."
      />
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
            <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
              {dataset.datasheet![key]}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/* ── Empty State ── */

function EmptyState({
  icon,
  title,
  description,
}: Readonly<{
  icon: React.ReactNode;
  title: string;
  description: string;
}>) {
  return (
    <div className="rounded-md border border-dashed py-12 text-center text-muted-foreground">
      <div className="mx-auto mb-3">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs">{description}</p>
    </div>
  );
}
