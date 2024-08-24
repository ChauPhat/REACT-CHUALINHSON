// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { authorize } from '../GlobalVariable';
import { useRole } from './RoleContext';

const ProtectedRoute = ({ element: Component, requiredRole }) => {
    const { role } = useRole();

    if (!authorize(requiredRole, role)) {
        return <Navigate to="/401" />;
    }

    return Component;
};

export default ProtectedRoute;
