import React, { useRef, useEffect } from 'react';
import './MessageList.css';

/**
 * MessageList Component
 * 
 * Displays a scrollable list of chat messages with automatic scrolling to the bottom
 * when new messages arrive. Shows loading indicator when waiting for AI response.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.messages - Array of message objects
 * @param {boolean} props.isLoading - Whether a message is being sent
 * @param {boolean} props.initialLoadComplete - Whether initial history load is complete
 * 
 * PUBLIC_INTERFACE
 */
const MessageList = ({ messages, isLoading, initialLoadComplete }) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  /**
   * Scroll to bottom of message list
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Auto-scroll when messages change
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  /**
   * Format timestamp for display
   * 
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted time string
   */
  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
    return sender === 'user' ? 'message message-user' : 'message message-ai';
  };

  /**
   * Render message status indicator
   * 
   * @param {Object} message - Message object
   * @returns {JSX.Element|null} Status indicator or null
   */
  const renderMessageStatus = (message) => {
    if (message.status === 'error') {
      return <span className="message-status error" title="Failed to send">⚠</span>;
    }
    return null;
  };

  return (
    <div className="message-list" ref={containerRef}>
      <div className="message-list-content">
        {!initialLoadComplete && (
          <div className="loading-history">
            <p>Loading chat history...</p>
          </div>
        )}

        {initialLoadComplete && messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h3>Start a conversation</h3>
            <p>Ask me to create a wireframe or help with your design</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={getMessageClass(message.sender)}>
            <div className="message-header">
              <span className="message-sender">
                {message.sender === 'user' ? 'You' : 'Proto Assistant'}
              </span>
              <span className="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </span>
              {renderMessageStatus(message)}
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message message-ai loading">
            <div className="message-header">
              <span className="message-sender">Proto Assistant</span>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
