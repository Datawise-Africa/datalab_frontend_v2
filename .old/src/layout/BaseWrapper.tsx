import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider';
import AuthModal from '@/components/Modals/AuthModals/AuthModal';
import SplashScreen from '@/components/SplashScreen';
import { ThemeProvider } from '@/context/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useSidebarInit } from '@/store/use-sidebar-store.tsx';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});
const BaseWrapper = () => {
  const location = useLocation();
  useSidebarInit();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<SplashScreen />}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          {/* AuthProvider wraps the entire app to manage authentication state */}
          <AuthProvider>
            <>
              <Toaster />
              <Outlet />
              <AuthModal />
            </>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  );
};

export default BaseWrapper;
