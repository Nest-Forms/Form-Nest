import React from 'react';
import LogoutButton from '../components/LogoutButton';

const Dashboard = () => {
    return (
        <div>
            <LogoutButton />
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            {/* Dashboard content goes here */}
        </div>
    );
};

export default Dashboard;
