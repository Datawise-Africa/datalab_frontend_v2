import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider';
import AuthModal from '@/components/Modals/AuthModals/AuthModal';

const BaseWrapper = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AuthProvider>
      <>
        <Outlet />
        <AuthModal />
      </>
    </AuthProvider>
  );
};

export default BaseWrapper;
