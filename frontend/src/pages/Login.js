import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ResendVerification from '../components/ResendVerification';
import * as Yup from 'yup';
import '../App.css';

// Schema for regular login
const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
});

// Schema for setting a new password (if required)
const newPasswordSchema = Yup.object().shape({
    newPassword: Yup.string().required('New password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirming new password is required'),
});

// Schema for email verification code submission
const emailVerificationSchema = Yup.object().shape({
    verificationCode: Yup.string().required('Verification code is required'),
});

const Login = () => {
    const navigate = useNavigate();
    const { user, authChallenge, isEmailVerificationRequired, login, completeNewPasswordChallenge, submitEmailVerificationCode } = useAuth();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    return (
        <div className="login-container">
            {!isEmailVerificationRequired ? (
                authChallenge?.challengeName === 'NEW_PASSWORD_REQUIRED' ? (
                    <Formik
                        initialValues={{ newPassword: '', confirmNewPassword: '' }}
                        validationSchema={newPasswordSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            completeNewPasswordChallenge(values.newPassword);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="login-form">
                                <h2>Set New Password</h2>
                                <Field type="password" name="newPassword" placeholder="New Password" />
                                <ErrorMessage name="newPassword" component="div" />
                                <Field type="password" name="confirmNewPassword" placeholder="Confirm New Password" />
                                <ErrorMessage name="confirmNewPassword" component="div" />
                                <button type="submit" disabled={isSubmitting}>Set New Password</button>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    // Regular login form
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        validationSchema={loginSchema}
                        onSubmit={(values, { setSubmitting }) => {
                            login(values);
                            setSubmitting(false);
                        }}
                    >
                        {({ isSubmitting }) => (
                            <Form className="login-form">
                                <h2>Login</h2>
                                <Field type="email" name="email" placeholder="Email" />
                                <ErrorMessage name="email" component="div" />
                                <Field type="password" name="password" placeholder="Password" />
                                <ErrorMessage name="password" component="div" />
                                <button type="submit" disabled={isSubmitting}>Login</button>
                                <div className="text-center">
                                <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                            </div>
                            </Form>
                        )}
                    </Formik>
                )
            ) : (
                // Email verification code submission form
                <Formik
                    initialValues={{ verificationCode: '' }}
                    validationSchema={emailVerificationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        submitEmailVerificationCode(values.verificationCode);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <>
                            <Form className="login-form">
                                <h2>Email Verification</h2>
                                <Field type="text" name="verificationCode" placeholder="Verification Code" />
                                <ErrorMessage name="verificationCode" component="div" />
                                  <button type="submit" disabled={isSubmitting}>Verify Email</button>
                            </Form>
                            <ResendVerification />
                        </>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default Login;
