import { useParams } from 'react-router';
import { Protect } from '~/components/auth/protect';
import { DashboardStudio } from '~/components/dashboard-studio/dashboard-studio';
export default function DashboardStudioPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Protect roles={['creator', 'admin']}>
      <DashboardStudio dashboardId={id!} />
    </Protect>
  );
}
