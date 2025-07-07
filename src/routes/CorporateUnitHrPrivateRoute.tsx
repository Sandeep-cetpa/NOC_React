import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from 'react-oidc-context';

const CorporateUnitHrPrivateRoute: React.FC = () => {
     const auth = useAuth();
      const isAuthenticated = auth.isAuthenticated;
    const hasAccess = true;

    return isAuthenticated && hasAccess ? (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    ) : (
        <Navigate to="/" replace />
    );
};

export default CorporateUnitHrPrivateRoute;
