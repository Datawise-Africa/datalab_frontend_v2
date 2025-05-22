import { useEffect, useState, useCallback, useMemo } from 'react';

export default function useSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleWindowResize = useCallback(() => {
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);

    if (isMobileView) {
      // On mobile, sidebar should be closed by default and collapsed
      setIsCollapsed(true);
      setIsOpen(false);
    } else {
      // On desktop, sidebar should be open and not collapsed by default
      setIsOpen(true);
      setIsCollapsed(false);
    }
  }, []);

  useEffect(() => {
    // Initial setup
    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  const openSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(true);
    } else {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsCollapsed(true);
    }
  }, [isMobile]);

  const shouldShowOverlay = useMemo(() => {
    return isMobile && isOpen;
  }, [isMobile, isOpen]);

  const isVisible = useMemo(() => {
    return isMobile ? isOpen : !isCollapsed;
  }, [isMobile, isOpen, isCollapsed]);

  return {
    isOpen,
    isMobile,
    isCollapsed,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    isVisible,
    shouldShowOverlay,
  };
}
