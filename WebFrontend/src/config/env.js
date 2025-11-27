/**
 * Environment Configuration Module
 * 
 * This module reads environment variables and exports configuration values
 * for the application. It supports various REACT_APP_* environment variables
 * and provides sensible defaults.
 * 
 * PUBLIC_INTERFACE
 */

/**
 * Get the API base URL from environment variables
 * Priority: REACT_APP_API_BASE > REACT_APP_BACKEND_URL > default '/api'
 */
const getApiBase = () => {
  return process.env.REACT_APP_API_BASE 
    || process.env.REACT_APP_BACKEND_URL 
    || '/api';
};

/**
 * Get WebSocket URL from environment variables
 */
const getWsUrl = () => {
  return process.env.REACT_APP_WS_URL || 'ws://localhost:3000/ws';
};

/**
 * Get log level from environment variables
 */
const getLogLevel = () => {
  return process.env.REACT_APP_LOG_LEVEL || 'info';
};

/**
 * Parse feature flags from environment variable
 * Expected format: "flag1:true,flag2:false"
 */
const getFeatureFlags = () => {
  const flagsString = process.env.REACT_APP_FEATURE_FLAGS || '';
  const flags = {};
  
  if (flagsString) {
    flagsString.split(',').forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value !== undefined) {
        flags[key.trim()] = value.trim() === 'true';
      }
    });
  }
  
  return flags;
};

/**
 * Check if experiments are enabled
 */
const getExperimentsEnabled = () => {
  return process.env.REACT_APP_EXPERIMENTS_ENABLED === 'true';
};

/**
 * Check if demo login is enabled
 * Enabled by default in non-production environments or via explicit flag
 */
const getEnableDemoLogin = () => {
  const nodeEnv = process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development';
  
  // If explicitly set, use that value
  if (process.env.REACT_APP_ENABLE_DEMO_LOGIN !== undefined) {
    return process.env.REACT_APP_ENABLE_DEMO_LOGIN === 'true';
  }
  
  // Otherwise, enable in non-production environments
  return nodeEnv !== 'production';
};

/**
 * Check if signup/registration is enabled
 * Enabled by default unless explicitly disabled
 */
const getEnableSignup = () => {
  // If explicitly set, use that value
  if (process.env.REACT_APP_ENABLE_SIGNUP !== undefined) {
    return process.env.REACT_APP_ENABLE_SIGNUP === 'true';
  }
  
  // Otherwise, enabled by default
  return true;
};

// PUBLIC_INTERFACE
/**
 * Environment configuration object
 * Exports all configuration values used throughout the application
 */
const env = {
  apiBase: getApiBase(),
  wsUrl: getWsUrl(),
  logLevel: getLogLevel(),
  featureFlags: getFeatureFlags(),
  experimentsEnabled: getExperimentsEnabled(),
  enableDemoLogin: getEnableDemoLogin(),
  enableSignup: getEnableSignup(),
  nodeEnv: process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV || 'development',
  frontendUrl: process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000',
  port: process.env.REACT_APP_PORT || '3000',
  healthcheckPath: process.env.REACT_APP_HEALTHCHECK_PATH || '/health',
  enableSourceMaps: process.env.REACT_APP_ENABLE_SOURCE_MAPS === 'true',
  telemetryDisabled: process.env.REACT_APP_NEXT_TELEMETRY_DISABLED === '1',
  trustProxy: process.env.REACT_APP_TRUST_PROXY === 'true'
};

export default env;
