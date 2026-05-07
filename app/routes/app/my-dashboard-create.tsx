import type { Route } from './+types/my-dashboard-create';
import { generateSEOTags } from '~/lib/utils/seo';
import { Protect } from '~/components/auth/protect';
import { DashboardEditor } from '~/components/dashboards/dashboard-editor';

export function meta(_args: Route.MetaArgs) {
  return generateSEOTags({
    title: 'New Dashboard',
    description: 'Publish a new dashboard on Datalab Africa',
    noIndex: true,
  });
}

export default function MyDashboardCreatePage() {
  return (
    <Protect roles={['creator', 'admin']}>
      <DashboardEditor mode="create" />
    </Protect>
  );
}
