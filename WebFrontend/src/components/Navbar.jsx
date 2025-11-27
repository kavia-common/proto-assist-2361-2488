import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext';
import { useApp } from '../context/AppContext';
import './Navbar.css';

/**
 * Navbar Component
 * 
 * Provides navigation links and displays session status
 * 
 * PUBLIC_INTERFACE
 */
const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useSession();
  const { theme, toggleTheme } = useApp();

  /**
   * Check if a route is currently active
   */
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">Proto Assistant</Link>
        </div>

        <div className="navbar-links">
          <Link 
            to="/" 
            className={isActive('/') ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link 
            to="/chat" 
            className={isActive('/chat') ? 'nav-link active' : 'nav-link'}
          >
            Chat
          </Link>
          <Link 
            to="/wireframe" 
            className={isActive('/wireframe') ? 'nav-link active' : 'nav-link'}
          >
            Wireframe
          </Link>
          <Link 
            to="/history" 
            className={isActive('/history') ? 'nav-link active' : 'nav-link'}
          >
            History
          </Link>
        </div>

        <div className="navbar-actions">
          <button 
            className="theme-toggle-btn" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <div className="session-indicator">
            {isAuthenticated ? (
              <>
                <span className="user-email">{user?.email || 'User'}</span>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="login-link">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
