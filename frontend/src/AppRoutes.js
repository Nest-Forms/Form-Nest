import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RegistrationForm from './pages/RegistrationForm';
import AdminCreateUserPage from './pages/CreateUser';

const AppRoutes = () => {
    return (    
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationForm />} />

            {/* Wrap all protected routes under a single ProtectedLayout */}
            <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/create-user" element={<AdminCreateUserPage />} />
                {/* Add more protected routes as needed */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
