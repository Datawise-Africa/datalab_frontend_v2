import type { Route } from './+types/my-dashboards';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { DashboardsTable } from '~/components/dashboards/dashboards-table';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'My Dashboards',
    description: 'Dashboards you have published on Datalab Africa',
    noIndex: true,
  });
}

export default function MyDashboardsPage() {
  return (
    <Protect roles={['creator', 'admin']}>
      <DashboardsTable />
    </Protect>
  );
}
