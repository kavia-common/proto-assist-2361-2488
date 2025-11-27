import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import chatApi from '../services/chatApi';
import historyApi from '../services/historyApi';
import './Chat.css';

/**
 * Chat Page Component
 * 
 * Main chat interface page that manages message state and interactions with the AI Agent.
 * Handles message history loading, sending messages, and error states.
 * 
 * PUBLIC_INTERFACE
 */
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  /**
   * Load chat history on component mount
   */
  useEffect(() => {
    loadChatHistory();
  }, []);

  /**
   * Load chat message history from backend
   */
  const loadChatHistory = async () => {
    try {
      const history = await historyApi.getChatHistory();
      if (history && Array.isArray(history)) {
        setMessages(history);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
      // Don't show error for history load failure - just start with empty messages
    } finally {
      setInitialLoadComplete(true);
    }
  };

  /**
   * Handle sending a new message
   * 
   * @param {string} content - Message text content
   */
  const handleSendMessage = async (content) => {
    if (!content.trim()) {
      return;
    }

    // Clear any previous errors
    setError(null);

    // Create user message
    const userMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sender: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to backend and get AI response
      const aiResponse = await chatApi.sendMessage(userMessage);

      // Add AI response to messages
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Failed to send message:', err);
      
      // Update user message status to error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error' }
            : msg
        )
      );

      // Set error message
      setError(err.message || 'Failed to send message. Please try again.');
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

  return (
    <div className="chat-page">
      <div className="chat-container">
        <header className="chat-header">
          <h1 className="page-title">Chat with Proto Assistant</h1>
          <p className="page-description">Ask me to create wireframes or help with your design</p>
        </header>

        {error && (
          <div className="chat-error" role="alert" aria-live="polite">
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

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          initialLoadComplete={initialLoadComplete}
        />
      </div>
    </div>
  );
};

export default Chat;
