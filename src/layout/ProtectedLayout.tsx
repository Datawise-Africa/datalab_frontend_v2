import AuthModal from '@/components/Modals/AuthModals/AuthModal';
import { useAuthContext } from '@/context/AuthProvider';
import { useAuthStore } from '@/store/auth-store';
import { useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export default function ProtectedLayout() {
  const { setIsAuthModalOpen, isAuthModalOpen } = useAuthContext();
  const { is_authenticated, user } = useAuthStore();
  const authCheck = useCallback(() => {}, [is_authenticated]);
  useEffect(() => {
    if (!is_authenticated) {
      console.log('User is not authenticated');

      setIsAuthModalOpen(true);
    }
    console.log({ is_authenticated, user });
  }, [is_authenticated]);
  useEffect(() => {
    authCheck();
  }, [authCheck]);
  return isAuthModalOpen ? <AuthModal /> : <Outlet />;
}
