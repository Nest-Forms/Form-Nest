import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import 'bootstrap/dist/css/bootstrap.min.css';

// Schema for initiating a password reset
const initiateResetSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

// Schema for completing a password reset
const completeResetSchema = Yup.object().shape({
  verificationCode: Yup.string().required('Verification code is required'),
  newPassword: Yup.string().required('New password is required'),
  confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirming new password is required'),
});

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // Use step 1 for requesting reset, step 2 for completing reset
  const [emailForReset, setEmailForReset] = useState('');
  const { initiatePasswordReset, confirmPasswordReset } = useAuth();
  const navigate = useNavigate(); // Use the hook here

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          {step === 1 ? (
            // Step 1: Request password reset
            <Formik
              initialValues={{ email: '' }}
              validationSchema={initiateResetSchema}
              onSubmit={(values, { setSubmitting }) => {
                initiatePasswordReset(values.email);
                setEmailForReset(values.email); // Save email for next step
                setStep(2); // Proceed to step 2
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="form-group">
                  <h2 className="text-center mb-4">Reset Password</h2>
                  <Field type="email" name="email" className="form-control" placeholder="Your email" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-3 w-100">
                    Send Reset Code
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            // Step 2: Complete password reset
            <Formik
              initialValues={{ verificationCode: '', newPassword: '', confirmNewPassword: '' }}
              validationSchema={completeResetSchema}
              onSubmit={(values, { setSubmitting }) => {
                confirmPasswordReset(emailForReset, values.verificationCode, values.newPassword)
                  .then(() => navigate('/login')) // Redirect to login page upon successful reset
                  .catch((error) => console.error("Error confirming password reset:", error))
                  .finally(() => setSubmitting(false));
              }}
            >
              {({ isSubmitting }) => (
                <Form className="form-group">
                  <h2 className="text-center mb-4">Enter New Password</h2>
                  <Field type="text" name="verificationCode" className="form-control" placeholder="Verification Code" />
                  <ErrorMessage name="verificationCode" component="div" className="text-danger" />
                  <Field type="password" name="newPassword" className="form-control mt-3" placeholder="New Password" />
                  <ErrorMessage name="newPassword" component="div" className="text-danger" />
                  <Field type="password" name="confirmNewPassword" className="form-control mt-3" placeholder="Confirm New Password" />
                  <ErrorMessage name="confirmNewPassword" component="div" className="text-danger" />
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-3 w-100">
                    Reset Password
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
