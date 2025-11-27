import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useSession } from '../context/SessionContext';
import SessionBadge from './SessionBadge';
import './Navbar.css';

/**
 * Navbar Component
 * 
 * Provides navigation links and displays session status
 * Displays demo mode banner when in development session
 * 
 * PUBLIC_INTERFACE
 */
const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme, isFeatureEnabled } = useApp();
  const { isDemoMode } = useSession();

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
    <>
      {isDemoMode && (
        <div className="demo-mode-banner" role="alert" aria-live="polite">
          <span className="demo-icon">🚀</span>
          <span className="demo-text">
            <strong>DEMO MODE</strong> - Development testing session active. Not connected to backend.
          </span>
        </div>
      )}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="navbar-container">
          <div className="navbar-brand">
            <Link to="/" aria-label="Proto Assistant home">Proto Assistant</Link>
          </div>

          <div className="navbar-links" role="menubar">
            <Link 
              to="/" 
              className={isActive('/') ? 'nav-link active' : 'nav-link'}
              role="menuitem"
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              to="/chat" 
              className={isActive('/chat') ? 'nav-link active' : 'nav-link'}
              role="menuitem"
              aria-current={isActive('/chat') ? 'page' : undefined}
            >
              Chat
            </Link>
            <Link 
              to="/wireframe" 
              className={isActive('/wireframe') ? 'nav-link active' : 'nav-link'}
              role="menuitem"
              aria-current={isActive('/wireframe') ? 'page' : undefined}
            >
              Wireframe
            </Link>
            <Link 
              to="/history" 
              className={isActive('/history') ? 'nav-link active' : 'nav-link'}
              role="menuitem"
              aria-current={isActive('/history') ? 'page' : undefined}
            >
              History
            </Link>
            
            {/* Conditional feature flag demo - show additional nav item if enabled */}
            {isFeatureEnabled('showAdvancedFeatures') && (
              <Link 
                to="/advanced" 
                className={isActive('/advanced') ? 'nav-link active' : 'nav-link'}
                role="menuitem"
                aria-current={isActive('/advanced') ? 'page' : undefined}
                aria-label="Advanced features (feature flag enabled)"
              >
                Advanced
              </Link>
            )}
            
            {/* Healthcheck link - shown if showHealthcheck feature flag is enabled or in development */}
            {(isFeatureEnabled('showHealthcheck') || process.env.NODE_ENV === 'development') && (
              <Link 
                to="/health" 
                className={isActive('/health') ? 'nav-link active' : 'nav-link'}
                role="menuitem"
                aria-current={isActive('/health') ? 'page' : undefined}
                aria-label="System health and configuration"
              >
                Health
              </Link>
            )}
          </div>

          <div className="navbar-actions" role="toolbar" aria-label="User actions">
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              aria-pressed={theme === 'dark'}
              type="button"
            >
              <span role="img" aria-label={theme === 'light' ? 'moon icon' : 'sun icon'}>
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>

            <SessionBadge />
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
