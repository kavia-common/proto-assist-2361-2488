import React, { useState } from 'react';
import env from '../config/env';
import httpClient from '../services/httpClient';
import logger from '../utils/logger';
import './Healthcheck.css';

/**
 * Healthcheck Page Component
 * 
 * Displays current environment configuration and provides backend health check functionality.
 * This page is useful for debugging configuration issues and verifying connectivity to the backend.
 * 
 * Features:
 * - Display all environment variables
 * - Ping backend health endpoint
 * - Show connection status
 * - Helpful for debugging deployment and configuration issues
 * 
 * PUBLIC_INTERFACE
 */
const Healthcheck = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  /**
   * Ping the backend health endpoint
   * Uses the configured health path from environment variables
   */
  const pingBackend = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const healthPath = env.healthcheckPath || '/health';
      logger.info(`Pinging backend health endpoint: ${healthPath}`);
      
      // Ping the health endpoint without authentication
      const response = await httpClient.get(healthPath, { skipAuth: true });
      
      setHealthStatus({
        status: 'healthy',
        response: response,
        timestamp: new Date().toISOString()
      });
      setLastChecked(new Date());
      logger.info('Backend health check successful', response);
    } catch (err) {
      logger.error('Backend health check failed', err);
      setError(err.message || 'Failed to reach backend');
      setHealthStatus({
        status: 'unhealthy',
        error: err,
        timestamp: new Date().toISOString()
      });
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format feature flags for display
   */
  const formatFeatureFlags = () => {
    if (!env.featureFlags || Object.keys(env.featureFlags).length === 0) {
      return 'None configured';
    }
    
    return Object.entries(env.featureFlags)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  /**
   * Get status indicator class based on health status
   */
  const getStatusClass = () => {
    if (!healthStatus) return 'status-unknown';
    return healthStatus.status === 'healthy' ? 'status-healthy' : 'status-unhealthy';
  };

  return (
    <div className="healthcheck-page">
      <div className="healthcheck-container">
        <header className="healthcheck-header">
          <h1>System Health & Configuration</h1>
          <p className="healthcheck-subtitle">
            View environment configuration and verify backend connectivity
          </p>
        </header>

        {/* Environment Configuration Section */}
        <section className="config-section">
          <h2>Environment Configuration</h2>
          <div className="config-grid">
            <div className="config-item">
              <label>API Base URL</label>
              <code>{env.apiBase}</code>
            </div>
            
            <div className="config-item">
              <label>WebSocket URL</label>
              <code>{env.wsUrl}</code>
            </div>
            
            <div className="config-item">
              <label>Frontend URL</label>
              <code>{env.frontendUrl}</code>
            </div>
            
            <div className="config-item">
              <label>Health Check Path</label>
              <code>{env.healthcheckPath}</code>
            </div>
            
            <div className="config-item">
              <label>Log Level</label>
              <code>{env.logLevel}</code>
            </div>
            
            <div className="config-item">
              <label>Node Environment</label>
              <code>{env.nodeEnv}</code>
            </div>
            
            <div className="config-item">
              <label>Port</label>
              <code>{env.port}</code>
            </div>
            
            <div className="config-item">
              <label>Feature Flags</label>
              <code>{formatFeatureFlags()}</code>
            </div>
            
            <div className="config-item">
              <label>Experiments Enabled</label>
              <code>{env.experimentsEnabled ? 'Yes' : 'No'}</code>
            </div>
            
            <div className="config-item">
              <label>Source Maps Enabled</label>
              <code>{env.enableSourceMaps ? 'Yes' : 'No'}</code>
            </div>
            
            <div className="config-item">
              <label>Telemetry Disabled</label>
              <code>{env.telemetryDisabled ? 'Yes' : 'No'}</code>
            </div>
            
            <div className="config-item">
              <label>Trust Proxy</label>
              <code>{env.trustProxy ? 'Yes' : 'No'}</code>
            </div>
          </div>
        </section>

        {/* Backend Health Check Section */}
        <section className="health-section">
          <h2>Backend Health Check</h2>
          <p className="health-description">
            Test connectivity to the backend API by pinging the health endpoint.
          </p>
          
          <div className="health-actions">
            <button 
              className="btn btn-primary"
              onClick={pingBackend}
              disabled={loading}
              aria-label="Ping backend health endpoint"
            >
              {loading ? 'Checking...' : 'Ping Backend'}
            </button>
            
            {lastChecked && (
              <span className="last-checked">
                Last checked: {lastChecked.toLocaleTimeString()}
              </span>
            )}
          </div>

          {/* Health Status Display */}
          {healthStatus && (
            <div className={`health-status ${getStatusClass()}`}>
              <div className="status-header">
                <span className="status-indicator" aria-label={`Status: ${healthStatus.status}`}>
                  {healthStatus.status === 'healthy' ? '✓' : '✗'}
                </span>
                <h3>{healthStatus.status === 'healthy' ? 'Backend is Healthy' : 'Backend Unreachable'}</h3>
              </div>
              
              {healthStatus.status === 'healthy' && healthStatus.response && (
                <div className="status-details">
                  <h4>Response:</h4>
                  <pre>{JSON.stringify(healthStatus.response, null, 2)}</pre>
                </div>
              )}
              
              {healthStatus.status === 'unhealthy' && (
                <div className="status-details error-details">
                  <h4>Error Details:</h4>
                  <p className="error-message">{error}</p>
                  {healthStatus.error && (
                    <pre>{JSON.stringify(healthStatus.error, null, 2)}</pre>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && !healthStatus && (
            <div className="health-error">
              <p className="error-message">{error}</p>
            </div>
          )}
        </section>

        {/* Debugging Information Section */}
        <section className="debug-section">
          <h2>Debugging Tips</h2>
          <ul className="debug-tips">
            <li>
              <strong>API Base URL:</strong> Verify this points to your backend server. 
              Check <code>REACT_APP_API_BASE</code> or <code>REACT_APP_BACKEND_URL</code> in your <code>.env</code> file.
            </li>
            <li>
              <strong>Health Check Path:</strong> Ensure your backend implements this endpoint. 
              Default is <code>/health</code>, configurable via <code>REACT_APP_HEALTHCHECK_PATH</code>.
            </li>
            <li>
              <strong>WebSocket URL:</strong> Required for real-time features. 
              Set <code>REACT_APP_WS_URL</code> to your WebSocket server URL.
            </li>
            <li>
              <strong>CORS Issues:</strong> If health check fails with network errors, verify CORS is properly configured on the backend.
            </li>
            <li>
              <strong>Feature Flags:</strong> Format is <code>flag1:true,flag2:false</code> in <code>REACT_APP_FEATURE_FLAGS</code>.
            </li>
            <li>
              <strong>Log Level:</strong> Set <code>REACT_APP_LOG_LEVEL</code> to <code>debug</code> for verbose logging during development.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Healthcheck;
