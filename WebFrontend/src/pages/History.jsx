import React, { useState, useEffect } from 'react';
import HistoryList from '../components/HistoryList';
import historyApi from '../services/historyApi';
import './History.css';

/**
 * History Page Component
 * 
 * Displays chat and wireframe history for the current session.
 * Fetches data from GET /history endpoint and renders it using HistoryList component.
 * Handles loading, error, and empty states.
 * 
 * PUBLIC_INTERFACE
 */
const History = () => {
  const [messages, setMessages] = useState([]);
  const [wireframes, setWireframes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load history data on component mount
   */
  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Fetch history data from backend
   */
  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const history = await historyApi.getHistory();
      
      // Set messages and wireframes from response
      setMessages(history.messages || []);
      setWireframes(history.wireframes || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      setError(err.message || 'Failed to load history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle clearing error state
   */
  const handleClearError = () => {
    setError(null);
  };

  /**
   * Handle retry action
   */
  const handleRetry = () => {
    loadHistory();
  };

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <h1>History</h1>
          <p>View your chat messages and generated wireframes</p>
        </div>

        {error && (
          <div className="history-error" role="alert">
            <span>{error}</span>
            <button 
              className="error-dismiss" 
              onClick={handleClearError}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <div className="history-content">
          {isLoading && (
            <div className="history-loading">
              <div className="loading-spinner"></div>
              <p>Loading history...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="history-empty">
              <div className="empty-icon">⚠️</div>
              <h2>Failed to Load History</h2>
              <p>{error}</p>
              <button 
                onClick={handleRetry}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--bg-primary)',
                  backgroundColor: 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && (
            <HistoryList 
              messages={messages} 
              wireframes={wireframes}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
