import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedLayout from './components/ProtectedLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import RegistrationForm from './pages/RegistrationForm';
import AdminCreateUserPage from './pages/CreateUser';
import ForgotPasswordPage from './pages/ForgotPassword';
import FormBuilder from './components/FormBuilder/FormBuilder.js';

const AppRoutes = () => {
    return (    
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Wrap all protected routes under a single ProtectedLayout */}
            <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/admin/create-user" element={<AdminCreateUserPage />} />
                <Route path="/admin/create-form" element={<FormBuilder />} />
                {/* Add more protected routes as needed */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;
