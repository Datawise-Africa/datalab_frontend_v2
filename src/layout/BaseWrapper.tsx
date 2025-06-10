import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthProvider';
import AuthModal from '@/components/Modals/AuthModals/AuthModal';
import SplashScreen from '@/components/SplashScreen';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/theme-provider';

const BaseWrapper = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Suspense fallback={<SplashScreen />}>
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
        </Suspense>
    );
};

export default BaseWrapper;
