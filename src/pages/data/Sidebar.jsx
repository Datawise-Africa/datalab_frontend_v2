import { useState } from 'react';
import { Menu, Compass, Bookmark, FilePlus, ChevronRight } from 'lucide-react';
import CollapseIcon from '/assets/datalab/collapseicon.png';
import { useAuth } from '../../storage/AuthProvider';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/designs/Button.js';
import user_icon from '/assets/datalab/AuthIcon.png'; // ✅ Custom user icon
import upload_icon from '/assets/datalab/uploadicon.png'; // ✅ Your custom upload icon
import { useLocation } from 'react-router-dom';
import DataCatalog from './DatasetCatalog.jsx';
import datasetcreator_icon from '/assets/datasetcreator.png';
import mydatasets_icon from '/assets/mydatasets.png';
import analytics_icon from '/assets/analytics.png';
import reports_icon from '/assets/reports.png';


export default function Sidebar({ handleAuthModalToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { state, dispatch, actions } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLoginClick = () => {
    handleAuthModalToggle();
  };

  const handleLogout = () => {
    console.log('Logging out...');
    dispatch(actions.LOGOUT());
  };
  
  const handleBecomeDatasetCreator = () => {
    handleAuthModalToggle();
    navigate('/become-dataset-creator');
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
            <img src={CollapseIcon} alt="Collapse" className="w-6 h-6" />
          ) : (
            <>
              <img src={CollapseIcon} alt="Collapse" className="w-6 h-6" />{' '}
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
                    src={user_icon}
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
                <img src={user_icon} alt="User Icon" className="w-8 h-8 mt-1" />
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

          {location.pathname !== '/dataset-creator-dashboard' && (
            <button
              onClick={() => {
                if (state.userId) {
                  navigate('/dataset-creator-dashboard');
                } else {
                  handleAuthModalToggle();
                }
              }}
              className={`bg-gradient-to-b from-[#115443] to-[#26A37E] text-white rounded mb-8 w-full flex items-center justify-center ${
                collapsed ? 'p-2' : 'px-4 py-2'
              }`}
            >
              <img
                src={upload_icon}
                alt="Upload Icon"
                className={`w-4 h-4 ${!collapsed ? 'mr-2' : ''}`}
              />
              {!collapsed && 'Upload Dataset'}
            </button>
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
          <SidebarItem className="bg-[#FFFFFF] hover:bg-[#E6FAF0]"
            icon={<Bookmark size={20} />}
            label="Saved Items"
            collapsed={collapsed}
          />
       <SidebarItem className="bg-[#FFFFFF]hover:bg-[#E6FAF0]"
  label="Dataset Creator"
  collapsed={collapsed}
  icon={<img src={datasetcreator_icon} alt="Dataset Creator Icon" className="w-5 h-5 mt-1" />}
>
  <div className="ml-10 flex flex-col gap-2 mt-2">
    <div
      className="flex items-center  text-sm gap-2 cursor-pointer bg-[#FFFFFF] hover:bg-[#E6FAF0]"
      onClick={() => navigate('/my-datasets')}
    >
      <img src={mydatasets_icon} alt="My Datasets Icon" className="w-5 h-5 mt-2 " />
      <span>My Datasets</span>
    </div>

    <div
      className="flex items-center bg-[#FFFFFF] hover:bg-[#E6FAF0] text-sm gap-2 cursor-pointer "
      onClick={() => navigate('/analytics')}
    >
      <img src={analytics_icon} alt="Analytics Icon" className="w-5 h-5 mt-1" />
      <span>Analytics</span>
    </div>

    <div
      className="flex items-center text-sm gap-2 bg-[#FFFFFF] hover:bg-[#E6FAF0] cursor-pointer "
      onClick={() => navigate('/reports')}
    >
      <img src={reports_icon} alt="Reports Icon" className="w-5 h-5 mt-1" />
      <span>Reports</span>
    </div>
  </div>
</SidebarItem>



        </nav>
      
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

// function SidebarItem({ icon, label, collapsed }) {
//   return (
//     <div className="flex items-center bg-[#FFFFFF] text-sm hover:bg-[#E6FAF0] p-2 rounded cursor-pointer">
//       {icon}
//       {!collapsed && <span className="ml-3">{label}</span>}
//     </div>
//   );
// }
function SidebarItem({ icon, label, collapsed, onClick, children }) {
  return (
    <div className="flex flex-col">
      <div
        onClick={onClick}
        className="flex items-center text-sm p-2 rounded cursor-pointer hover:bg-[#E6FAF0]"
      >
        {icon}
        {!collapsed && <span className="ml-3">{label}</span>}
      </div>

      {/* Children rendered below, not part of the hover area */}
      {!collapsed && children}
    </div>
  );
}
