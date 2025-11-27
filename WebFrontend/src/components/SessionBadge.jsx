import React from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import './SessionBadge.css';

/**
 * SessionBadge Component
 * 
 * Displays session status in the navbar with user email and logout button.
 * Shows login link if not authenticated.
 * 
 * PUBLIC_INTERFACE
 */
const SessionBadge = () => {
  const { isAuthenticated, user, logout, isLoading } = useSession();

  /**
   * Handle logout button click
   */
  const handleLogout = async () => {
    await logout();
    // Redirect to home page after logout
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="session-badge loading" role="status" aria-live="polite">
        <span className="loading-text">Loading session...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="session-badge authenticated" role="region" aria-label="User session">
        <span className="user-email" aria-label={`Logged in as ${user.email || user.id}`}>
          {user.email || user.id}
        </span>
        <button 
          type="button"
          className="logout-btn" 
          onClick={handleLogout}
          aria-label="Logout from account"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="session-badge unauthenticated">
      <Link to="/login" className="login-link" aria-label="Go to login page">
        Login
      </Link>
    </div>
  );
};

export default SessionBadge;
