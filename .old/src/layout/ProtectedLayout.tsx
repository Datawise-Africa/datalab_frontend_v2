import AuthModal from '@/components/Modals/AuthModals/AuthModal';
import { useAuthContext } from '@/context/AuthProvider';
import { useAuthStore } from '@/store/auth-store';
import { useCallback, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Seo from '@/components/seo/Seo';

export default function ProtectedLayout() {
  const { setIsAuthModalOpen, isAuthModalOpen } = useAuthContext();
  const { is_authenticated } = useAuthStore();
  const authCheck = useCallback(() => {}, [is_authenticated]);
  useEffect(() => {
    if (!is_authenticated) {
      console.log('User is not authenticated');

      setIsAuthModalOpen(true);
    }
  }, [is_authenticated]);
  useEffect(() => {
    authCheck();
  }, [authCheck]);
  return isAuthModalOpen ? (
    <>
      <Seo
        title="Secure workspace"
        description="Sign in to manage datasets, analytics, and account information within the Datalab workspace."
        url="/app"
        noindex
      />
      <AuthModal />
    </>
  ) : (
    <>
      <Seo
        title="Secure workspace"
        description="Manage your datasets, collaborate with teams, and review analytics inside the protected Datalab workspace."
        url="/app"
        noindex
      />
      <Outlet />
    </>
  );
}
