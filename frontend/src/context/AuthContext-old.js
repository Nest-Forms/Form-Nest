import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [authChallenge, setAuthChallenge] = useState(null);
    const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState(false);
    const [emailForVerification, setEmailForVerification] = useState('');

    const login = async ({ email, password }) => {
            setEmailForVerification(email);
            console.log(emailForVerification);
        try {
            const response = await axios.post('https://mwaa7c2t5m.execute-api.eu-west-2.amazonaws.com/login', { email, password });
            console.log(response)
            setEmailForVerification(email);
            console.log(emailForVerification);
            if (response.status === 409 || response.status === 403) {
                setIsEmailVerificationRequired(true);
                setEmailForVerification(email);
                return;
            }

            const data = response.data;
            if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
                setAuthChallenge({ session: data.session, challengeName: 'NEW_PASSWORD_REQUIRED' });
            } else {
                setUser(data);
                localStorage.setItem('user', JSON.stringify(data));
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const completeNewPasswordChallenge = async (newPassword) => {
        try {
            const response = await axios.post('https://mwaa7c2t5m.execute-api.eu-west-2.amazonaws.com/force-pw-change', {
                username: emailForVerification,
                newPassword: newPassword,
                session: authChallenge.session,
            });
            console.log("Password updated successfully:", response.data);
            setAuthChallenge(null);
        } catch (error) {
            console.error("Error updating password:", error);
        }
    };

    const submitEmailVerificationCode = async (code) => {
        try {
            await axios.post('https://mwaa7c2t5m.execute-api.eu-west-2.amazonaws.com/verify-email', { email: emailForVerification, code });

            setIsEmailVerificationRequired(false);
        } catch (error) {
            console.error("Email verification error:", error);
        }
    };

    const requestNewVerificationCode = async () => {
        try {
            await axios.post('https://mwaa7c2t5m.execute-api.eu-west-2.amazonaws.com/resend-verification', { email: emailForVerification });
        } catch (error) {
            console.error("Failed to resend verification code:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setAuthChallenge(null);
        setIsEmailVerificationRequired(false);
    };

    const initiatePasswordReset = async (email) => {
        try {
            await axios.post('https://mwaa7c2t5m.execute-api.eu-west-2.amazonaws.com/initiate-pw-reset', { email });
        } catch (error) {
            console.error("Error initiating password reset:", error);
        }
    };
    
    const confirmPasswordReset = async (email, code, newPassword) => {
        try {
            console.log(email, code, newPassword)
            await axios.post('https://mwaa7c2t5m.execute-api.eu-west-2.amazonaws.com/confirm-pw-reset', {
                email,
                code,
                newPassword,
            });
            return Promise.resolve();
        } catch (error) {
            console.error("Error confirming password reset:", error);
        }
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            authChallenge,
            isEmailVerificationRequired,
            emailForVerification,
            login,
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
