import React from 'react';
import logger from '../utils/logger';

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing
 * the entire application.
 * 
 * PUBLIC_INTERFACE
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  /**
   * Update state when an error is caught
   * 
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state
   */
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  /**
   * Log error details when an error is caught
   * 
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Component stack trace
   */
  componentDidCatch(error, errorInfo) {
    // Log error details
    logger.error('React Error Boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });

    // Update state with error info for display
    this.setState({
      errorInfo
    });

    // If custom error handler is provided, call it
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset error boundary state
   * Allows user to try recovering from the error
   */
  handleReset = () => {
    logger.info('Error boundary reset attempted');
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Call custom reset handler if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Reload the page
   * Last resort recovery option
   */
  handleReload = () => {
    logger.info('Page reload triggered from error boundary');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI can be provided via props
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem'
            }}>
              ⚠️
            </div>
            
            <h1 style={{
              fontSize: '1.75rem',
              margin: '0 0 1rem 0',
              color: 'var(--text-primary)'
            }}>
              Oops! Something went wrong
            </h1>
            
            <p style={{
              fontSize: '1rem',
              margin: '0 0 1.5rem 0',
              opacity: 0.8
            }}>
              We're sorry, but something unexpected happened. The error has been logged 
              and we'll look into it.
            </p>

            {/* Show error details in development mode */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: '1.5rem',
                textAlign: 'left',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.3)',
                borderRadius: '6px',
                padding: '1rem'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#dc3545'
                }}>
                  Error Details (Development Mode)
                </summary>
                <pre style={{
                  fontSize: '0.85rem',
                  overflow: 'auto',
                  margin: '0.5rem 0',
                  color: 'var(--text-primary)'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--button-text)',
                  backgroundColor: 'var(--button-bg)',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
