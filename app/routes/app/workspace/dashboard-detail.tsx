import { useParams } from 'react-router';
import type { Route } from './+types/dashboard-detail';
import { generateSEOTags } from '~/lib/utils/seo';
import { DashboardDetail } from '~/components/dashboards/dashboard-detail';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dashboard',
    description: 'Workspace dashboard details',
    noIndex: true,
  });
}

export default function WorkspaceDashboardDetailPage() {
  const { id: workspaceId, dashboardId } = useParams<{
    id: string;
    dashboardId: string;
  }>();
  return (
    <DashboardDetail dashboardId={dashboardId!} workspaceId={workspaceId} />
  );
}
