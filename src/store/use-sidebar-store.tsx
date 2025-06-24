import { create } from 'zustand';
import { useEffect } from 'react';

interface SidebarState {
  isOpen: boolean;
  isMobile: boolean;
  isCollapsed: boolean;
}

interface SidebarActions {
  setIsOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
  handleWindowResize: () => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  shouldShowOverlay: () => boolean;
  isVisible: () => boolean;
}

interface SidebarStore extends SidebarState, SidebarActions {}

interface SidebarHookReturn {
  isOpen: boolean;
  isMobile: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  isVisible: boolean;
  shouldShowOverlay: boolean;
}

const useSidebarStore = create<SidebarStore>((set, get) => ({
  // Initial state
  isOpen: false,
  isMobile: false,
  isCollapsed: false,

  // Actions
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  setIsCollapsed: (isCollapsed: boolean) => set({ isCollapsed }),

  handleWindowResize: () => {
    const isMobileView = window.innerWidth < 768;

    if (isMobileView) {
      // On mobile, sidebar should be closed by default and collapsed
      set({
        isMobile: true,
        isCollapsed: true,
        isOpen: false,
      });
    } else {
      // On desktop, sidebar should be open and not collapsed by default
      set({
        isMobile: false,
        isOpen: true,
        isCollapsed: false,
      });
    }
  },

  toggleSidebar: () => {
    const { isMobile } = get();

    if (isMobile) {
      set((state) => ({ isOpen: !state.isOpen }));
    } else {
      set((state) => ({ isCollapsed: !state.isCollapsed }));
    }
  },

  openSidebar: () => {
    const { isMobile } = get();

    if (isMobile) {
      set({ isOpen: true });
    } else {
      set({ isCollapsed: false });
    }
  },

  closeSidebar: () => {
    const { isMobile } = get();

    if (isMobile) {
      set({ isOpen: false });
    } else {
      set({ isCollapsed: true });
    }
  },

  // Computed values
  shouldShowOverlay: (): boolean => {
    const { isMobile, isOpen } = get();
    return isMobile && isOpen;
  },

  isVisible: (): boolean => {
    const { isMobile, isOpen, isCollapsed } = get();
    return isMobile ? isOpen : !isCollapsed;
  },
}));

// Hook to initialize the store with window resize handling
export const useSidebarInit = (): void => {
  const handleWindowResize = useSidebarStore(
    (state) => state.handleWindowResize,
  );

  useEffect(() => {
    // Initial setup
    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);
};

// Main hook that provides the sidebar functionality
export const useSidebar = (): SidebarHookReturn => {
  const store = useSidebarStore();

  return {
    isOpen: store.isOpen,
    isMobile: store.isMobile,
    isCollapsed: store.isCollapsed,
    toggleSidebar: store.toggleSidebar,
    openSidebar: store.openSidebar,
    closeSidebar: store.closeSidebar,
    isVisible: store.isVisible(),
    shouldShowOverlay: store.shouldShowOverlay(),
  };
};

export default useSidebarStore;
