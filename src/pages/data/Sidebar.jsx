import { useState } from "react";
import {
  Menu,

  ChevronRight,
  Compass,
  Bookmark,
  FilePlus,
  X,
} from "lucide-react";
import CollapseIcon from "/assets/datalab/collapseicon.png";
import user_icon from "/assets/datalab/AuthIcon.png"; // ✅ Custom user icon
import { useAuth } from "../../storage/AuthProvider";
import upload_icon from "/assets/datalab/uploadicon.png"; // ✅ Your custom upload icon

export default function Sidebar({ handleAuthModalToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { state, dispatch, actions } = useAuth();

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
    dispatch(actions.LOGOUT());
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button onClick={toggleMobileSidebar} className="text-black bg-red p-2 rounded">
          <Menu size={24} />
        </button>
      </div>

      <aside
        className={`bg-[#FFFFFF] font-Sora text-[#0F4539] h-[calc(100vh-3rem)] p-4 transition-all duration-300 z-10
        ${collapsed ? "w-16" : "w-72"}
        ${isOpen ? "block" : "hidden"} fixed lg:static top-12 left-0 
        lg:block`}
      >

        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="text-[#BBBBBB] mt-6 mb-6 self-end md:self-start flex items-center space-x-2"
        >
          <img src={CollapseIcon} alt="Collapse" className="w-6 h-6" />
          {!collapsed && <span>Collapse</span>}
        </button>

        {/* Auth & Upload Buttons */}
        <div className="mb-8">
          {state.userId ? (
            <div
              className={`${
                collapsed ? "p-2" : "px-4 py-2"
              } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center ${
                collapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <img src={user_icon} alt="User Icon" className="w-8 h-8 mt-1" />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    Welcome, {state.firstName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-500 mt-1 underline text-left"
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
                collapsed ? "p-2" : "px-4 py-2"
              } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center justify-between`}
            >
              <div className="flex items-start space-x-3">
                <img src={user_icon} alt="User Icon" className="w-8 h-8 mt-1" />
                {!collapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">Log In / Sign Up</span>
                    <span className="text-xs text-gray-500">Log in to your account</span>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronRight size={18} className="text-gray-400" />}
            </button>
          )}

<button className={`bg-gradient-to-b from-[#115443] to-[#26A37E] text-white rounded mb-8 w-full flex items-center justify-center ${collapsed ? "p-2" : "px-4 py-2"}`}>
  <img src={upload_icon} alt="Upload Icon" className={`w-4 h-4 ${!collapsed ? "mr-2" : ""}`} />
  {!collapsed && "Upload Dataset"}
</button>

        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-4">
          <SidebarItem
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
            icon={<FilePlus size={20} />}
            label="Dataset Creator"
            collapsed={collapsed}
          />
        </nav>

        {/* Creator Promo */}
        {!collapsed && (
          <div className="relative mt-90 bg-[#E6FAF0] p-4 rounded mt-12">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => console.log("Dismiss clicked")}
            >
              <X size={18} />
            </button>
            <h4 className="text-base text-[#188366] font-semibold mb-2">
              Become a Dataset Creator
            </h4>
            <p className="text-sm mb-4">
              Share your data with the world, track engagement, and earn from premium datasets. Apply now to get started!
            </p>
            <button className="bg-gradient-to-b from-[#115443] to-[#26A37E] text-[#188366] px-4 py-2 rounded w-full flex items-center justify-center">
              <FilePlus size={18} className="mr-2" />
              Become A Dataset Creator
            </button>
          </div>
        )}
      </aside>

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

function SidebarItem({ icon, label, collapsed }) {
  return (
    <div className="flex items-center bg-[#FFFFFF] text-sm hover:bg-[#E6FAF0] p-2 rounded cursor-pointer">
      {icon}
      {!collapsed && <span className="ml-3">{label}</span>}
    </div>
  );
}
