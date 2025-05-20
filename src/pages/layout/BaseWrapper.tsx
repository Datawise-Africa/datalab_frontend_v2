import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AuthProvider } from "../../storage/AuthProvider";

const BaseWrapper = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

export default BaseWrapper;