import React from 'react';
import { Link } from 'react-router-dom';
import './HistoryList.css';

/**
 * HistoryList Component
 * 
 * Displays chat messages and wireframes from history.
 * Messages are displayed in chronological order with sender information.
 * Wireframes are displayed as cards with links to /wireframe/{id}.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {Array} props.wireframes - Array of wireframe specifications
 * 
 * PUBLIC_INTERFACE
 */
const HistoryList = ({ messages = [], wireframes = [] }) => {
  /**
   * Format timestamp for display
   * 
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted time string
   */
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString([], { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return '';
    }
  };

  /**
   * Get CSS class for message based on sender
   * 
   * @param {string} sender - Message sender identifier
   * @returns {string} CSS class name
   */
  const getMessageClass = (sender) => {
    return sender === 'user' ? 'history-message message-user' : 'history-message message-ai';
  };

  /**
   * Truncate text to specified length
   * 
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="history-list">
      {/* Messages Section */}
      {messages.length > 0 && (
        <div className="history-section">
          <h2 className="section-title">
            <span className="section-icon">💬</span>
            Chat Messages ({messages.length})
          </h2>
          <div className="messages-list">
            {messages.map((message) => (
              <div key={message.id} className={getMessageClass(message.sender)}>
                <div className="message-header">
                  <span className="message-sender">
                    {message.sender === 'user' ? 'You' : 'Proto Assistant'}
                  </span>
                  <span className="message-timestamp">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wireframes Section */}
      {wireframes.length > 0 && (
        <div className="history-section">
          <h2 className="section-title">
            <span className="section-icon">📐</span>
            Wireframes ({wireframes.length})
          </h2>
          <div className="wireframes-grid">
            {wireframes.map((wireframe) => (
              <Link 
                key={wireframe.id} 
                to={`/wireframe/${wireframe.id}`}
                className="wireframe-card"
              >
                <div className="wireframe-card-header">
                  <h3 className="wireframe-title">
                    {wireframe.metadata?.name || `Wireframe ${wireframe.id}`}
                  </h3>
                  {wireframe.metadata?.created_at && (
                    <span className="wireframe-date">
                      {formatTimestamp(wireframe.metadata.created_at)}
                    </span>
                  )}
                </div>
                <div className="wireframe-card-body">
                  {wireframe.metadata?.description && (
                    <p className="wireframe-description">
                      {truncateText(wireframe.metadata.description, 150)}
                    </p>
                  )}
                  <div className="wireframe-info">
                    <span className="info-item">
                      {wireframe.components?.length || 0} components
                    </span>
                    <span className="view-link">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State - shown when both messages and wireframes are empty */}
      {messages.length === 0 && wireframes.length === 0 && (
        <div className="history-list-empty">
          <div className="empty-icon">📋</div>
          <h3>No History Yet</h3>
          <p>Start chatting or create wireframes to see your history here</p>
        </div>
      )}
    </div>
  );
};

export default HistoryList;
