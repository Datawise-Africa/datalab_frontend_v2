import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { DashboardForm } from '~/components/forms';
import type {
  CreateDashboardFormValues,
  UpdateDashboardFormValues,
} from '~/lib/schema/dashboard-schema';
import {
  useCreateMyDashboard,
  useMyDashboard,
  useUpdateMyDashboard,
} from '~/features/my-dashboards';
import { useDashboardCategories } from '~/features/dashboard-categories';
import {
  useWorkspace,
  useWorkspaceDashboard,
  useCreateWorkspaceDashboard,
  useUpdateWorkspaceDashboard,
} from '~/features/workspaces';

interface BaseProps {
  /** If provided, the dashboard is scoped to this workspace. */
  workspaceId?: string;
}

interface CreateProps extends BaseProps {
  mode: 'create';
}

interface EditProps extends BaseProps {
  mode: 'edit';
  dashboardId: string;
}

export type DashboardEditorProps = CreateProps | EditProps;

export function DashboardEditor(props: Readonly<DashboardEditorProps>) {
  if (props.mode === 'create') {
    return <CreateEditor workspaceId={props.workspaceId} />;
  }
  return (
    <EditEditor
      workspaceId={props.workspaceId}
      dashboardId={props.dashboardId}
    />
  );
}

function listHref(workspaceId?: string) {
  return workspaceId
    ? `/app/workspaces/${workspaceId}/dashboards`
    : '/app/my-dashboards';
}

function CreateEditor({ workspaceId }: Readonly<{ workspaceId?: string }>) {
  const navigate = useNavigate();
  const isWorkspace = !!workspaceId;
  const { data: workspace } = useWorkspace(workspaceId ?? '');
  const { data: categories } = useDashboardCategories();
  const personalCreate = useCreateMyDashboard();
  const workspaceCreate = useCreateWorkspaceDashboard(workspaceId ?? '');
  const createMutation = isWorkspace ? workspaceCreate : personalCreate;

  const defaultValues = useMemo<CreateDashboardFormValues>(
    () => ({
      title: '',
      builder_mode: 'native',
      description: '',
      dashboard_url: '',
      category: null,
      workspace: workspaceId ?? null,
      is_public: false,
      thumbnail: null,
      status: 'DF',
      tags: [],
    }),
    [workspaceId]
  );

  const handleSubmit = async (data: CreateDashboardFormValues) => {
    await createMutation.mutateAsync(
      { ...data, workspace: workspaceId ?? null },
      {
        onSuccess: (dashboard) =>
          navigate(
            data.builder_mode === 'native'
              ? workspaceId
                ? `/app/workspaces/${workspaceId}/dashboards/${dashboard.id}/studio`
                : `/app/my-dashboards/${dashboard.id}/studio`
              : listHref(workspaceId)
          ),
      }
    );
  };

  const scopeLabel = workspaceId
    ? `This dashboard will be scoped to${workspace ? ` "${workspace.name}"` : ' this workspace'}.`
    : 'This dashboard will be published under your personal profile.';

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create Dashboard</h2>
        <p className="text-sm text-muted-foreground">{scopeLabel}</p>
      </div>

      <DashboardForm
        mode="create"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        error={
          createMutation.isError
            ? 'Failed to create dashboard. Please try again.'
            : undefined
        }
        categories={categories?.data ?? []}
      />
    </div>
  );
}

function EditEditor({
  workspaceId,
  dashboardId,
}: Readonly<{ workspaceId?: string; dashboardId: string }>) {
  const navigate = useNavigate();
  const isWorkspace = !!workspaceId;
  const personalQuery = useMyDashboard(isWorkspace ? '' : dashboardId);
  const workspaceQuery = useWorkspaceDashboard(
    workspaceId ?? '',
    isWorkspace ? dashboardId : ''
  );
  const { data: dashboard, isLoading } = isWorkspace
    ? workspaceQuery
    : personalQuery;
  const { data: categories } = useDashboardCategories();
  const personalUpdate = useUpdateMyDashboard();
  const workspaceUpdate = useUpdateWorkspaceDashboard(workspaceId ?? '');
  const updateMutation = isWorkspace ? workspaceUpdate : personalUpdate;

  const defaultValues = useMemo<CreateDashboardFormValues | null>(
    () =>
      dashboard
        ? {
            title: dashboard.title,
            builder_mode: dashboard.builder_mode ?? 'external',
            description: dashboard.description ?? '',
            dashboard_url: dashboard.dashboard_url ?? '',
            category: dashboard.category?.id ?? null,
            workspace: workspaceId ?? dashboard.workspace?.id ?? null,
            is_public: Boolean(dashboard.is_public),
            thumbnail: dashboard.thumbnail ?? null,
            status: dashboard.status,
            tags: dashboard.tags ?? [],
          }
        : null,
    [dashboard, workspaceId]
  );

  if (isLoading || !dashboard || !defaultValues) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  const originalThumbnail = dashboard.thumbnail ?? null;

  const handleSubmit = async (data: UpdateDashboardFormValues) => {
    const { thumbnail, ...rest } = data;
    const payload: UpdateDashboardFormValues = { ...rest };

    // Only send thumbnail when it actually changed:
    // - replaced with a new file (base64 data URL)
    // - explicitly cleared (null)
    // If unchanged (same server URL as loaded), omit to avoid re-posting the URL.
    const isDataUrl =
      typeof thumbnail === 'string' && thumbnail.startsWith('data:');
    if (isDataUrl || thumbnail === null) {
      if (thumbnail !== originalThumbnail) {
        payload.thumbnail = thumbnail;
      }
    }

    await updateMutation.mutateAsync(
      { id: dashboardId, input: payload },
      {
        onSuccess: () => navigate(listHref(workspaceId)),
      }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Edit Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Update details for{' '}
          <span className="font-medium">{dashboard.title}</span>.
        </p>
      </div>

      <DashboardForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        error={
          updateMutation.isError
            ? 'Failed to save changes. Please try again.'
            : undefined
        }
        categories={categories?.data ?? []}
      />
    </div>
  );
}
