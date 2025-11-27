import React, { createContext, useContext, useState, useEffect } from 'react';
import env from '../config/env';
import logger from '../utils/logger';

/**
 * AppContext
 * 
 * Manages application-wide state including theme, feature flags,
 * and other global settings.
 * 
 * PUBLIC_INTERFACE
 */
const AppContext = createContext(null);

/**
 * Hook to access AppContext
 * 
 * PUBLIC_INTERFACE
 */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

/**
 * AppProvider Component
 * 
 * Provides application state and methods to child components
 * 
 * PUBLIC_INTERFACE
 */
export const AppProvider = ({ children }) => {
  // Theme management (using existing theme from App.js)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  // Feature flags from environment
  const [featureFlags, setFeatureFlags] = useState(env.featureFlags);

  // Experiments enabled flag
  const [experimentsEnabled] = useState(env.experimentsEnabled);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    logger.info(`Theme changed to: ${theme}`);
  }, [theme]);

  // Log app initialization
  useEffect(() => {
    logger.info('Application initialized', {
      nodeEnv: env.nodeEnv,
      logLevel: env.logLevel,
      experimentsEnabled: env.experimentsEnabled,
      featureFlags: env.featureFlags
    });
  }, []);

  /**
   * Toggle between light and dark theme
   * 
   * PUBLIC_INTERFACE
   */
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  /**
   * Check if a specific feature flag is enabled
   * 
   * PUBLIC_INTERFACE
   */
  const isFeatureEnabled = (featureName) => {
    return featureFlags[featureName] === true;
  };

  /**
   * Update feature flags (for runtime changes)
   * 
   * PUBLIC_INTERFACE
   */
  const updateFeatureFlags = (newFlags) => {
    setFeatureFlags(prev => ({ ...prev, ...newFlags }));
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    featureFlags,
    updateFeatureFlags,
    isFeatureEnabled,
    experimentsEnabled,
    logger
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
