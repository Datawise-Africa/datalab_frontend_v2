import { useParams } from 'react-router';
import { DashboardStudio } from '~/components/dashboard-studio/dashboard-studio';
export default function WorkspaceDashboardStudioPage() {
  const { id, dashboardId } = useParams<{ id: string; dashboardId: string }>();
  return <DashboardStudio dashboardId={dashboardId!} workspaceId={id} />;
}
