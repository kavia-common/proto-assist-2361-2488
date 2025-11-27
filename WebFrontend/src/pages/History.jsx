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
        <header className="history-header">
          <h1 className="page-title">History</h1>
          <p className="page-description">View your chat messages and generated wireframes</p>
        </header>

        {error && (
          <div className="history-error" role="alert" aria-live="polite">
            <span>{error}</span>
            <button 
              type="button"
              className="error-dismiss" 
              onClick={handleClearError}
              aria-label="Dismiss error message"
            >
              ×
            </button>
          </div>
        )}

        <section className="history-content" aria-label="History content">
          {isLoading && (
            <div className="history-loading" role="status" aria-live="polite">
              <div className="loading-spinner" aria-hidden="true"></div>
              <p>Loading history...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="history-empty">
              <div className="empty-icon" role="img" aria-label="warning icon">⚠️</div>
              <h2>Failed to Load History</h2>
              <p>{error}</p>
              <button 
                type="button"
                onClick={handleRetry}
                className="retry-btn"
                aria-label="Retry loading history"
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
        </section>
      </div>
    </div>
  );
};

export default History;
