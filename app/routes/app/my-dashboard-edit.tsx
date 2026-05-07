import { useParams } from 'react-router';
import type { Route } from './+types/my-dashboard-edit';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { DashboardEditor } from '~/components/dashboards/dashboard-editor';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Edit Dashboard',
    description: 'Update a dashboard on Datalab Africa',
    noIndex: true,
  });
}

export default function MyDashboardEditPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Protect roles={['creator', 'admin']}>
      <DashboardEditor mode="edit" dashboardId={id!} />
    </Protect>
  );
}
