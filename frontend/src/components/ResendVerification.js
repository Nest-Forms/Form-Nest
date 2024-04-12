import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the path as needed

const ResendVerification = () => {
    const { emailForVerification, requestNewVerificationCode } = useAuth();
    const [message, setMessage] = useState('');

    const handleResendCode = async () => {
        try {
            await requestNewVerificationCode(emailForVerification);
            setMessage("A new verification code has been sent to your email.");
        } catch (error) {
            setMessage("Failed to resend verification code. Please try again later.");
        }
    };

    return (
        <div>
            {message && <p>{message}</p>}
            <button onClick={handleResendCode}>Resend Verification Code</button>
        </div>
    );
};

export default ResendVerification;
