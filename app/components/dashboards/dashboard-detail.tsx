import { useState } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import {
  ArrowLeft,
  Pencil,
  Trash2,
  LayoutGrid,
  WandSparkles,
  Loader2,
  Calendar,
  User,
  FolderKanban,
  Send,
  Undo2,
  Archive,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import {
  useMyDashboard,
  useDeleteMyDashboard,
  useUpdateMyDashboard,
} from '~/features/my-dashboards';
import {
  useWorkspaceDashboard,
  useDeleteWorkspaceDashboard,
  useUpdateWorkspaceDashboard,
} from '~/features/workspaces';
import { toastUtils } from '~/lib/utils/toast';
import { resolveMediaUrl } from '~/lib/utils/media-url';
import type { DashboardStatus } from '~/lib/types/dashboard';
import { ValidationStatusPanel } from '~/components/validation/validation-status-panel';
import { isInternalWorkspace } from '~/lib/types/common';

interface Props {
  dashboardId: string;
  /** If present, the detail is scoped inside a workspace. */
  workspaceId?: string;
}

const statusLabel: Record<DashboardStatus, string> = {
  PB: 'Published',
  DF: 'Draft',
  AR: 'Archived',
};

const statusVariant: Record<
  DashboardStatus,
  'default' | 'secondary' | 'outline'
> = {
  PB: 'default',
  DF: 'secondary',
  AR: 'outline',
};

export function DashboardDetail({ dashboardId, workspaceId }: Readonly<Props>) {
  const isWorkspace = !!workspaceId;
  const personalQuery = useMyDashboard(isWorkspace ? '' : dashboardId);
  const workspaceQuery = useWorkspaceDashboard(
    workspaceId ?? '',
    isWorkspace ? dashboardId : ''
  );
  const {
    data: dashboard,
    isLoading,
    isError,
  } = isWorkspace ? workspaceQuery : personalQuery;

  const personalDelete = useDeleteMyDashboard();
  const workspaceDelete = useDeleteWorkspaceDashboard(workspaceId ?? '');
  const deleteMutation = isWorkspace ? workspaceDelete : personalDelete;

  const personalUpdate = useUpdateMyDashboard();
  const workspaceUpdate = useUpdateWorkspaceDashboard(workspaceId ?? '');
  const updateMutation = isWorkspace ? workspaceUpdate : personalUpdate;

  const [copied, setCopied] = useState(false);

  const changeStatus = (status: DashboardStatus) => {
    updateMutation.mutate({ id: dashboardId, input: { status } });
  };

  const listHref = workspaceId
    ? `/app/workspaces/${workspaceId}/dashboards`
    : '/app/my-dashboards';
  const editHref = workspaceId
    ? `/app/workspaces/${workspaceId}/dashboards/${dashboardId}/edit`
    : `/app/my-dashboards/${dashboardId}/edit`;
  const studioHref = workspaceId
    ? `/app/workspaces/${workspaceId}/dashboards/${dashboardId}/studio`
    : `/app/my-dashboards/${dashboardId}/studio`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <LayoutGrid className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Dashboard not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link to={listHref}>Back to dashboards</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm(`Delete "${dashboard.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(dashboard.id);
    }
  };

  const handleCopyUrl = async () => {
    if (!dashboard.dashboard_url) return;
    try {
      await navigator.clipboard.writeText(dashboard.dashboard_url);
      setCopied(true);
      toastUtils.success('URL copied to clipboard');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toastUtils.error('Copy failed', 'Select the URL manually.');
    }
  };

  const ownerName =
    [dashboard.owner?.first_name, dashboard.owner?.last_name]
      .filter(Boolean)
      .join(' ') ||
    dashboard.owner?.email ||
    'Unknown';

  return (
    <div className="space-y-6">
      {/* Top: back link + actions */}
      <div className="flex items-center justify-between gap-2">
        <Link
          to={listHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboards
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {dashboard.builder_mode === 'native' && (
            <Button asChild size="sm">
              <Link to={studioHref}>
                <WandSparkles className="mr-1.5 h-3.5 w-3.5" />
                Open Studio
              </Link>
            </Button>
          )}
          {dashboard.status === 'DF' && (
            <Button
              size="sm"
              onClick={() => changeStatus('PB')}
              disabled={updateMutation.isPending}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {isInternalWorkspace(dashboard.workspace)
                ? 'Publish'
                : 'Submit for review'}
            </Button>
          )}
          {dashboard.status === 'PB' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeStatus('DF')}
                disabled={updateMutation.isPending}
              >
                <Undo2 className="mr-1.5 h-3.5 w-3.5" />
                Unpublish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => changeStatus('AR')}
                disabled={updateMutation.isPending}
              >
                <Archive className="mr-1.5 h-3.5 w-3.5" />
                Archive
              </Button>
            </>
          )}
          {dashboard.status === 'AR' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => changeStatus('DF')}
              disabled={updateMutation.isPending}
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Restore to Draft
            </Button>
          )}

          <Button asChild size="sm" variant="outline">
            <Link to={editHref}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {dashboard.status === 'PB' && (
        <ValidationStatusPanel
          verificationStatus={dashboard.verification_status}
          validation={dashboard.validation}
          validationRequired={!isInternalWorkspace(dashboard.workspace)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-start">
        {dashboard.thumbnail && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted md:w-64 md:shrink-0">
            <img
              src={resolveMediaUrl(dashboard.thumbnail) ?? undefined}
              alt={dashboard.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[dashboard.status]}>
              {statusLabel[dashboard.status]}
            </Badge>
            <Badge variant={dashboard.is_public ? 'outline' : 'secondary'}>
              {dashboard.is_public ? 'Public' : 'Private'}
            </Badge>
            {dashboard.category && (
              <Badge variant="secondary">{dashboard.category.name}</Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {dashboard.title}
          </h1>

          {dashboard.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dashboard.description}
            </p>
          )}

          {dashboard.tags && dashboard.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {dashboard.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meta grid */}
      <Card>
        <CardContent className="grid grid-cols-1 gap-x-6 gap-y-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <MetaItem icon={User} label="Owner" value={ownerName} />
          <MetaItem
            icon={FolderKanban}
            label="Workspace"
            value={dashboard.workspace?.name ?? 'Personal'}
          />
          <MetaItem
            icon={Calendar}
            label="Created"
            value={moment(dashboard.created_at).format('MMM D, YYYY')}
          />
          <MetaItem
            icon={Calendar}
            label="Updated"
            value={moment(dashboard.updated_at).fromNow()}
          />
        </CardContent>
      </Card>

      {/* URL row with copy */}
      {dashboard.dashboard_url && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Dashboard URL
          </p>
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
            <code className="flex-1 truncate text-xs text-muted-foreground">
              {dashboard.dashboard_url}
            </code>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleCopyUrl}
              className="h-7 shrink-0 gap-1.5 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <Separator />

      {/* Inline preview iframe */}
      {dashboard.dashboard_url && (
        <div className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Preview
          </h2>
          <div className="overflow-hidden rounded-lg border bg-muted">
            <iframe
              src={dashboard.dashboard_url}
              title={dashboard.title}
              className="aspect-video w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}>) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
