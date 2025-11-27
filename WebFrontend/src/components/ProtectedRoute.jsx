import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../context/SessionContext';

/**
 * ProtectedRoute Component
 * 
 * Wrapper component that guards routes requiring authentication.
 * Redirects to login page if user is not authenticated, preserving
 * the attempted location for post-login redirect.
 * Shows loading state while session is being loaded.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * 
 * PUBLIC_INTERFACE
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, sessionLoaded, isLoading } = useSession();
  const location = useLocation();

  // Wait for initial session load
  if (!sessionLoaded || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 60px)',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the location they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
