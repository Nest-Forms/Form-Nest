import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ResendVerification from '../components/ResendVerification';
import * as Yup from 'yup';
import '../App.css';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        user,
        isEmailVerificationRequired,
        login,
        submitEmailVerificationCode,
        setIsEmailVerificationRequired,
    } = useAuth();

    // Handle redirect after login
    useEffect(() => {
        if (user) {
            navigate('/');
        }
        const { needVerification } = location.state || {};
        if (needVerification) {
            setIsEmailVerificationRequired(true);
        }
    }, [user, navigate, setIsEmailVerificationRequired, location.state]);

    return (
        <div className="login-container">
            {!isEmailVerificationRequired ? (
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={Yup.object({
                        email: Yup.string().email('Invalid email').required('Required'),
                        password: Yup.string().required('Required'),
                    })}
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
            ) : (
                <Formik
                    initialValues={{ verificationCode: '' }}
                    validationSchema={Yup.object({
                        verificationCode: Yup.string().required('Verification code is required'),
                    })}
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
