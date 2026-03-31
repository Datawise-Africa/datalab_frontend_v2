import moment from 'moment';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { Badge } from '~/components/ui/badge';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { Loader2 } from 'lucide-react';
import {
  Star,
  User,
  Calendar,
  HardDrive,
  CheckCircle2,
  Globe,
  Building2,
  GraduationCap,
  Landmark,
  FileText,
  MapPin,
  BookOpen,
  Eye,
  Download,
} from 'lucide-react';
import { useDataset } from '~/features/datasets';
import type { IDataset } from '~/lib/types/dataset';

interface DatasetPreviewModalProps {
  datasetId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export function DatasetPreviewModal({
  datasetId,
  open,
  onOpenChange,
}: DatasetPreviewModalProps) {
  const { data: dataset, isLoading } = useDataset(datasetId ?? '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Dataset Preview
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading preview...
            </span>
          </div>
        )}

        {!isLoading && !dataset && (
          <div className="py-12 text-center text-muted-foreground">
            Dataset not found.
          </div>
        )}

        {dataset && <PreviewContent dataset={dataset} />}
      </DialogContent>
    </Dialog>
  );
}

function PreviewContent({ dataset }: { dataset: IDataset }) {
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
    <div className="space-y-6">
      {/* Status banner for drafts */}
      {dataset.status && dataset.status !== 'PB' && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200">
          This dataset is currently{' '}
          <strong>{dataset.status === 'DF' ? 'a draft' : 'archived'}</strong>{' '}
          and not visible to the public.
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {dataset.is_premium ? (
            <Badge className="bg-primary text-white">
              ${dataset.price ?? 0}
            </Badge>
          ) : (
            <Badge variant="secondary">Free</Badge>
          )}
          {dataset.is_private && (
            <Badge variant="outline" className="text-muted-foreground">
              Private
            </Badge>
          )}
        </div>
        <h2 className="text-xl font-bold tracking-tight">{dataset.title}</h2>
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            {authorName}
          </span>
          {dataset.average_review > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {dataset.average_review.toFixed(1)} ({dataset.review_count})
            </span>
          )}
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

      {/* Audience */}
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1.5">
          Available to:
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {Object.entries(dataset.intended_audience)
            .filter(([, v]) => v)
            .map(([key]) => {
              const Icon = audienceIcons[key] ?? Globe;
              const label = audienceLabels[key] ?? key;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                </span>
              );
            })}
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          Updated: {moment(dataset.updated_at).format('YYYY-MM-DD')}
        </span>
        {dataset.data_file_types && (
          <span className="flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5" />
            {dataset.data_file_types} ({dataset.size_bytes})
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" />
          {formatNumber(dataset.views_count)} views
        </span>
        <span className="flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" />
          {formatNumber(dataset.download_count)} downloads
        </span>
      </div>

      <Separator />

      {/* Files */}
      {dataset.data_files.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">File Information</h3>
          <div className="grid grid-cols-2 gap-2">
            {dataset.data_files.map((file) => (
              <Card key={file.id} className="py-0">
                <CardContent className="flex items-center gap-2 p-3">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">
                      {file.file_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {file.file_size_display}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regions + Keywords */}
      {(regions.length > 0 || keywords.length > 0) && (
        <div className="grid grid-cols-2 gap-6">
          {regions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Covered Regions
              </h3>
              <ul className="space-y-1">
                {regions.map((r) => (
                  <li
                    key={r}
                    className="text-xs text-muted-foreground flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {keywords.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                Keywords
              </h3>
              <ul className="space-y-1">
                {keywords.map((k) => (
                  <li
                    key={k}
                    className="text-xs text-muted-foreground flex items-center gap-1.5"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary shrink-0" />
                    {k}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* License */}
      {dataset.license && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold mb-1">Usage License</h3>
            <p className="text-xs text-muted-foreground">
              {dataset.license.name}
              {dataset.license.description && (
                <span className="block mt-1">
                  {dataset.license.description}
                </span>
              )}
            </p>
          </div>
        </>
      )}

      {/* Author info */}
      {dataset.authors.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold mb-2">Author Information</h3>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{authorName}</p>
                {authorAffiliation && (
                  <p className="text-xs text-muted-foreground">
                    {authorAffiliation}
                  </p>
                )}
                {authorEmail && (
                  <p className="text-xs text-muted-foreground">{authorEmail}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Stats */}
      <Separator />
      <div>
        <h3 className="text-sm font-semibold mb-2">Dataset Insights</h3>
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Views" value={formatNumber(dataset.views_count)} />
          <StatCard
            label="Downloads"
            value={formatNumber(dataset.download_count)}
          />
          <StatCard
            label="Avg Rating"
            value={
              dataset.average_review > 0
                ? dataset.average_review.toFixed(1)
                : 'N/A'
            }
          />
          <StatCard
            label="Reviews"
            value={formatNumber(dataset.review_count)}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-2.5 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
