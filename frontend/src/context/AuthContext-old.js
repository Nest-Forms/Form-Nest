import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [authChallenge, setAuthChallenge] = useState(null);
    const [isEmailVerificationRequired, setIsEmailVerificationRequired] = useState(false);
    const [emailForVerification, setEmailForVerification] = useState('');

    const login = async ({ email, password }) => {
        try {
            const response = await fetch('https://n34orowt8e.execute-api.eu-west-2.amazonaws.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 409) {
                setIsEmailVerificationRequired(true);
                setEmailForVerification(email);
                return;
            }

            if (!response.ok) throw new Error('Login failed');

            const data = await response.json();
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

    const submitEmailVerificationCode = async ( code ) => {
        try {
            const response = await fetch('https://n34orowt8e.execute-api.eu-west-2.amazonaws.com/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailForVerification, code }),
            });
            if (!response.ok) throw new Error('Email verification failed');

            setIsEmailVerificationRequired(false);
            // might want to log the user in automatically here or instruct them to log in again.
        } catch (error) {
            console.error("Email verification error:", error);
        }
    };
    const requestNewVerificationCode = async () => {
        const response = await fetch('https://n34orowt8e.execute-api.eu-west-2.amazonaws.com/resend-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailForVerification }),
        });
    
        if (!response.ok) {
            throw new Error('Failed to resend verification code.');
        }
    
        // Handle response...
    };
    

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setAuthChallenge(null);
        setIsEmailVerificationRequired(false);
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
            submitEmailVerificationCode,
            requestNewVerificationCode,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
