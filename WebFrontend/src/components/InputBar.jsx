import React, { useState, useRef, useEffect } from 'react';
import './InputBar.css';

/**
 * InputBar Component
 * 
 * Text input component for sending chat messages.
 * Supports Enter to send, Shift+Enter for newline, and auto-resizing textarea.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Callback when user sends a message
 * @param {boolean} props.isDisabled - Whether input is disabled (e.g., while loading)
 * 
 * PUBLIC_INTERFACE
 */
const InputBar = ({ onSendMessage, isDisabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  /**
   * Auto-resize textarea based on content
   */
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';
      // Set height to scrollHeight (content height)
      const newHeight = Math.min(textareaRef.current.scrollHeight, 150);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  /**
   * Handle input change
   * 
   * @param {Event} e - Change event
   */
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  /**
   * Handle form submission
   * 
   * @param {Event} e - Submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  /**
   * Send message and clear input
   */
  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isDisabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  /**
   * Handle keyboard shortcuts
   * Enter: Send message
   * Shift+Enter: New line
   * 
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="input-bar">
      <form className="input-form" onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          className="message-input"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Shift+Enter for new line)"
          disabled={isDisabled}
          rows={1}
          aria-label="Message input"
        />
        <button
          type="submit"
          className="send-button"
          disabled={isDisabled || !message.trim()}
          aria-label="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default InputBar;
