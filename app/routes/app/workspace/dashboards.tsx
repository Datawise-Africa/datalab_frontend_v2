import { useParams } from 'react-router';
import { DashboardsTable } from '~/components/dashboards/dashboards-table';

export default function WorkspaceDashboardsPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <DashboardsTable
      workspaceId={id}
      title="Dashboards"
      description="Dashboards shared in this workspace"
    />
  );
}
