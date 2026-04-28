import { useParams } from 'react-router';
import type { Route } from './+types/edit-dashboard';
import { generateSEOTags } from '~/lib/utils/seo';
import { DashboardEditor } from '~/components/dashboards/dashboard-editor';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Dashboard',
    description: 'Update a dashboard in your workspace',
    noIndex: true,
  });
}

export default function WorkspaceEditDashboard() {
  const { id: workspaceId, dashboardId } = useParams<{
    id: string;
    dashboardId: string;
  }>();
  return (
    <DashboardEditor
      mode="edit"
      workspaceId={workspaceId}
      dashboardId={dashboardId!}
    />
  );
}
