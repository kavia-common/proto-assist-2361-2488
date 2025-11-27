import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * SessionContext
 * 
 * Manages user session state including authentication token,
 * user information, and session lifecycle methods.
 * 
 * PUBLIC_INTERFACE
 */
const SessionContext = createContext(null);

/**
 * Hook to access SessionContext
 * 
 * PUBLIC_INTERFACE
 */
export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

/**
 * SessionProvider Component
 * 
 * Provides session state and methods to child components
 * 
 * PUBLIC_INTERFACE
 */
export const SessionProvider = ({ children }) => {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Set authentication token and update authentication state
   * 
   * PUBLIC_INTERFACE
   */
  const setToken = useCallback((newToken) => {
    setTokenState(newToken);
    setIsAuthenticated(!!newToken);
    
    // Store token in localStorage for persistence
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, []);

  /**
   * Get current authentication token
   * 
   * PUBLIC_INTERFACE
   */
  const getToken = useCallback(() => {
    return token || localStorage.getItem('auth_token');
  }, [token]);

  /**
   * Load session from stored token (placeholder)
   * This will be implemented later to validate token and fetch user data
   * 
   * PUBLIC_INTERFACE
   */
  const loadSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        // Placeholder: In future, validate token with backend
        setToken(storedToken);
        // Placeholder: Set user data from backend response
        setUser({ id: 'placeholder', email: 'user@example.com' });
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  /**
   * Login method (placeholder)
   * Will be implemented with actual authentication logic
   * 
   * PUBLIC_INTERFACE
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      // Placeholder: Make API call to login endpoint
      console.log('Login called with:', credentials);
      // For now, just set a dummy token
      const dummyToken = 'placeholder_token_' + Date.now();
      setToken(dummyToken);
      setUser({ id: 'user1', email: credentials.email });
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  /**
   * Logout method
   * Clears session state and stored token
   * 
   * PUBLIC_INTERFACE
   */
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, [setToken]);

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated,
    setToken,
    getToken,
    loadSession,
    login,
    logout
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
