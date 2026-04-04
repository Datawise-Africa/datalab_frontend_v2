import { useParams, Link } from 'react-router';
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
  BookOpen,
  ClipboardList,
  Globe,
  Archive,
  Undo2,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { useMyDataset, useUpdateMyDatasetStatus } from '~/features/my-datasets';
import type { MyDatasetInterface } from '~/features/my-datasets';
import {
  DATASET_STATUS_LABELS,
  DATASET_STATUS_VARIANTS,
} from '~/features/my-datasets/types';
import { VersionsTab } from '~/components/creator-dashboard/dataset-versions';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'View Dataset',
    description: 'View dataset details',
  });
}

export default function ViewDataset() {
  const { id: datasetId } = useParams() as { id: string };
  const { data: dataset, isLoading } = useMyDataset(datasetId);

  return (
    <Protect roles={['creator', 'admin']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/app/creator-dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Dataset Details</h1>
          </div>
          {dataset && (
            <div className="flex items-center gap-2">
              <StatusActions dataset={dataset} />
              <Button asChild size="sm" variant="outline">
                <Link to={`/app/edit-dataset/${datasetId}`}>
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
  const authorName =
    dataset.authors.length > 0
      ? `${dataset.authors[0].user.first_name} ${dataset.authors[0].user.last_name}`
      : 'Unknown';

  return (
    <div className="space-y-6">
      {/* Title + badges */}
      <div>
        <div className="flex items-center gap-2 mb-2">
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
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Updated: {moment(dataset.updated_at).format('YYYY-MM-DD')}
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          {dataset.description}
        </p>
      </div>

      {/* Tags */}
      {dataset.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {dataset.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Origin Regions */}
      {dataset.origin_region && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">
            Origin Regions:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dataset.origin_region
              .split(',')
              .map((r) => r.trim())
              .filter(Boolean)
              .map((region) => (
                <Badge key={region} variant="secondary" className="text-xs">
                  {region}
                </Badge>
              ))}
          </div>
        </div>
      )}

      {/* Category + Access */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          Category: {dataset.category.name}
        </span>
        <span className="capitalize">Access: {dataset.access.access_type}</span>
        {dataset.workspace && <span>Workspace: {dataset.workspace.name}</span>}
      </div>

      {dataset.access.access_instructions && (
        <div className="rounded-md border p-3">
          <p className="text-xs font-medium mb-1">Access Instructions</p>
          <p className="text-xs text-muted-foreground">
            {dataset.access.access_instructions}
          </p>
        </div>
      )}

      <Separator />

      {/* License */}
      {dataset.license && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Usage License</h3>
          <p className="text-xs text-muted-foreground">
            {dataset.license.name}
            {dataset.license.description && (
              <span className="block mt-1">{dataset.license.description}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {dataset.license.allows_commercial_use && (
              <Badge variant="secondary" className="text-xs">
                Commercial use
              </Badge>
            )}
            {dataset.license.allows_modification && (
              <Badge variant="secondary" className="text-xs">
                Modification
              </Badge>
            )}
            {dataset.license.requires_attribution && (
              <Badge variant="secondary" className="text-xs">
                Attribution required
              </Badge>
            )}
            {dataset.license.allows_redistribution && (
              <Badge variant="secondary" className="text-xs">
                Redistribution
              </Badge>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Authors */}
      {dataset.authors.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Authors</h3>
          <div className="space-y-2">
            {dataset.authors.map((author) => (
              <div key={author.user.id} className="flex items-center gap-3">
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
                  <p className="text-xs text-muted-foreground capitalize">
                    {author.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dates */}
      <Separator />
      <div className="flex gap-6 text-xs text-muted-foreground">
        <span>Created: {moment(dataset.created_at).format('YYYY-MM-DD')}</span>
        <span>Updated: {moment(dataset.updated_at).format('YYYY-MM-DD')}</span>
      </div>

      {/* ── Datasheet & Versions Tabs ── */}
      <Separator />
      <Tabs defaultValue="datasheet">
        <TabsList>
          <TabsTrigger value="datasheet">Datasheet</TabsTrigger>
          <TabsTrigger value="versions">Versions</TabsTrigger>
        </TabsList>

        <TabsContent value="datasheet">
          <DatasheetTab dataset={dataset} />
        </TabsContent>

        <TabsContent value="versions">
          <VersionsTab datasetId={dataset.id} />
        </TabsContent>
      </Tabs>
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
      {/* Draft -> Published / Archived */}
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

      {/* Published -> Draft / Archived */}
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

      {/* Archived -> Draft */}
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
      <div className="py-12 text-center text-muted-foreground">
        <ClipboardList className="mx-auto mb-3 h-8 w-8" />
        <p className="text-sm font-medium">No datasheet available</p>
        <p className="text-xs mt-1">
          Edit this dataset to add documentation following the Datasheets for
          Datasets framework.
        </p>
      </div>
    );
  }

  const populated = datasheetFields.filter((f) => dataset.datasheet![f.key]);

  if (populated.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <ClipboardList className="mx-auto mb-3 h-8 w-8" />
        <p className="text-sm font-medium">Datasheet is empty</p>
        <p className="text-xs mt-1">
          Edit this dataset to fill in the datasheet fields.
        </p>
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
              {dataset.datasheet![key]}
            </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
