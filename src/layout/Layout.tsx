import { Outlet } from 'react-router-dom';
import useSidebar from '@/hooks/use-sidebar';
import useSidebarLinks from '@/hooks/use-sidebar-links';
import LayoutSidebar from '@/components/dashboard/LayoutSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { cn } from '@/lib/utils';
// import { useAuth } from '@/context/AuthProvider';

export default function Dashboard() {
  const sidebarState = useSidebar();
  const { links } = useSidebarLinks();
  const { isMobile, isCollapsed, toggleSidebar } = sidebarState;
  // const auth = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <LayoutSidebar links={links} {...sidebarState} />

      {/* Main Content Area */}
      <div
        //   className={`
        //   flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out
        //   ${isMobile ? 'w-full' : ''}
        //   ${!isMobile && isCollapsed ? 'ml-0' : ''}
        // `}
        className={cn(
          'flex-1 flex flex-col overflow-hidden transition-all duration-200 ease-in-out',
          {
            'w-full': isMobile,
            'ml-0': !isMobile && isCollapsed,
          },
        )}
      >
        {/* Header */}
        <DashboardHeader isMobile={isMobile} toggleSidebar={toggleSidebar} />
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className=" h-full">
            {/* Content Container */}
            <div className="h-full bg-white ">
              <div className="p-4">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
