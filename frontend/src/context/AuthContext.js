import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = 'https://peclyg9775.execute-api.eu-west-2.amazonaws.com/';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
    const [authChallenge, setAuthChallenge] = useState(null);
    const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState(false);
    const [emailForVerification, setEmailForVerification] = useState('');

    const navigate = useNavigate();

    const login = async ({ email, password }) => {
        setEmailForVerification(email);
        try {
            const response = await axios.post(`${API_URL}login`, { email, password });
            if (response.data && response.data.userAttributes) {
                const userData = {
                    ...response.data.userAttributes,
                    accessToken: response.data.data.AccessToken,
                    expiresIn: response.data.data.ExpiresIn,
                    idToken: response.data.data.IdToken,
                    refreshToken: response.data.data.RefreshToken,
                    tokenType: response.data.data.TokenType,
                };
    
                setUser(userData);  // Store the structured user data
                localStorage.setItem('user', JSON.stringify(userData));
                setIsEmailVerificationRequired(false); // Reset this flag on successful login
            } else if (response.status === 403 || response.data.challengeName === 'USER_NOT_CONFIRMED') {
                setIsEmailVerificationRequired(true);
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && (error.response.status === 403 || error.response.data.error === 'UserNotConfirmedException')) {
                setIsEmailVerificationRequired(true);
            } else {
                // Optionally handle other errors or log them
                console.error("API Error:", error.response?.data || error.message);
            }
        }
    };

    const register = async (userData) => {
        try {
            const apiUrl = `${API_URL}user`;
            const response = await axios.post(apiUrl, userData);
            console.log("Registration successful:", response.data);
            navigate('/login', { state: { needVerification: true } });
        } catch (error) {
            console.error("Registration error:", error.response ? error.response.data : error.message);
            // Optionally handle more specific errors
        }
    };

    const completeNewPasswordChallenge = async (newPassword) => {
        try {
            const response = await axios.post(`${API_URL}force-pw-change`, {
                username: emailForVerification,
                newPassword,
                session: authChallenge?.session,
            });
            setUser(response.data.user);
            setAuthChallenge(null);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };

    const submitEmailVerificationCode = async (code) => {
        try {
            await axios.post(`${API_URL}verify-email`, { email: emailForVerification, code });
            setIsEmailVerificationRequired(false);
        } catch (error) {
            console.error("Email verification error:", error);
        }
    };

    const requestNewVerificationCode = async () => {
        try {
            await axios.post(`${API_URL}resend-verification`, { email: emailForVerification });
        } catch (error) {
            console.error("Failed to resend verification code:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setAuthChallenge(null);
        setIsEmailVerificationRequired(false);
        setEmailForVerification(''); // Clear the email upon logout
    };

    const initiatePasswordReset = async (email) => {
        try {
            await axios.post(`${API_URL}initiate-pw-reset`, { email });
        } catch (error) {
            console.error("Error initiating password reset:", error);
        }
    };

    const confirmPasswordReset = async (email, code, newPassword) => {
        try {
            await axios.post(`${API_URL}confirm-pw-reset`, { email, code, newPassword });
        } catch (error) {
            console.error("Error confirming password reset:", error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            authChallenge,
            isEmailVerificationRequired,
            setIsEmailVerificationRequired,
            emailForVerification,
            login,
            register,
            completeNewPasswordChallenge,
            submitEmailVerificationCode,
            requestNewVerificationCode,
            initiatePasswordReset,
            confirmPasswordReset,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
