import env from '../config/env';

/**
 * Logger Utility Module
 * 
 * Provides a configurable logging interface that respects the REACT_APP_LOG_LEVEL
 * environment variable. Supports different log levels: debug, info, warn, error.
 * 
 * PUBLIC_INTERFACE
 */

// Log level priorities
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4
};

/**
 * Get the current log level from environment configuration
 * @returns {number} Numeric log level priority
 */
const getCurrentLogLevel = () => {
  const level = env.logLevel.toLowerCase();
  return LOG_LEVELS[level] !== undefined ? LOG_LEVELS[level] : LOG_LEVELS.info;
};

/**
 * Check if a log level should be output
 * @param {string} level - Log level to check
 * @returns {boolean} True if the level should be logged
 */
const shouldLog = (level) => {
  const currentLevel = getCurrentLogLevel();
  const targetLevel = LOG_LEVELS[level];
  return targetLevel >= currentLevel;
};

/**
 * Format log message with timestamp and context
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} context - Additional context
 * @returns {Array} Formatted log arguments
 */
const formatLogMessage = (level, message, context) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  if (context && Object.keys(context).length > 0) {
    return [prefix, message, context];
  }
  return [prefix, message];
};

/**
 * Log a debug message
 * Only outputs if log level is debug
 * 
 * @param {string} message - Message to log
 * @param {Object} [context] - Additional context data
 * 
 * PUBLIC_INTERFACE
 */
export const debug = (message, context) => {
  if (shouldLog('debug')) {
    console.debug(...formatLogMessage('debug', message, context));
  }
};

/**
 * Log an info message
 * Outputs if log level is debug or info
 * 
 * @param {string} message - Message to log
 * @param {Object} [context] - Additional context data
 * 
 * PUBLIC_INTERFACE
 */
export const info = (message, context) => {
  if (shouldLog('info')) {
    console.info(...formatLogMessage('info', message, context));
  }
};

/**
 * Log a warning message
 * Outputs if log level is debug, info, or warn
 * 
 * @param {string} message - Message to log
 * @param {Object} [context] - Additional context data
 * 
 * PUBLIC_INTERFACE
 */
export const warn = (message, context) => {
  if (shouldLog('warn')) {
    console.warn(...formatLogMessage('warn', message, context));
  }
};

/**
 * Log an error message
 * Outputs if log level is debug, info, warn, or error
 * 
 * @param {string} message - Message to log
 * @param {Error|Object} [error] - Error object or additional context
 * 
 * PUBLIC_INTERFACE
 */
export const error = (message, errorObj) => {
  if (shouldLog('error')) {
    const context = errorObj instanceof Error 
      ? { message: errorObj.message, stack: errorObj.stack }
      : errorObj;
    console.error(...formatLogMessage('error', message, context));
  }
};

/**
 * Log API request
 * Logs API request details at debug level
 * 
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} [data] - Request data
 * 
 * PUBLIC_INTERFACE
 */
export const logApiRequest = (method, url, data) => {
  debug(`API Request: ${method} ${url}`, { data });
};

/**
 * Log API response
 * Logs API response details at debug level
 * 
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {number} status - Response status code
 * @param {Object} [data] - Response data
 * 
 * PUBLIC_INTERFACE
 */
export const logApiResponse = (method, url, status, data) => {
  debug(`API Response: ${method} ${url} - ${status}`, { data });
};

/**
 * Log API error
 * Logs API error details at error level
 * 
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Error} error - Error object
 * 
 * PUBLIC_INTERFACE
 */
export const logApiError = (method, url, errorObj) => {
  error(`API Error: ${method} ${url}`, errorObj);
};

/**
 * Log component lifecycle event
 * Logs component mount/unmount at debug level
 * 
 * @param {string} componentName - Component name
 * @param {string} event - Lifecycle event (mount, unmount, update)
 * @param {Object} [props] - Component props
 * 
 * PUBLIC_INTERFACE
 */
export const logComponentEvent = (componentName, event, props) => {
  debug(`Component ${componentName} - ${event}`, { props });
};

/**
 * Log feature flag usage
 * Logs when a feature flag is checked
 * 
 * @param {string} flagName - Feature flag name
 * @param {boolean} value - Flag value
 * 
 * PUBLIC_INTERFACE
 */
export const logFeatureFlag = (flagName, value) => {
  debug(`Feature flag: ${flagName} = ${value}`);
};

// PUBLIC_INTERFACE
const logger = {
  debug,
  info,
  warn,
  error,
  logApiRequest,
  logApiResponse,
  logApiError,
  logComponentEvent,
  logFeatureFlag
};

export default logger;
