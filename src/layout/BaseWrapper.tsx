import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider';
import AuthModal from '@/components/Modals/AuthModals/AuthModal';
import SplashScreen from '@/components/SplashScreen';

const BaseWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<SplashScreen />}>
      {/* AuthProvider wraps the entire app to manage authentication state */}
      <AuthProvider>
        <>
          <Outlet />
          <AuthModal />
        </>
      </AuthProvider>
    </Suspense>
  );
};

export default BaseWrapper;
