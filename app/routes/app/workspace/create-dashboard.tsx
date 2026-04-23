import { useNavigate, useParams } from 'react-router';
import type { Route } from './+types/create-dashboard';
import { generateSEOTags } from '~/lib/utils/seo';
import { DashboardForm } from '~/components/forms';
import type { CreateDashboardFormValues } from '~/lib/schema/dashboard-schema';
import { useCreateMyDashboard } from '~/features/my-dashboards';
import { useDashboardCategories } from '~/features/dashboard-categories';
import { useWorkspace } from '~/features/workspaces';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'New Dashboard',
    description: 'Add a dashboard to your workspace',
  });
}

export default function WorkspaceCreateDashboard() {
  const { id: workspaceId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: workspace } = useWorkspace(workspaceId!);
  const { data: categories } = useDashboardCategories();
  const createDashboard = useCreateMyDashboard();

  const defaultValues: CreateDashboardFormValues = {
    title: '',
    description: '',
    dashboard_url: '',
    category: null,
    workspace: workspaceId,
    is_public: false,
    thumbnail: null,
    status: 'DF',
    tags: [],
  };

  const handleSubmit = async (data: CreateDashboardFormValues) => {
    await createDashboard.mutateAsync(
      { ...data, workspace: workspaceId },
      {
        onSuccess: () => {
          navigate(`/app/workspaces/${workspaceId}/dashboards`);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Create Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          This dashboard will be scoped to
          {workspace ? ` "${workspace.name}"` : ' this workspace'}.
        </p>
      </div>

      <DashboardForm
        mode="create"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={createDashboard.isPending}
        error={
          createDashboard.isError
            ? 'Failed to create dashboard. Please try again.'
            : undefined
        }
        categories={categories?.data ?? []}
      />
    </div>
  );
}
