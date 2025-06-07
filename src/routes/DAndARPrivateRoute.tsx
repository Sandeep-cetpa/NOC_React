import React from 'react';
import { Navigate, Outlet } from 'react-router';
import AdminLayout from '@/components/layout/AdminLayout';

const DAndARPrivateRoute: React.FC = () => {
    const isAuthenticated = true;
    const hasAccess = true;

    return isAuthenticated && hasAccess ? (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    ) : (
        <Navigate to="/" replace />
    );
};

export default DAndARPrivateRoute;
