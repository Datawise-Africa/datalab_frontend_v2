import { useParams } from 'react-router';
import type { Route } from './+types/my-dashboard-detail';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { DashboardDetail } from '~/components/dashboards/dashboard-detail';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'Dashboard',
    description: 'Dashboard details',
    noIndex: true,
  });
}

export default function MyDashboardDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Protect roles={['creator', 'admin']}>
      <DashboardDetail dashboardId={id!} />
    </Protect>
  );
}
