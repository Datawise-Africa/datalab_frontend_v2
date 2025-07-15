import { useState } from 'react';
import { Menu, Compass, Bookmark, ChevronRight } from 'lucide-react';
import { X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/designs/Button';
import { cn } from '@/lib/utils';
import { AuthPerm } from '@/lib/auth/perm';
import { useAuthContext } from '@/context/AuthProvider';
import { useAuth } from '@/store/auth-store';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const authPerm = AuthPerm.getInstance();
  const { setIsAuthModalOpen, queue: authQueue } = useAuthContext();
  const { is_authenticated, logout ,user} = useAuth();
  const navigate = useNavigate();
  // const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    // handleAuthModalToggle();
    if (!is_authenticated) {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
  };
  // useEffect(() => {
  //   if (!state.userId) {
  //     console.log("User is logged out");
  //   }
  // }, [state.userId]);

  const handleBecomeDatasetCreator = () => {
    // handleAuthModalToggle();
    if (!is_authenticated) {
      authQueue.addToQueue({
        function: navigate,
        args: ['/become-dataset-creator'],
      });
      setIsAuthModalOpen(true);
    } else {
      navigate('/become-dataset-creator');
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-20 lg:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="bg-red rounded p-2 text-black"
        >
          <Menu size={24} />
        </button>
      </div>

      <aside
        className={`font-Sora z-10 h-[calc(100vh-3rem)] bg-[#FFFFFF] p-4 text-[#0F4539] transition-all duration-300 ${collapsed ? 'w-16' : 'w-72'} ${isOpen ? 'block' : 'hidden'} fixed top-12 left-0 lg:static lg:block`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="mt-6 mb-6 inline-flex items-center gap-2 self-end text-[#BBBBBB] md:self-start"
        >
          {collapsed ? (
            <img
              src={'/assets/datalab/collapseicon.png'}
              alt="Collapse"
              className="h-6 w-6"
            />
          ) : (
            <>
              <img
                src={'/assets/datalab/collapseicon.png'}
                alt="Collapse"
                className="h-6 w-6"
              />{' '}
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Auth & Upload Buttons */}
        <div className="mb-8">
          {user?.user_id ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className={`${
                  collapsed ? 'p-2' : 'px-4 py-2'
                } mb-4 flex w-full items-center justify-between rounded bg-[#FAFAFA] text-[#0F4539]`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={'/assets/datalab/AuthIcon.png'}
                    alt="User Icon"
                    className="mt-1 h-8 w-8"
                  />
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium text-gray-500">
                        {user.user_role}
                      </span>
                      <span className="text-sm font-semibold">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <ChevronRight size={18} className="text-gray-400" />
                )}
              </button>

              {showUserMenu && !collapsed && (
                <div className="absolute left-0 z-10 mt-1 w-full rounded border bg-white shadow">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100">
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className={`${
                collapsed ? 'p-2' : 'px-4 py-2'
              } mb-4 flex w-full items-center justify-between rounded bg-[#FAFAFA] text-[#0F4539]`}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={'/assets/datalab/AuthIcon.png'}
                  alt="User Icon"
                  className="mt-1 h-8 w-8"
                />
                {!collapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                      Log In / Sign Up
                    </span>
                    <span className="text-xs text-gray-500">
                      Log in to your account
                    </span>
                  </div>
                )}
              </div>
              {!collapsed && (
                <ChevronRight size={18} className="text-gray-400" />
              )}
            </button>
          )}

          {is_authenticated &&
            authPerm.hasPermission('dataset_creator', user!.user_role) && (
              <Link
                to={'/app/dataset-creator-dashboard'}
                className={`mb-8 flex w-full items-center justify-center rounded bg-gradient-to-b from-[#115443] to-[#26A37E] text-white ${
                  collapsed ? 'p-2' : 'px-4 py-2'
                }`}
              >
                <img
                  src={'/assets/datalab/uploadicon.png'}
                  alt="Upload Icon"
                  className={`h-4 w-4 ${!collapsed ? 'mr-2' : ''}`}
                />
                {!collapsed && 'Upload Dataset'}ss
              </Link>
            )}
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-4">
          <SidebarItem
            className="bg-[#FFFFFF] hover:bg-[#E6FAF0]"
            icon={<Compass size={20} />}
            label="Discover"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Bookmark size={20} />}
            label="Saved Items"
            collapsed={collapsed}
          />
          <SidebarItem
            label="Dataset Creator"
            collapsed={collapsed}
            icon={
              <img
                src={'/assets/datasetcreator.png'}
                alt="User Icon"
                className="mt-1 h-5 w-5"
              />
            }
          />
        </nav>
        {/* <div className="mt-90" >
        <h4> Become a Dataset Creator </h4>
        <p>
        Share your data with the world, track engagement, and earn from premium datasets. Apply now to get started!
        </p>
       <button
          className="mt-auto  bg-gradient-to-b from-[#115443] to-[#26A37E] text-white px-4 py-2 rounded mb-4 w-full flex items-center justify-center"
        >
          <FilePlus size={18} className="mr-2" />
          {!collapsed && "Become A Dataset Creator"}
        </button>
       </div> */}
        {!collapsed && (
          <div className="relative mt-40 rounded bg-[#E6FAF0]">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => console.log('Dismiss clicked')}
            >
              <X size={18} />
            </button>
            <div className="px-2 py-4">
              <h4 className="mb-2 text-base font-semibold text-[#188366]">
                Become a Dataset Creator
              </h4>
              <p className="mb-4 text-sm">
                Share your data with the world, track engagement, and earn from
                premium datasets. Apply now to get started!
              </p>
            </div>
            <Button
              onClick={handleBecomeDatasetCreator}
              className="flex w-full items-center justify-center gap-2 rounded"
            >
              {/*<FilePlus size={18} className="" />*/}
              Become A Dataset Creator
            </Button>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0 bg-black opacity-50 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  className?: string;
};
function SidebarItem({ icon, label, collapsed, className }: SidebarItemProps) {
  return (
    <div
      className={cn(
        'flex cursor-pointer items-center rounded bg-[#FFFFFF] p-2 text-sm hover:bg-[#E6FAF0]',
        className,
      )}
    >
      {icon}
      {!collapsed && <span className="ml-3">{label}</span>}
    </div>
  );
}
