import { Outlet } from 'react-router-dom';
import Sidebar from '../data/Sidebar';
import Header from '../../components/Header/Header';
import DatasetHeader from '../data/DatasetHeader';
import MaxWidth from '../../components/designs/MaxWidth';
// import { useEffect, useRef } from 'react';
import { useSidebar } from '../../hooks/useSidebar';
import DraftSidebar from '../../components/DraftSidebar';
import { DraftMobileMenu } from '../../components/DraftMobileMenu';

const Layout = () => {
   const { sidebarOpen, toggleSidebar, mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen } = useSidebar()
  return (
     <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DraftSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Mobile menu */}
      <DraftMobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <Header onToggleMobileMenu={toggleMobileMenu} />

        {/* Content Area - Outlet */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Layout;
