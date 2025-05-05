// import { useState } from "react";
// import { Menu, Upload, Compass, Bookmark, FilePlus, User } from "lucide-react";
// import CollapseIcon from "/assets/datalab/collapseicon.png"; // Make sure the path to your icon is correct
// import { useAuth } from "../../storage/AuthProvider";

// export default function Sidebar({handleAuthModalToggle}) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [collapsed, setCollapsed] = useState(false);
//   const { state, dispatch, actions } = useAuth();

//   const toggleSidebar = () => setCollapsed(!collapsed);
//   const toggleMobileSidebar = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* Mobile Toggle Button */}
//       <div className="lg:hidden  fixed top-4 left-4 z-20">
//         <button onClick={toggleMobileSidebar} className="text-black bg-red p-2 rounded">
//           <Menu size={24} />
//         </button>
//       </div>

//       <aside
//         className={`bg-[#FFFFFF] mt-12 font-Sora text-[#0F4539] h-screen p-4 transition-all duration-300 z-10
//         ${collapsed ? "w-16" : "w-64"}
//         ${isOpen ? "block" : "hidden"} fixed top-0 left-0 
//         lg:block`}
//       >
//         {/* Toggle Collapse Button */}
//         <button
//           onClick={toggleSidebar}
//           className="text-[#BBBBBB] mt-6 mb-6 self-end md:self-start"
//         >
//           {collapsed ? (
//             <img src={CollapseIcon} alt="Collapse" className="w-6 h-6" />
//           ) : (
//             <>
//               <img src={CollapseIcon} alt="Collapse" className="w-6 h-6"  />    <span>Collapse</span> 

//             </>
//           )}
//         </button>

//         {/* Auth & Upload Buttons */}
//         <div className="mb-8">
//   {state.userId ? (
//     <div
//       className={`${
//         collapsed ? "p-2" : "px-4 py-2"
//       } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center justify-center flex-col`}
//     >
//       <User size={24} />
//       {!collapsed && (
//         <>
//           <span className="mt-2">Welcome, {state.firstName}</span>
//           <button
//             onClick={() => dispatch(actions.LOGOUT())}
//             className="text-xs text-red-500 mt-1 underline"
//           >
//             Logout
//           </button>
//         </>
//       )}
//     </div>
//   ) : (
//     <button
//       onClick={handleAuthModalToggle}

//       className={`${ 
//         collapsed ? "p-2" : "px-4 py-2"
//       } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center justify-center flex-col`}
//     >
//       <img src={user_icon} alt="User Icon" className="w-6 h-6" />
//       {!collapsed && (
//         <>
//           <span className="mt-2">Log In / Sign Up</span>
//           <span className="text-xs text-gray-500">Log in to your account</span>
//         </>
//       )}
//     </button>
//   )}
//   <button className="bg-[#26A37E] text-white px-4 py-2 rounded mb-8 w-full flex items-center justify-center">
//     <Upload size={18} className="mr-2" />
//     {!collapsed && "Upload Dataset"}
//   </button>
// </div>


//         {/* Menu Items */}
//         <nav className="flex flex-col gap-4">
//           <SidebarItem
//           className="bg-[#FFFFFF] hover:bg-[#E6FAF0]"
//             icon={<Compass size={20} />}
//             label="Discover"
//             collapsed={collapsed}
//           />
//           <SidebarItem
//             icon={<Bookmark size={20} />}
//             label="Saved Items"
//             collapsed={collapsed}
//           />
//           <SidebarItem
//             icon={<FilePlus size={20} />}
//             label="Dataset Creator"
//             collapsed={collapsed}
//           />
//         </nav>
//       </aside>

//       {/* Overlay on mobile when sidebar is open */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-0 lg:hidden"
//           onClick={toggleMobileSidebar}
//         />
//       )}
//     </>
//   );
// }

// function SidebarItem({ icon, label, collapsed }) {
//   return (
//     <div className="flex items-center bg-[#FFFFFF] text-sm hover:bg-[#E6FAF0] p-2 rounded cursor-pointer">
//       {icon}
//       {!collapsed && <span className="ml-3">{label}</span>}
//     </div>
//   );
// }
import { useState } from "react";
import { Menu, Upload, Compass, Bookmark, FilePlus, User } from "lucide-react";
import CollapseIcon from "/assets/datalab/collapseicon.png";
import user_icon from "/assets/user.svg"; // Ensure this import exists
import { useAuth } from "../../storage/AuthProvider";



export default function Sidebar({ handleAuthModalToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { state, dispatch, actions } = useAuth();
  
  console.log("Sidebar Rendered");
  console.log("Auth State:", state);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    console.log("Sidebar Collapsed:", !collapsed);
  };

  const toggleMobileSidebar = () => {
    setIsOpen(!isOpen);
    console.log("Mobile Sidebar Open:", !isOpen);
  };


  const handleLoginClick = () => {
    console.log("Login button clicked");
    handleAuthModalToggle();
  };

  const handleLogout = () => {
    console.log("Logout button clicked");
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
        className={`bg-[#FFFFFF] mt-12 font-Sora text-[#0F4539] h-screen p-4 transition-all duration-300 z-10
        ${collapsed ? "w-16" : "w-64"}
        ${isOpen ? "block" : "hidden"} fixed top-0 left-0 
        lg:block`}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="text-[#BBBBBB] mt-6 mb-6 self-end md:self-start"
        >
          {collapsed ? (
            <img src={CollapseIcon} alt="Collapse" className="w-6 h-6" />
          ) : (
            <>
              <img src={CollapseIcon} alt="Collapse" className="w-6 h-6" /> <span>Collapse</span>
            </>
          )}
        </button>

        {/* Auth & Upload Buttons */}
        <div className="mb-8">
          {state.userId ? (
            <div
              className={`${
                collapsed ? "p-2" : "px-4 py-2"
              } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center justify-center flex-col`}
            >
              <User size={24} />
              {!collapsed && (
                <>
                  <span className="mt-2">Welcome, {state.firstName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-500 mt-1 underline"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className={`${
                collapsed ? "p-2" : "px-4 py-2"
              } bg-[#FAFAFA] text-[#0F4539] rounded mb-4 w-full flex items-center justify-center flex-col`}
            >
              <img src={user_icon} alt="User Icon" className="w-6 h-6" />
              {!collapsed && (
                <>
                  <span className="mt-2">Log In / Sign Up</span>
                  <span className="text-xs text-gray-500">Log in to your account</span>
                </>
              )}
            </button>
          )}

          <button className="bg-[#26A37E] text-white px-4 py-2 rounded mb-8 w-full flex items-center justify-center">
            <Upload size={18} className="mr-2" />
            {!collapsed && "Upload Dataset"}
          </button>
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
            icon={<FilePlus size={20} />}
            label="Dataset Creator"
            collapsed={collapsed}
          />
        </nav>
      </aside>

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
