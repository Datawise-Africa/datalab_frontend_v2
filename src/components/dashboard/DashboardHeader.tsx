import { Menu } from 'lucide-react';
import { DashboardNavTab } from './DashboardNavTab';
import { Button } from '../ui/button';
import { navigation } from '@/constants';
import { Link } from 'react-router-dom';

type DashboardHeaderProps = {
  isMobile: boolean;
  toggleSidebar: () => void;
};

export default function DashboardHeader({
  isMobile,
  toggleSidebar,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>
          )}

          {/* Logo */}
          <div className="flex items-center">
            <div className="w-36 h-10 bg-gradient-to-r rounded-lg flex items-center justify-center">
              <Link to={'/'} className="text-white font-bold text-sm">
                <img
                  src={'/assets/Datawise.svg'}
                  alt="Datawise logo"
                  loading="lazy"
                  width={144}
                  height={16}
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section - Navigation Tabs */}
        <div className="flex items-center space-x-1">
          {navigation.map((item) => (
            <DashboardNavTab
              key={item.id}
              icon={item.icon}
              label={item.title}
              href={item.url}
              showLabel={!isMobile}
            />
          ))}

          {/* Additional Tabs */}
          {/* <DashboardNavTab
            icon={<Database size={18} />}
            href="/"
            showLabel={!isMobile}
            label="Datasets"
          />
          <DashboardNavTab
            icon={<LayoutDashboard size={18} />}
            label="Dashboards"
            href="/data-dashboards"
            showLabel={!isMobile}
          />
          <DashboardNavTab
            icon={<FileText size={18} />}
            label="Reports"
            href="/reports"
            showLabel={!isMobile}
          /> */}
        </div>
      </div>
    </header>
  );
}
