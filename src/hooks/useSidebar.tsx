import { useEffect, useState } from 'react';

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we're on mobile when the component mounts and when the window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Auto-close sidebar on mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    // Check initially
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return {
    sidebarOpen,
    toggleSidebar,
    isMobile,
    mobileMenuOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
  };
}
