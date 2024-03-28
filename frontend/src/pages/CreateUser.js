import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the import path according to your project structure

const AdminCreateUserPage = () => {
    const { user } = useAuth(); // Use auth context to access admin's info if needed
    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'user', // Default role as 'user'
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('https://n34orowt8e.execute-api.eu-west-2.amazonaws.com/adduser', { // Update with your actual endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`, // Assuming token is stored in your auth context
                },
                body: JSON.stringify({
                    ...userData,
                    companyId: user.companyId, // companyId is derived from the auth context
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user. Please try again.');
            }

            const result = await response.json();
            setMessage(result.message || 'User successfully added!');
            setUserData({ email: '', firstName: '', lastName: '', role: 'user' }); // Reset form, excluding password
        } catch (error) {
            setMessage(error.message);
            console.error('There was an error!', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Add New User</h2>
            {message && <div>{message}</div>}
            <form onSubmit={handleSubmit}>
                <label>Email:
                    <input type="email" name="email" value={userData.email} onChange={handleChange} required />
                </label>
                <label>First Name:
                    <input type="text" name="firstName" value={userData.firstName} onChange={handleChange} required />
                </label>
                <label>Last Name:
                    <input type="text" name="lastName" value={userData.lastName} onChange={handleChange} required />
                </label>
                <label>Role:
                    <select name="role" value={userData.role} onChange={handleChange}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        {/* Additional roles can be added here */}
                    </select>
                </label>
                <button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add User'}</button>
            </form>
        </div>
    );
};

export default AdminCreateUserPage;
