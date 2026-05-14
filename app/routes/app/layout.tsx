import { Outlet } from 'react-router';
import { Protect } from '~/components/auth/protect';
import { DashboardSidebar } from '~/components/dashboard/dashboard-sidebar';
import { DashboardMobileNav } from '~/components/dashboard/dashboard-mobile-nav';

export default function AppLayout() {
  return (
    <Protect>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mobile nav */}
        <div className="mb-4 lg:hidden">
          <DashboardMobileNav />
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <DashboardSidebar className="hidden lg:block" />

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </Protect>
  );
}
