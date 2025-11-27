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
      <div className="session-badge loading">
        <span className="loading-text">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="session-badge authenticated">
        <span className="user-email">{user.email || user.id}</span>
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="session-badge unauthenticated">
      <Link to="/login" className="login-link">
        Login
      </Link>
    </div>
  );
};

export default SessionBadge;
