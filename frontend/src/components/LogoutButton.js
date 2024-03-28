import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure this path is correct

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useAuth(); // Destructure the logout function from your context

    const handleLogout = () => {
        logout(); // Use the logout function from the context

        // Redirect to login page
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="btn btn-primary">Logout</button>
    );
};

export default LogoutButton;
