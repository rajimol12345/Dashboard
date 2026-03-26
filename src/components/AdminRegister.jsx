import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Toast } from 'bootstrap'; // ✅ Correct import

const AdminRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful, isSubmitting },
    reset,
  } = useForm();

  const navigate = useNavigate();

  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success'); // 'success' or 'danger'
  const toastRef = useRef(null);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const showToast = (message, type = 'success') => {
    setToastMsg(message);
    setToastType(type);
    const toast = new Toast(toastRef.current); // ✅ Fixed
    toast.show();
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/admin/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response.status === 200 || response.status === 201) {
        showToast('Admin registered successfully!', 'success');
        setTimeout(() => {
          navigate('/admin/login');
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(errorMsg, 'danger');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="text-center mb-4">Admin Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="border p-4 rounded bg-light">
        <div className="mb-3">
          <input
            className="form-control"
            {...register('name', { required: 'Name is required' })}
            placeholder="Full Name"
            autoComplete="name"
          />
          {errors.name && <p className="text-danger small">{errors.name.message}</p>}
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            placeholder="Email"
            autoComplete="email"
          />
          {errors.email && <p className="text-danger small">{errors.email.message}</p>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            placeholder="Password"
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-danger small">{errors.password.message}</p>
          )}
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            {...register('confirmPassword', {
              validate: (value) =>
                value === watch('password') || 'Passwords do not match',
            })}
            placeholder="Confirm Password"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <p className="text-danger small">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Admin'}
        </button>
      </form>

      <p className="text-center mt-3">
        Already registered?{' '}
        <Link to="/admin/login" className="text-primary">
          Login here
        </Link>
      </p>

      {/* Bootstrap Toast */}
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 9999 }}
      >
        <div
          ref={toastRef}
          className={`toast align-items-center text-white bg-${toastType} border-0`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toastMsg}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
