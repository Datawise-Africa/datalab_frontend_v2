import { useParams } from 'react-router';
import type { Route } from './+types/create-dashboard';
import { generateSEOTags } from '~/lib/utils/seo';
import { DashboardEditor } from '~/components/dashboards/dashboard-editor';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'New Dashboard',
    description: 'Add a dashboard to your workspace',
    noIndex: true,
  });
}

export default function WorkspaceCreateDashboard() {
  const { id: workspaceId } = useParams<{ id: string }>();
  return <DashboardEditor mode="create" workspaceId={workspaceId} />;
}
