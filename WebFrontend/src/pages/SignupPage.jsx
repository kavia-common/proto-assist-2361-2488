import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import registrationApi from '../services/registrationApi';
import env from '../config/env';
import './SignupPage.css';

/**
 * Signup Page Component
 * 
 * Provides user registration form with user_id, email (optional), password, and confirm password fields.
 * Includes basic validation and success flow (auto-login on success or redirect to /login with success notice).
 * Feature-gated behind env.enableSignup flag.
 * 
 * PUBLIC_INTERFACE
 */
const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useSession();
  
  const [formData, setFormData] = useState({
    user_id: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Check if signup is enabled
  const signupEnabled = env.enableSignup !== false; // Default to true if not set

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/chat';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  /**
   * Validate form fields
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const errors = {};

    // Validate user_id
    if (!formData.user_id.trim()) {
      errors.user_id = 'User ID is required';
    } else if (formData.user_id.length < 3) {
      errors.user_id = 'User ID must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.user_id)) {
      errors.user_id = 'User ID can only contain letters, numbers, hyphens, and underscores';
    }

    // Validate email (optional but must be valid if provided)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (error) setError('');
    if (success) setSuccess('');
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare registration data
      const registrationData = {
        user_id: formData.user_id.trim(),
        password: formData.password
      };

      // Add email if provided
      if (formData.email.trim()) {
        registrationData.email = formData.email.trim();
      }

      // Attempt registration
      const result = await registrationApi.register(registrationData);

      // Registration successful
      setSuccess('Account created successfully!');

      // Attempt auto-login
      // The backend should return a session or we can try to login
      if (result.token || result.session_id) {
        // Backend provided token, try to use it for auto-login
        const loginResult = await login({
          user_id: registrationData.user_id,
          password: registrationData.password
        });

        if (loginResult.success) {
          // Auto-login successful, navigate to chat
          setTimeout(() => {
            navigate('/chat', { replace: true });
          }, 1000);
        } else {
          // Auto-login failed, redirect to login page with success message
          setTimeout(() => {
            navigate('/login', { 
              replace: true, 
              state: { message: 'Account created! Please log in.' }
            });
          }, 2000);
        }
      } else {
        // No token returned, redirect to login page with success message
        setTimeout(() => {
          navigate('/login', { 
            replace: true, 
            state: { message: 'Account created successfully! Please log in.' }
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Registration failed:', err);
      
      // Handle specific error cases
      if (err.code === 409) {
        setError('User ID already exists. Please choose a different one.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If signup is disabled, show a message
  if (!signupEnabled) {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-header">
            <h1>Sign Up</h1>
          </div>
          <div className="feature-disabled-message">
            <p>User registration is currently disabled.</p>
            <p>Please contact your administrator or use an existing account.</p>
            <Link to="/login" className="link-button">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create Your Account</h1>
          <p>Join Proto Assistant to start creating wireframes</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message" role="alert">
              {success}
            </div>
          )}

          {!signupEnabled && (
            <div className="info-message" role="alert">
              Note: Registration is currently in development. Backend /register endpoint may not be ready.
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user_id">
              User ID <span className="required">*</span>
            </label>
            <input
              type="text"
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="Choose a unique username"
              disabled={isLoading}
              autoComplete="username"
              required
              aria-describedby={validationErrors.user_id ? "user_id-error" : undefined}
              aria-invalid={!!validationErrors.user_id}
            />
            {validationErrors.user_id && (
              <span id="user_id-error" className="field-error">
                {validationErrors.user_id}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="optional">(optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              disabled={isLoading}
              autoComplete="email"
              aria-describedby={validationErrors.email ? "email-error" : undefined}
              aria-invalid={!!validationErrors.email}
            />
            {validationErrors.email && (
              <span id="email-error" className="field-error">
                {validationErrors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              disabled={isLoading}
              autoComplete="new-password"
              required
              aria-describedby={validationErrors.password ? "password-error" : "password-hint"}
              aria-invalid={!!validationErrors.password}
            />
            {validationErrors.password ? (
              <span id="password-error" className="field-error">
                {validationErrors.password}
              </span>
            ) : (
              <span id="password-hint" className="field-hint">
                At least 8 characters with uppercase, lowercase, and number
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm Password <span className="required">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              disabled={isLoading}
              autoComplete="new-password"
              required
              aria-describedby={validationErrors.confirmPassword ? "confirm-error" : undefined}
              aria-invalid={!!validationErrors.confirmPassword}
            />
            {validationErrors.confirmPassword && (
              <span id="confirm-error" className="field-error">
                {validationErrors.confirmPassword}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
