import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import sessionApi from '../services/sessionApi';

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
 * Provides session state and methods to child components.
 * Handles token persistence, session loading, login/logout, and 401 redirects.
 * 
 * PUBLIC_INTERFACE
 */
export const SessionProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => {
    // Initialize from localStorage
    return localStorage.getItem('auth_token');
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);

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
   * Load session from stored token and validate with backend
   * Calls GET /session to fetch current session status and user data
   * 
   * PUBLIC_INTERFACE
   */
  const loadSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        // Validate token with backend by fetching session
        const session = await sessionApi.getSession();
        
        if (session && session.status === 'active') {
          setToken(storedToken);
          setUser({
            id: session.user_id,
            email: session.user_id, // Using user_id as email for display
            sessionId: session.session_id,
            expiresAt: session.expires_at
          });
        } else {
          // Session expired or invalid
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      // If 401 or any error, clear token
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
      setSessionLoaded(true);
    }
  }, [setToken]);

  /**
   * Login method
   * Calls sessionApi.createSession and stores JWT token
   * 
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.user_id - User identifier
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login result with success flag
   * 
   * PUBLIC_INTERFACE
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      // Call backend login endpoint
      const session = await sessionApi.createSession({
        user_id: credentials.user_id,
        password: credentials.password
      });
      
      // Extract token from response (assuming backend returns token in session object)
      // The OpenAPI spec shows Session object is returned, but JWT token should be included
      // We'll look for common token fields
      const jwtToken = session.token || session.jwt || session.access_token || session.session_id;
      
      if (jwtToken) {
        setToken(jwtToken);
        setUser({
          id: session.user_id,
          email: session.user_id,
          sessionId: session.session_id,
          expiresAt: session.expires_at
        });
        return { success: true, session };
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed',
        code: error.code
      };
    } finally {
      setIsLoading(false);
    }
  }, [setToken]);

  /**
   * Logout method
   * Clears session state, stored token, and optionally calls backend logout
   * 
   * PUBLIC_INTERFACE
   */
  const logout = useCallback(async () => {
    try {
      // Try to end session on backend
      await sessionApi.endSession();
    } catch (error) {
      console.error('Backend logout failed:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Always clear local state
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [setToken]);

  /**
   * Handle 401 Unauthorized errors
   * Clears token and redirects to login
   * This method can be called by httpClient interceptor
   * 
   * PUBLIC_INTERFACE
   */
  const handle401 = useCallback(() => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  }, [setToken]);

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated,
    sessionLoaded,
    setToken,
    getToken,
    loadSession,
    login,
    logout,
    handle401
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
