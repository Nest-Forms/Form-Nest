import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminCreateUserPage = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: 'user',
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
                    companyId: user.userAttributes.companyId, // Correct typo in companyId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user. Please try again.');
            }

            const result = await response.json();
            setMessage(result.message || 'User successfully added!');
            setUserData({ email: '', firstName: '', lastName: '', role: 'user' }); // Reset form
        } catch (error) {
            setMessage(error.message);
            console.error('There was an error!', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <h2 className="mb-3 text-center">Add New User</h2>
                    {message && <div className="alert alert-info text-center">{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input type="email" className="form-control" id="email" name="email" value={userData.email} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="firstName" className="form-label">First Name:</label>
                            <input type="text" className="form-control" id="firstName" name="firstName" value={userData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastName" className="form-label">Last Name:</label>
                            <input type="text" className="form-control" id="lastName" name="lastName" value={userData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role:</label>
                            <select className="form-select" id="role" name="role" value={userData.role} onChange={handleChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                {/* Additional roles can be added here */}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add User'}</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateUserPage;
