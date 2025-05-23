import { useState } from 'react';
import { Menu, Compass, Bookmark, ChevronRight } from 'lucide-react';
import { X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/designs/Button';
// import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthProvider';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const {
    state,
    dispatch,
    actions,
    isAuthenticated,
    setIsAuthModalOpen,
    queue: authQueue,
  } = useAuth();
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
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(actions.LOGOUT());
  };
  // useEffect(() => {
  //   if (!state.userId) {
  //     console.log("User is logged out");
  //   }
  // }, [state.userId]);

  const handleBecomeDatasetCreator = () => {
    // handleAuthModalToggle();
    if (!isAuthenticated) {
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
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={toggleMobileSidebar}
          className="text-black bg-red p-2 rounded"
        >
          <Menu size={24} />
        </button>
      </div>

      <aside
        className={`bg-[#FFFFFF] font-Sora text-[#0F4539] h-[calc(100vh-3rem)] p-4 transition-all duration-300 z-10
  ${collapsed ? 'w-16' : 'w-72'}
  ${isOpen ? 'block' : 'hidden'} fixed lg:static top-12 left-0
  lg:block`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="text-[#BBBBBB] mt-6 mb-6 self-end md:self-start inline-flex items-center gap-2"
        >
          {collapsed ? (
            <img
              src={'/assets/datalab/collapseicon.png'}
              alt="Collapse"
              className="w-6 h-6"
            />
          ) : (
            <>
              <img
                src={'/assets/datalab/collapseicon.png'}
                alt="Collapse"
                className="w-6 h-6"
              />{' '}
              <span>Collapse</span>
            </>
          )}
        </button>

        {/* Auth & Upload Buttons */}
        <div className="mb-8">
          {state.userId ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className={`${
                  collapsed ? 'p-2' : 'px-4 py-2'
                } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center justify-between`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={'/assets/datalab/AuthIcon.png'}
                    alt="User Icon"
                    className="w-8 h-8 mt-1"
                  />
                  {!collapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500 font-medium">
                        {state.userRole}
                      </span>
                      <span className="text-sm font-semibold">
                        {state.firstName} {state.lastName}
                      </span>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <ChevronRight size={18} className="text-gray-400" />
                )}
              </button>

              {showUserMenu && !collapsed && (
                <div className="absolute mt-1 left-0 bg-white border rounded shadow w-full z-10">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
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
              } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center justify-between`}
            >
              <div className="flex items-start space-x-3">
                <img
                  src={'/assets/datalab/AuthIcon.png'}
                  alt="User Icon"
                  className="w-8 h-8 mt-1"
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

          <Link
            to={'/app/dataset-creator-dashboard'}
            className={`bg-gradient-to-b from-[#115443] to-[#26A37E] text-white rounded mb-8 w-full flex items-center justify-center ${
              collapsed ? 'p-2' : 'px-4 py-2'
            }`}
          >
            <img
              src={'/assets/datalab/uploadicon.png'}
              alt="Upload Icon"
              className={`w-4 h-4 ${!collapsed ? 'mr-2' : ''}`}
            />
            {!collapsed && 'Upload Dataset'}ss
          </Link>
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
                className="w-5 h-5 mt-1"
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
          <div className="relative bg-[#E6FAF0]  rounded mt-40">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => console.log('Dismiss clicked')}
            >
              <X size={18} />
            </button>
            <div className="py-4 px-2">
              <h4 className="text-base  text-[#188366] font-semibold mb-2">
                Become a Dataset Creator
              </h4>
              <p className="text-sm mb-4">
                Share your data with the world, track engagement, and earn from
                premium datasets. Apply now to get started!
              </p>
            </div>
            <Button
              onClick={handleBecomeDatasetCreator}
              className="rounded w-full flex items-center justify-center gap-2"
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
          className="fixed inset-0 bg-black opacity-50 z-0 lg:hidden"
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
        'flex items-center bg-[#FFFFFF] text-sm hover:bg-[#E6FAF0] p-2 rounded cursor-pointer',
        className,
      )}
    >
      {icon}
      {!collapsed && <span className="ml-3">{label}</span>}
    </div>
  );
}
