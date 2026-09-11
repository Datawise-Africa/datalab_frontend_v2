import { Outlet } from 'react-router';
import { Protect } from '~/components/auth/protect';

export const meta = () => [{ name: 'robots', content: 'noindex, nofollow' }];

// Full-screen editor chrome: no app sidebar/header, the studio owns the viewport.
export default function StudioLayout() {
  return (
    <Protect>
      <div className="h-dvh overflow-hidden bg-background">
        <Outlet />
      </div>
    </Protect>
  );
}
