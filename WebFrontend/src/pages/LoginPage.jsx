import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import './LoginPage.css';

/**
 * Login Page Component
 * 
 * Provides user authentication form with user_id and password fields.
 * Calls sessionApi.login via SessionContext and stores JWT token on success.
 * Redirects to chat page or previous location after successful login.
 * 
 * PUBLIC_INTERFACE
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useSession();
  
  const [formData, setFormData] = useState({
    user_id: '',
    password: ''
  });
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they tried to visit or default to chat
      const from = location.state?.from?.pathname || '/chat';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (error) setError('');
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate input
    if (!formData.user_id.trim() || !formData.password.trim()) {
      setError('Please enter both user ID and password');
      return;
    }

    // Attempt login
    const result = await login({
      user_id: formData.user_id,
      password: formData.password
    });

    if (!result.success) {
      setError(result.error || 'Login failed. Please check your credentials.');
    } else {
      // Navigation will be handled by useEffect when isAuthenticated changes
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome to Proto Assistant</h1>
          <p>Sign in to start creating wireframes</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="user_id">User ID</label>
            <input
              type="text"
              id="user_id"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="Enter your user ID"
              disabled={isLoading}
              autoComplete="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Your AI-powered wireframe generation assistant</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
