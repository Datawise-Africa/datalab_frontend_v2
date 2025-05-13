import React, { useState } from 'react';
import { ChevronRight, Compass, Bookmark, FilePlus, X } from 'lucide-react';
import type { AuthState } from '@/lib/types/actions';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

type DraftSidebarProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  // handleAuthModalToggle?: () => void;
  userState?: AuthState;
  // onLogout?: () => void;
  // onBecomeDatasetCreator?: () => void;
  setNavUrl?: (url: string) => void;
};

export default function DraftSidebar({
  sidebarOpen,
  toggleSidebar,
  // handleAuthModalToggle,
  userState,
  setNavUrl,
}: DraftSidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, dispatch, actions, openAuthModal } = useAuth();
  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (handleAuthModalToggle) handleAuthModalToggle();
  };
  const handleAuthModalToggle = () => {
    if (!isAuthenticated) {
      openAuthModal();
      setNavUrl!(pathname);
      return;
    }
  };

  const onBecomeDatasetCreator = () => {
    // Handle the action for becoming a dataset creator
    console.log('Become Dataset Creator clicked');
    if (!isAuthenticated) {
      // authModal.open();
      openAuthModal();
      setNavUrl!(pathname);
    }
    navigate('/become-dataset-creator');
  };

  return (
    <div
      className={`fixed md:relative z-10 h-full border-r border-subtle bg-white shadow-sm transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-16 overflow-hidden'
      }`}
    >
      {/* Header with collapse button */}
      <div className="flex h-14 items-center border-b border-subtle px-4">
        <button
          className="flex items-center justify-between h-8 gap-2 rounded-md hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <img
            src={'/assets/datalab/collapseicon.png'}
            alt="Collapse"
            className="w-6 h-6"
          />{' '}
          <span className="sr-only">Toggle sidebar</span>
          {sidebarOpen && <span className="text-sm font-medium">Collapse</span>}
        </button>
      </div>

      <div className="p-4 flex flex-col h-[calc(100%-3.5rem)]">
        {/* User Profile Section */}
        <div className="mb-6">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center ${
                  sidebarOpen ? 'space-x-3 justify-between' : 'justify-center'
                } rounded-md border p-3 w-full bg-[#FAFAFA]`}
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full flex-shrink-0 bg-gray-300" />
                {sidebarOpen && (
                  <>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500 font-medium">
                        {userState?.userRole || 'User'}
                      </div>
                      <div className="font-medium truncate">
                        {userState?.firstName} {userState?.lastName}
                      </div>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400 flex-shrink-0" />
                  </>
                )}
              </button>

              {showUserMenu && sidebarOpen && (
                <div className="absolute mt-1 left-0 bg-white border rounded shadow w-full z-10">
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                    Settings
                  </button>
                  <button
                    onClick={() => dispatch(actions.LOGOUT())}
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
              className={`flex items-center ${
                sidebarOpen ? 'space-x-3 justify-between' : 'justify-center'
              } rounded-md border p-3 w-full bg-[#FAFAFA]`}
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full flex-shrink-0 bg-gray-300" />
              {sidebarOpen && (
                <>
                  <div className="min-w-0">
                    <div className="font-medium truncate">Log In / Sign Up</div>
                    <div className="text-xs text-gray-500 truncate">
                      Log in to your account
                    </div>
                  </div>
                  <ChevronRight className="ml-auto h-5 w-5 text-gray-400 flex-shrink-0" />
                </>
              )}
            </button>
          )}
        </div>

        {/* Upload Dataset Button */}
        <button
          className={`bg-gradient-to-b from-[#115443] to-[#26A37E] text-white rounded mb-6 w-full flex items-center ${
            sidebarOpen ? 'px-4 py-2 justify-start' : 'p-2 justify-center'
          }`}
        >
          <FilePlus className="h-5 w-5 flex-shrink-0" />
          {sidebarOpen && <span className="ml-2">Upload Dataset</span>}
        </button>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-2 mb-6">
          <SidebarItem
            icon={<Compass className="h-5 w-5" />}
            label="Discover"
            collapsed={!sidebarOpen}
          />
          <SidebarItem
            icon={<Bookmark className="h-5 w-5" />}
            label="Saved Items"
            collapsed={!sidebarOpen}
          />
          <SidebarItem
            icon={<FilePlus className="h-5 w-5" />}
            label="Dataset Creator"
            collapsed={!sidebarOpen}
          />
        </nav>

        {/* Become Dataset Creator Promo */}
        {sidebarOpen && (
          <div className="mt-auto relative bg-[#E6FAF0] rounded p-4">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => console.log('Dismiss clicked')}
            >
              <X className="h-4 w-4" />
            </button>
            <h4 className="text-base text-[#188366] font-semibold mb-2">
              Become a Dataset Creator
            </h4>
            <p className="text-sm mb-4">
              Share your data with the world, track engagement, and earn from
              premium datasets. Apply now to get started!
            </p>
            <button
              onClick={onBecomeDatasetCreator}
              className="bg-gradient-to-b from-[#115443] to-[#26A37E] text-white px-4 py-2 rounded w-full flex items-center justify-center"
            >
              Become A Dataset Creator
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
};
function SidebarItem({ icon, label, collapsed }: SidebarItemProps) {
  return (
    <div className="flex items-center text-sm hover:bg-[#E6FAF0] p-2 rounded cursor-pointer">
      {icon}
      {!collapsed && <span className="ml-3">{label}</span>}
    </div>
  );
}
