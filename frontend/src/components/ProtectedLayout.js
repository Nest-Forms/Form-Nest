import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedLayout = () => {
    const { user } = useAuth();
    console.log(user)
    if (!user) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            {/* Your common layout components like header, navbar, etc., can go here */}
            <Outlet /> {/* This renders the child routes */}
        </div>
    );
};

export default ProtectedLayout;
