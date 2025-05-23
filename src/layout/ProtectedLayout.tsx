import AuthModal from '@/components/Modals/AuthModals/AuthModal';
import { useAuth } from '@/context/AuthProvider';
import { useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function ProtectedLayout() {
  const auth = useAuth();
  const authCheck = useCallback(() => {}, [auth.isAuthenticated]);
  useEffect(() => {
    if (!auth.isAuthenticated) {
      console.log('User is not authenticated');

      auth.setIsAuthModalOpen(true);
    }
  }, [auth.isAuthenticated]);
  useEffect(() => {
    authCheck();
  }, [authCheck]);
  return auth.isAuthModalOpen ? <AuthModal /> : <Outlet />;
}
