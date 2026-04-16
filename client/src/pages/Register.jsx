// register page  create a new account
import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Auth.css';

export default function Register() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [error, setError]           = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // no point being here if already logged in
  if (loading) return <LoadingSpinner />;
  if (user)    return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!formData.name.trim())  return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Enter a valid email address';
    if (formData.password.length < 6)  return 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // validate on the client before even hitting the API
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/register', {
        name:     formData.name,
        email:    formData.email,
        password: formData.password,
      });
      login(data); // store the token and user, they're now logged in
      navigate('/profile-setup'); // send them to the profile setup form next
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-wrapper">

        {/* basket icon + branding at the top */}
        <div className="auth-brand">
          <img src="/shopping-basket-icon.svg" alt="Carty logo" className="auth-brand__icon" />
          <span className="auth-brand__name">Carty</span>
        </div>

        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">Please Enter Your Details</p>

        {/* sign up with Google - just UI for now, no OAuth connected */}
        <button type="button" className="auth-google-btn">
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sign Up With Google
        </button>

        <div className="auth-divider"><span>OR</span></div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="input-with-toggle">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an Account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
